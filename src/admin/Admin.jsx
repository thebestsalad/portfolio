import React, { useCallback, useEffect, useState } from 'react'
import { supabase, supabaseConfigured } from '../lib/supabase'

/*
  Admin console. Reached only via the hidden path (see App.jsx).
  Security model:
  - Authentication: Supabase Auth (server-side bcrypt + JWT). No credentials
    or hashes live in this bundle.
  - Authorization: Postgres Row Level Security. Every write requires a valid
    authenticated session; the anon role can only read published rows.
  - Disable public signups in the Supabase dashboard so the only account is yours.
*/

// ---------------- FIELD SCHEMAS ----------------
const RESOURCES = {
  categories: {
    label: 'Categories',
    table: 'lab_categories',
    order: { col: 'sort', asc: true },
    titleField: 'name',
    fields: [
      { key: 'name', label: 'Category name', type: 'text', required: true },
      { key: 'sort', label: 'Sort order', type: 'number' }
    ]
  },
  labs: {
    label: 'Labs',
    table: 'labs',
    order: { col: 'lab_date', asc: false },
    titleField: 'title',
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'slug', label: 'Slug (url path)', type: 'text', required: true, hint: 'lowercase-with-dashes' },
      { key: 'category', label: 'Category', type: 'category', hint: 'manage the list in the Categories tab' },
      { key: 'summary', label: 'Summary (card text, truncates on cards)', type: 'textarea' },
      { key: 'description', label: 'Full description', type: 'textarea', rows: 10, hint: 'Supports: blank-line paragraphs, "## " headings, "- " bullets, ``` code blocks' },
      { key: 'cover_url', label: 'Cover image', type: 'image' },
      { key: 'tags', label: 'Tags', type: 'tags', hint: 'comma separated' },
      { key: 'links', label: 'Links', type: 'links' },
      { key: 'files', label: 'Attached files', type: 'files' },
      { key: 'lab_date', label: 'Date', type: 'date' },
      { key: 'featured', label: 'Featured on homepage', type: 'bool' },
      { key: 'published', label: 'Published', type: 'bool', default: true }
    ]
  },
  experience: {
    label: 'Experience',
    table: 'experience',
    order: { col: 'sort', asc: true },
    titleField: 'role',
    fields: [
      { key: 'role', label: 'Role', type: 'text', required: true },
      { key: 'org', label: 'Organization', type: 'text', required: true },
      { key: 'dates', label: 'Dates', type: 'text', hint: 'e.g. Sep 2025 – Present' },
      { key: 'bullets', label: 'Bullets', type: 'lines', hint: 'one per line' },
      { key: 'description', label: 'Details (shown in popup)', type: 'textarea', rows: 5 },
      { key: 'files', label: 'Attached files (shown in popup)', type: 'files' },
      { key: 'sort', label: 'Sort order', type: 'number' }
    ]
  },
  certifications: {
    label: 'Certifications',
    table: 'certifications',
    order: { col: 'sort', asc: true },
    titleField: 'title',
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'issuer', label: 'Issuer', type: 'text' },
      { key: 'status', label: 'Status', type: 'select', options: ['Issued', 'In progress'] },
      { key: 'issued', label: 'Issue date / year', type: 'text' },
      { key: 'description', label: 'Details (shown in popup)', type: 'textarea', rows: 5 },
      { key: 'credential_url', label: 'Verification URL', type: 'text' },
      { key: 'image_url', label: 'Badge image', type: 'image' },
      { key: 'files', label: 'Attached files (shown in popup)', type: 'files' },
      { key: 'sort', label: 'Sort order', type: 'number' }
    ]
  },
  recommendations: {
    label: 'Recommendations',
    table: 'recommendations',
    order: { col: 'sort', asc: true },
    titleField: 'author',
    fields: [
      { key: 'author', label: 'Author', type: 'text', required: true },
      { key: 'role', label: 'Author role', type: 'text' },
      { key: 'org', label: 'Organization', type: 'text' },
      { key: 'body', label: 'Quote / note', type: 'textarea', rows: 5 },
      { key: 'file_url', label: 'Full letter (PDF)', type: 'file' },
      { key: 'files', label: 'Additional files (shown in popup)', type: 'files' },
      { key: 'sort', label: 'Sort order', type: 'number' },
      { key: 'published', label: 'Published', type: 'bool', default: true }
    ]
  }
}

// ---------------- UPLOAD HELPER ----------------
async function uploadToStorage(file, folder) {
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const path = `${folder}/${Date.now()}-${safe}`
  const { error } = await supabase.storage.from('media').upload(path, file, { upsert: false })
  if (error) throw error
  const { data } = supabase.storage.from('media').getPublicUrl(path)
  return data.publicUrl
}

function UploadButton({ folder, onUploaded, accept, label = 'Upload' }) {
  const [busy, setBusy] = useState(false)
  return (
    <label className={`btn-ghost cursor-pointer ${busy ? 'opacity-50 pointer-events-none' : ''}`}>
      {busy ? 'Uploading…' : label}
      <input
        type="file"
        accept={accept}
        className="hidden"
        onChange={async (e) => {
          const f = e.target.files?.[0]
          if (!f) return
          setBusy(true)
          try {
            const url = await uploadToStorage(f, folder)
            onUploaded(url, f.name)
          } catch (err) {
            alert(`Upload failed: ${err.message}`)
          } finally {
            setBusy(false)
            e.target.value = ''
          }
        }}
      />
    </label>
  )
}

// ---------------- CATEGORY SELECT (options from lab_categories) ----------------
function CategorySelect({ value, onChange }) {
  const [opts, setOpts] = useState(null)
  useEffect(() => {
    supabase
      .from('lab_categories')
      .select('name')
      .order('sort')
      .then(({ data }) => setOpts((data || []).map((r) => r.name)))
  }, [])
  return (
    <select value={value || ''} onChange={(e) => onChange(e.target.value)}>
      <option value="">— no category —</option>
      {(opts || []).map((n) => (
        <option key={n}>{n}</option>
      ))}
      {value && opts && !opts.includes(value) && <option>{value}</option>}
    </select>
  )
}

// ---------------- FIELD RENDERER ----------------
function Field({ field, value, onChange }) {
  const label = (
    <label className="font-mono text-xs text-faint uppercase tracking-wider block mb-1">
      {field.label}
      {field.hint && <span className="normal-case tracking-normal text-faint/70"> — {field.hint}</span>}
    </label>
  )
  switch (field.type) {
    case 'category':
      return (
        <div>
          {label}
          <CategorySelect value={value} onChange={onChange} />
        </div>
      )
    case 'textarea':
      return (
        <div>
          {label}
          <textarea rows={field.rows || 3} value={value || ''} onChange={(e) => onChange(e.target.value)} />
        </div>
      )
    case 'bool':
      return (
        <label className="flex items-center gap-2 font-mono text-xs text-dim uppercase tracking-wider cursor-pointer">
          <input type="checkbox" className="w-4 h-4 accent-[#5EEAD4]" style={{ width: 16 }} checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
          {field.label}
        </label>
      )
    case 'date':
      return (
        <div>
          {label}
          <input type="date" value={value || ''} onChange={(e) => onChange(e.target.value)} />
        </div>
      )
    case 'number':
      return (
        <div>
          {label}
          <input type="number" value={value ?? ''} onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))} />
        </div>
      )
    case 'select':
      return (
        <div>
          {label}
          <select value={value || field.options[0]} onChange={(e) => onChange(e.target.value)}>
            {field.options.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
      )
    case 'tags':
      return (
        <div>
          {label}
          <input
            value={(value || []).join(', ')}
            onChange={(e) => onChange(e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
          />
        </div>
      )
    case 'lines':
      return (
        <div>
          {label}
          <textarea
            rows={4}
            value={(value || []).join('\n')}
            onChange={(e) => onChange(e.target.value.split('\n').filter((s) => s.trim()))}
          />
        </div>
      )
    case 'links': {
      const v = value || {}
      const set = (k, val) => onChange({ ...v, [k]: val })
      return (
        <div>
          {label}
          <div className="grid sm:grid-cols-3 gap-2">
            {['repo', 'writeup', 'external'].map((k) => (
              <input key={k} placeholder={k} value={v[k] || ''} onChange={(e) => set(k, e.target.value)} />
            ))}
          </div>
        </div>
      )
    }
    case 'image':
      return (
        <div>
          {label}
          <div className="flex items-center gap-3">
            {value && <img src={value} alt="" className="h-14 w-14 object-cover rounded border border-line" />}
            <input value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder="https://… or upload →" />
            <UploadButton folder="images" accept="image/*" onUploaded={(url) => onChange(url)} />
            {value && (
              <button type="button" className="btn-danger" onClick={() => onChange('')}>Clear</button>
            )}
          </div>
        </div>
      )
    case 'file':
      return (
        <div>
          {label}
          <div className="flex items-center gap-3">
            <input value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder="https://… or upload →" />
            <UploadButton folder="files" onUploaded={(url) => onChange(url)} />
          </div>
        </div>
      )
    case 'files': {
      const list = value || []
      return (
        <div>
          {label}
          <div className="space-y-2">
            {list.map((f, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  className="max-w-[180px]"
                  value={f.label}
                  onChange={(e) => onChange(list.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))}
                />
                <input
                  value={f.url}
                  onChange={(e) => onChange(list.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)))}
                />
                <button type="button" className="btn-danger" onClick={() => onChange(list.filter((_, j) => j !== i))}>×</button>
              </div>
            ))}
            <UploadButton
              folder="labs"
              label="Upload file"
              onUploaded={(url, name) => onChange([...list, { label: name, url }])}
            />
          </div>
        </div>
      )
    }
    default:
      return (
        <div>
          {label}
          <input value={value || ''} onChange={(e) => onChange(e.target.value)} required={field.required} />
        </div>
      )
  }
}

// ---------------- GENERIC RESOURCE EDITOR ----------------
function ResourceEditor({ resource }) {
  const cfg = RESOURCES[resource]
  const [rows, setRows] = useState(null)
  const [editing, setEditing] = useState(null) // null | 'new' | row object
  const [draft, setDraft] = useState({})
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from(cfg.table)
      .select('*')
      .order(cfg.order.col, { ascending: cfg.order.asc })
    if (error) setErr(error.message)
    else setRows(data || [])
  }, [cfg])

  useEffect(() => {
    load()
  }, [load])

  function startNew() {
    const d = {}
    cfg.fields.forEach((f) => {
      if (f.default !== undefined) d[f.key] = f.default
    })
    setDraft(d)
    setEditing('new')
    setErr('')
  }

  function startEdit(row) {
    setDraft({ ...row })
    setEditing(row)
    setErr('')
  }

  async function save() {
    setSaving(true)
    setErr('')
    try {
      const payload = { ...draft }
      delete payload.id
      delete payload.created_at
      let res
      if (editing === 'new') {
        res = await supabase.from(cfg.table).insert(payload)
      } else {
        res = await supabase.from(cfg.table).update(payload).eq('id', editing.id)
      }
      if (res.error) throw res.error
      setEditing(null)
      await load()
    } catch (e) {
      setErr(e.message)
    } finally {
      setSaving(false)
    }
  }

  async function remove(row) {
    if (!confirm(`Delete "${row[cfg.titleField]}"? This is permanent.`)) return
    const { error } = await supabase.from(cfg.table).delete().eq('id', row.id)
    if (error) setErr(error.message)
    else load()
  }

  if (editing !== null) {
    return (
      <div className="space-y-4 max-w-3xl">
        <div className="flex items-center justify-between">
          <h2 className="display text-xl text-ink">{editing === 'new' ? `New ${cfg.label.slice(0, -1)}` : `Edit: ${editing[cfg.titleField]}`}</h2>
          <button className="btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
        </div>
        {cfg.fields.map((f) => (
          <Field key={f.key} field={f} value={draft[f.key]} onChange={(v) => setDraft((d) => ({ ...d, [f.key]: v }))} />
        ))}
        {err && <p className="font-mono text-xs text-flag">{err}</p>}
        <button className="btn-primary" onClick={save} disabled={saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="display text-xl text-ink">{cfg.label}</h2>
        <button className="btn-primary" onClick={startNew}>+ New</button>
      </div>
      {err && <p className="font-mono text-xs text-flag mb-3">{err}</p>}
      {!rows ? (
        <p className="font-mono text-xs text-faint">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="font-mono text-xs text-faint">Nothing here yet. Create the first entry.</p>
      ) : (
        <ul className="divide-y divide-line border border-line rounded-lg overflow-hidden">
          {rows.map((row) => (
            <li key={row.id} className="flex items-center justify-between gap-4 px-4 py-3 bg-panel hover:bg-panel2">
              <div className="min-w-0">
                <p className="text-sm text-ink truncate">{row[cfg.titleField]}</p>
                <p className="font-mono text-[11px] text-faint truncate">
                  {row.published === false && '⏸ unpublished · '}
                  {row.lab_date || row.dates || row.issued || row.org || ''}
                </p>
              </div>
              <div className="flex gap-2 whitespace-nowrap">
                <button className="btn-ghost" onClick={() => startEdit(row)}>Edit</button>
                <button className="btn-danger" onClick={() => remove(row)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ---------------- SETTINGS EDITOR (profile + about) ----------------
function SettingsEditor() {
  const [settings, setSettings] = useState(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('key,value')
      .then(({ data }) => {
        const out = { profile: {}, about: {} }
        for (const row of data || []) out[row.key] = row.value
        setSettings(out)
      })
  }, [])

  if (!settings) return <p className="font-mono text-xs text-faint">Loading…</p>

  const p = settings.profile || {}
  const a = settings.about || {}
  const setP = (k, v) => setSettings((s) => ({ ...s, profile: { ...s.profile, [k]: v } }))
  const setA = (k, v) => setSettings((s) => ({ ...s, about: { ...s.about, [k]: v } }))

  async function save() {
    setSaving(true)
    setMsg('')
    try {
      for (const key of ['profile', 'about']) {
        const { error } = await supabase
          .from('site_settings')
          .upsert({ key, value: settings[key] }, { onConflict: 'key' })
        if (error) throw error
      }
      setMsg('Saved.')
    } catch (e) {
      setMsg(`Error: ${e.message}`)
    } finally {
      setSaving(false)
    }
  }

  const text = (label, val, set, hint) => (
    <div>
      <label className="font-mono text-xs text-faint uppercase tracking-wider block mb-1">
        {label}{hint && <span className="normal-case tracking-normal"> — {hint}</span>}
      </label>
      <input value={val || ''} onChange={(e) => set(e.target.value)} />
    </div>
  )

  return (
    <div className="space-y-5 max-w-3xl">
      <h2 className="display text-xl text-ink">Home & About content</h2>
      {text('Name', p.name, (v) => setP('name', v))}
      {text('Headline', p.headline, (v) => setP('headline', v))}
      {text('Tagline (hero)', p.tagline, (v) => setP('tagline', v))}
      <div>
        <label className="font-mono text-xs text-faint uppercase tracking-wider block mb-1">Short bio</label>
        <textarea rows={3} value={p.bio || ''} onChange={(e) => setP('bio', e.target.value)} />
      </div>
      {text('Location', p.location, (v) => setP('location', v))}
      {text('Contact email', p.email, (v) => setP('email', v))}
      <Field field={{ key: 'avatar_url', label: 'Headshot', type: 'image' }} value={p.avatar_url} onChange={(v) => setP('avatar_url', v)} />
      <Field field={{ key: 'resume_url', label: 'Resume (PDF)', type: 'file' }} value={p.resume_url} onChange={(v) => setP('resume_url', v)} />
      <div className="grid sm:grid-cols-3 gap-2">
        {text('LinkedIn', p.socials?.linkedin, (v) => setP('socials', { ...p.socials, linkedin: v }))}
        {text('GitHub', p.socials?.github, (v) => setP('socials', { ...p.socials, github: v }))}
        {text('HTB ID', p.socials?.htb, (v) => setP('socials', { ...p.socials, htb: v }))}
      </div>
      <div>
        <label className="font-mono text-xs text-faint uppercase tracking-wider block mb-1">
          About body — paragraphs separated by blank lines
        </label>
        <textarea rows={6} value={a.body || ''} onChange={(e) => setA('body', e.target.value)} />
      </div>
      <div>
        <label className="font-mono text-xs text-faint uppercase tracking-wider block mb-1">
          Skills — JSON object of group → list
        </label>
        <textarea
          rows={8}
          className="font-mono text-xs"
          defaultValue={JSON.stringify(a.skills || {}, null, 2)}
          onBlur={(e) => {
            try {
              setA('skills', JSON.parse(e.target.value))
              setMsg('')
            } catch {
              setMsg('Skills JSON is invalid — fix before saving.')
            }
          }}
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-2">
        {text('School', a.education?.school, (v) => setA('education', { ...a.education, school: v }))}
        {text('Degree', a.education?.degree, (v) => setA('education', { ...a.education, degree: v }))}
        {text('Graduation', a.education?.grad, (v) => setA('education', { ...a.education, grad: v }))}
        {text('GPA', a.education?.gpa, (v) => setA('education', { ...a.education, gpa: v }))}
      </div>
      {msg && <p className={`font-mono text-xs ${msg.startsWith('Error') || msg.includes('invalid') ? 'text-flag' : 'text-accent'}`}>{msg}</p>}
      <button className="btn-primary" onClick={save} disabled={saving}>
        {saving ? 'Saving…' : 'Save all settings'}
      </button>
    </div>
  )
}

// ---------------- LOGIN ----------------
function Login({ onSession }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setErr('')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    setBusy(false)
    if (error) {
      // Deliberately generic: no username/password disambiguation
      setErr('Authentication failed.')
      return
    }
    onSession(data.session)
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm bg-panel border border-line rounded-lg p-8 space-y-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-faint">restricted</p>
        <h1 className="display text-xl text-ink">Console access</h1>
        <div>
          <label htmlFor="a-email" className="font-mono text-xs text-faint uppercase tracking-wider">Email</label>
          <input id="a-email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" required />
        </div>
        <div>
          <label htmlFor="a-pass" className="font-mono text-xs text-faint uppercase tracking-wider">Password</label>
          <input id="a-pass" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1" required />
        </div>
        {err && <p className="font-mono text-xs text-flag" role="alert">{err}</p>}
        <button className="btn-primary w-full justify-center" disabled={busy}>
          {busy ? 'Verifying…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}

// ---------------- CONSOLE SHELL ----------------
const TABS = ['settings', 'labs', 'categories', 'experience', 'certifications', 'recommendations']

export default function Admin() {
  const [session, setSession] = useState(null)
  const [ready, setReady] = useState(false)
  const [tab, setTab] = useState('settings')

  useEffect(() => {
    if (!supabase) {
      setReady(true)
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setReady(true)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  if (!supabaseConfigured) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24">
        <h1 className="display text-2xl text-ink">Console unavailable</h1>
        <p className="mt-3 text-dim text-sm leading-relaxed">
          Supabase is not configured. Set <code className="font-mono text-accent">VITE_SUPABASE_URL</code> and{' '}
          <code className="font-mono text-accent">VITE_SUPABASE_ANON_KEY</code> in your <code className="font-mono">.env</code>,
          run the SQL in <code className="font-mono">supabase/schema.sql</code>, and create your admin user. See SETUP.md.
        </p>
      </div>
    )
  }

  if (!ready) return null
  if (!session) return <Login onSession={setSession} />

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between border-b border-line pb-4 mb-8">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-faint">console</p>
          <h1 className="display text-2xl text-ink">Site administration</h1>
        </div>
        <button className="btn-ghost" onClick={() => supabase.auth.signOut()}>Sign out</button>
      </div>
      <div className="flex flex-wrap gap-2 mb-8">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`font-mono text-xs uppercase tracking-wider px-3 py-1.5 rounded border ${
              tab === t ? 'border-accent text-accent' : 'border-line text-dim hover:text-ink'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === 'settings' ? <SettingsEditor /> : <ResourceEditor key={tab} resource={tab} />}
    </div>
  )
}
