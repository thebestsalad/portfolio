import React, { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  getLabs,
  getCategories,
  getExperience,
  getCertifications,
  getRecommendations,
  caseNumber
} from '../lib/data'
import { Section, EvidenceTag, HashStrip, CaseCard, MarkdownLite, Loading, Modal, FileList } from '../components/ui'

// ---------------- HERO ----------------
function HexSignature({ text }) {
  // Signature element: the name rendered as a decoding hexdump line
  const hex = useMemo(
    () =>
      [...text]
        .map((c) => c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join(' '),
    [text]
  )
  const [revealed, setRevealed] = useState(0)
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setRevealed(text.length)
      return
    }
    let i = 0
    const t = setInterval(() => {
      i += 1
      setRevealed(i)
      if (i >= text.length) clearInterval(t)
    }, 55)
    return () => clearInterval(t)
  }, [text])
  return (
    <div className="font-mono text-xs text-faint select-none" aria-hidden="true">
      <span className="text-accent/60">0x00</span> {hex}
      <div className="mt-1">
        <span className="text-accent/60">ascii</span>{' '}
        <span className="text-accent">{text.slice(0, revealed)}</span>
        {revealed < text.length && <span className="animate-pulse">▌</span>}
      </div>
    </div>
  )
}

function Hero({ profile }) {
  return (
    <section className="pt-16 sm:pt-24 pb-10">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-[1fr_auto] gap-10 items-center">
        <div>
          <EvidenceTag>subject · {profile.location}</EvidenceTag>
          <h1 className="display text-4xl sm:text-6xl text-ink mt-5 leading-[1.05]">
            {profile.name}
          </h1>
          <p className="font-mono text-sm text-accent mt-3 uppercase tracking-widest">{profile.headline}</p>
          <p className="mt-5 text-dim max-w-xl leading-relaxed">{profile.tagline || profile.bio}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/labs" className="btn-primary">Open the case files</Link>
            <Link to="/contact" className="btn-ghost">Contact</Link>
            {profile.resume_url && (
              <a href={profile.resume_url} target="_blank" rel="noreferrer" className="btn-ghost">Resume</a>
            )}
          </div>
          <div className="mt-10">
            <HexSignature text={profile.name} />
          </div>
        </div>
        <div className="justify-self-center md:justify-self-end">
          <div className="relative">
            <div className="w-52 h-52 sm:w-64 sm:h-64 rounded-lg overflow-hidden border border-line bg-panel2">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-mono text-faint text-xs">
                  [ headshot.jpg ]
                </div>
              )}
            </div>
            <div className="absolute -bottom-3 -left-3">
              <EvidenceTag>exhibit A</EvidenceTag>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ---------------- SHARED SECTION BODIES ----------------
function ExperienceTimeline({ items }) {
  const [open, setOpen] = useState(null)
  return (
    <div className="relative pl-8">
      <div className="custody-rail absolute left-2 top-1 bottom-1" aria-hidden="true" />
      <ol className="space-y-10">
        {items.map((e) => {
          const hasMore = Boolean(e.description) || (e.files || []).length > 0
          return (
            <li key={e.id} className="relative">
              <span className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full border-2 border-accent bg-carbon" aria-hidden="true" />
              <p className="font-mono text-[11px] uppercase tracking-widest text-faint">{e.dates}</p>
              <h3 className="display text-lg text-ink mt-1">{e.role}</h3>
              <p className="text-sm text-accent/80 font-mono">{e.org}</p>
              <ul className="mt-3 space-y-1.5 text-sm text-dim">
                {(e.bullets || []).map((b, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-faint font-mono select-none">›</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              {hasMore && (
                <button className="mt-3 font-mono text-xs text-accent hover:underline" onClick={() => setOpen(e)}>
                  More details →
                </button>
              )}
            </li>
          )
        })}
      </ol>
      <Modal open={Boolean(open)} onClose={() => setOpen(null)}>
        {open && (
          <>
            <p className="font-mono text-[11px] uppercase tracking-widest text-faint">{open.dates}</p>
            <h3 className="display text-xl text-ink mt-1">{open.role}</h3>
            <p className="text-sm text-accent/80 font-mono">{open.org}</p>
            {open.description && (
              <div className="mt-4">
                <MarkdownLite text={open.description} />
              </div>
            )}
            <FileList files={open.files} />
          </>
        )}
      </Modal>
    </div>
  )
}

function CertGrid({ items }) {
  const [open, setOpen] = useState(null)
  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((c) => (
          <button
            key={c.id}
            onClick={() => setOpen(c)}
            className="text-left bg-panel border border-line rounded-lg p-5 flex flex-col hover:border-accent/50 transition-colors"
          >
            {c.image_url && (
              <img src={c.image_url} alt="" className="h-16 w-16 object-contain mb-4" loading="lazy" />
            )}
            <h3 className="display text-base text-ink">{c.title}</h3>
            <p className="font-mono text-xs text-dim mt-1">{c.issuer}</p>
            <div className="mt-auto pt-4 flex items-center justify-between gap-2">
              <span
                className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border ${
                  c.status === 'Issued'
                    ? 'text-accent border-accent/30'
                    : 'text-manila border-manilaDim/50'
                }`}
              >
                {c.status || 'Issued'}{c.issued ? ` · ${c.issued}` : ''}
              </span>
              <span className="font-mono text-xs text-faint">Details →</span>
            </div>
          </button>
        ))}
      </div>
      <Modal open={Boolean(open)} onClose={() => setOpen(null)}>
        {open && (
          <>
            {open.image_url && <img src={open.image_url} alt="" className="h-20 w-20 object-contain mb-4" />}
            <h3 className="display text-xl text-ink pr-8">{open.title}</h3>
            <p className="font-mono text-xs text-dim mt-1">
              {open.issuer}
              {open.issued ? ` · ${open.issued}` : ''} · {open.status || 'Issued'}
            </p>
            {open.description && (
              <div className="mt-4">
                <MarkdownLite text={open.description} />
              </div>
            )}
            {open.credential_url && (
              <a href={open.credential_url} target="_blank" rel="noreferrer" className="btn-primary mt-5">
                Verify credential
              </a>
            )}
            <FileList files={open.files} />
          </>
        )}
      </Modal>
    </>
  )
}

function RecGrid({ items }) {
  const [open, setOpen] = useState(null)
  const clip = (t, n = 220) => (t && t.length > n ? `${t.slice(0, n).trimEnd()}…` : t)
  return (
    <>
      <div className="grid md:grid-cols-2 gap-5">
        {items.map((r) => (
          <button
            key={r.id}
            onClick={() => setOpen(r)}
            className="text-left bg-panel border border-line rounded-lg p-6 hover:border-accent/50 transition-colors"
          >
            <blockquote className="text-dim leading-relaxed text-sm">“{clip(r.body)}”</blockquote>
            <div className="mt-4 pt-4 border-t border-line flex items-center justify-between gap-3">
              <div>
                <p className="text-ink text-sm font-medium">{r.author}</p>
                <p className="font-mono text-xs text-faint">
                  {[r.role, r.org].filter(Boolean).join(' · ')}
                </p>
              </div>
              <span className="font-mono text-xs text-faint whitespace-nowrap">Read →</span>
            </div>
          </button>
        ))}
      </div>
      <Modal open={Boolean(open)} onClose={() => setOpen(null)}>
        {open && (
          <>
            <p className="font-mono text-[11px] uppercase tracking-widest text-faint">attestation</p>
            <blockquote className="mt-3 text-ink leading-relaxed">“{open.body}”</blockquote>
            <p className="mt-5 text-ink text-sm font-medium">{open.author}</p>
            <p className="font-mono text-xs text-faint">{[open.role, open.org].filter(Boolean).join(' · ')}</p>
            {open.file_url && (
              <a href={open.file_url} target="_blank" rel="noreferrer" className="btn-primary mt-5">
                Full letter (PDF)
              </a>
            )}
            <FileList files={open.files} />
          </>
        )}
      </Modal>
    </>
  )
}

// ---------------- CONTACT ----------------
export function ContactSection({ profile }) {
  const [form, setForm] = useState({ name: '', email: '', message: '', honey: '' })
  const [status, setStatus] = useState({ ok: false, msg: '' })
  const [sending, setSending] = useState(false)
  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  async function onSubmit(e) {
    e.preventDefault()
    if (form.honey) return
    const { name, email, message } = form
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStatus({ ok: false, msg: 'Enter a valid email address.' })
      return
    }
    if (name.trim().length < 2 || message.trim().length < 5) {
      setStatus({ ok: false, msg: 'Add a bit more detail before sending.' })
      return
    }
    setSending(true)
    setStatus({ ok: false, msg: '' })
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${profile.email}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          _subject: 'New message from cesarkdiab.com',
          _template: 'table',
          _captcha: 'false'
        })
      })
      if (!res.ok) throw new Error('network')
      setStatus({ ok: true, msg: 'Message sent.' })
      setForm({ name: '', email: '', message: '', honey: '' })
    } catch {
      setStatus({ ok: false, msg: `Could not send. Email me directly at ${profile.email}.` })
    } finally {
      setSending(false)
    }
  }

  return (
    <Section id="contact" eyebrow="channel" title="Contact">
      <div className="grid md:grid-cols-[1fr_1.2fr] gap-10">
        <div>
          <p className="text-dim leading-relaxed">
            Open to internships, research collaboration, and DFIR conversation. The fastest route is email.
          </p>
          <p className="mt-4 font-mono text-sm">
            <a href={`mailto:${profile.email}`} className="text-accent hover:underline">{profile.email}</a>
          </p>
          {profile.socials?.htb && (
            <p className="mt-2 font-mono text-xs text-faint">HTB ID: {profile.socials.htb}</p>
          )}
        </div>
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <input type="text" name="honey" value={form.honey} onChange={onChange} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <div>
            <label htmlFor="c-name" className="font-mono text-xs text-faint uppercase tracking-wider">Name</label>
            <input id="c-name" name="name" required maxLength={80} value={form.name} onChange={onChange} className="mt-1" placeholder="Jane Doe" />
          </div>
          <div>
            <label htmlFor="c-email" className="font-mono text-xs text-faint uppercase tracking-wider">Email</label>
            <input id="c-email" type="email" name="email" required maxLength={120} value={form.email} onChange={onChange} className="mt-1" placeholder="you@example.com" />
          </div>
          <div>
            <label htmlFor="c-msg" className="font-mono text-xs text-faint uppercase tracking-wider">Message</label>
            <textarea id="c-msg" name="message" rows={4} required maxLength={2000} value={form.message} onChange={onChange} className="mt-1" placeholder="What are you working on?" />
          </div>
          <button disabled={sending} className="btn-primary disabled:opacity-50">
            {sending ? 'Sending…' : 'Send message'}
          </button>
          {status.msg && (
            <p className={`font-mono text-xs ${status.ok ? 'text-accent' : 'text-flag'}`} role="status">
              {status.msg}
            </p>
          )}
        </form>
      </div>
    </Section>
  )
}

// ---------------- PAGES ----------------
export function HomePage({ settings }) {
  const [labs, setLabs] = useState(null)
  const [exp, setExp] = useState(null)
  const [certs, setCerts] = useState(null)
  const [recs, setRecs] = useState(null)
  useEffect(() => {
    getLabs().then(setLabs)
    getExperience().then(setExp)
    getCertifications().then(setCerts)
    getRecommendations().then(setRecs)
  }, [])
  const { profile, about } = settings
  const featured = (labs || []).filter((l) => l.featured).slice(0, 3)
  const shown = featured.length ? featured : (labs || []).slice(0, 3)

  return (
    <>
      <Hero profile={profile} />

      <Section id="about" eyebrow="background" title="About">
        <div className="grid md:grid-cols-[1.4fr_1fr] gap-10">
          <MarkdownLite text={about.body} />
          <div className="space-y-5">
            <div className="bg-panel border border-line rounded-lg p-5">
              <p className="font-mono text-[11px] uppercase tracking-widest text-faint">Education</p>
              <p className="text-ink text-sm mt-2">{about.education?.school}</p>
              <p className="text-dim text-sm mt-1">{about.education?.degree}</p>
              <p className="font-mono text-xs text-faint mt-2">
                {about.education?.grad}{about.education?.gpa ? ` · GPA ${about.education.gpa}` : ''}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {(about.languages || []).map((l) => (
                <span key={l.name} className="font-mono text-[10px] uppercase tracking-wider text-dim border border-line rounded px-2 py-1">
                  {l.name} · {l.level}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(about.skills || {}).map(([group, list]) => (
            <div key={group} className="bg-panel border border-line rounded-lg p-4">
              <p className="font-mono text-[11px] uppercase tracking-widest text-accent/80">{group}</p>
              <p className="mt-2 text-sm text-dim leading-relaxed">{list.join(' · ')}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="labs"
        eyebrow="case files"
        title="Labs & Projects"
        action={<Link to="/labs" className="font-mono text-xs text-accent hover:underline whitespace-nowrap">All cases →</Link>}
      >
        {!labs ? <Loading /> : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {shown.map((lab) => (
              <CaseCard key={lab.id} lab={lab} caseNo={caseNumber(lab, (labs || []).indexOf(lab))} />
            ))}
          </div>
        )}
      </Section>

      <Section id="experience" eyebrow="chain of custody" title="Experience">
        {!exp ? <Loading /> : <ExperienceTimeline items={exp} />}
      </Section>

      <Section
        id="certifications"
        eyebrow="credentials"
        title="Certifications"
        action={<Link to="/certifications" className="font-mono text-xs text-accent hover:underline whitespace-nowrap">All →</Link>}
      >
        {!certs ? <Loading /> : <CertGrid items={certs.slice(0, 3)} />}
      </Section>

      <Section
        id="recommendations"
        eyebrow="attestations"
        title="Recommendations"
        action={<Link to="/recommendations" className="font-mono text-xs text-accent hover:underline whitespace-nowrap">All →</Link>}
      >
        {!recs ? <Loading /> : <RecGrid items={recs.slice(0, 2)} />}
      </Section>

      <ContactSection profile={profile} />
    </>
  )
}

export function LabsPage() {
  const [labs, setLabs] = useState(null)
  const [cats, setCats] = useState([])
  const [cat, setCat] = useState('')
  const [tag, setTag] = useState('')
  const [q, setQ] = useState('')
  useEffect(() => {
    getLabs().then(setLabs)
    getCategories().then(setCats)
  }, [])

  const tags = useMemo(() => [...new Set((labs || []).flatMap((l) => l.tags || []))], [labs])

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return (labs || []).filter((l) => {
      if (cat && (l.category || 'Uncategorized') !== cat) return false
      if (tag && !(l.tags || []).includes(tag)) return false
      if (needle) {
        const hay = [l.title, l.summary, l.description, ...(l.tags || []), l.category]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        if (!hay.includes(needle)) return false
      }
      return true
    })
  }, [labs, cat, tag, q])

  // Only show categories that actually contain labs, in admin-defined order
  const activeCats = useMemo(() => {
    const present = new Set((labs || []).map((l) => l.category).filter(Boolean))
    const ordered = cats.map((c) => c.name).filter((n) => present.has(n))
    const orphans = [...present].filter((n) => !ordered.includes(n))
    return [...ordered, ...orphans]
  }, [labs, cats])

  const chip = (active) =>
    `font-mono text-xs px-3 py-1.5 rounded border transition-colors ${
      active ? 'border-accent text-accent' : 'border-line text-dim hover:text-ink'
    }`

  return (
    <Section eyebrow="evidence locker" title="Labs & Projects">
      {!labs ? <Loading /> : (
        <>
          <div className="mb-6 max-w-md relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-faint text-xs select-none" aria-hidden="true">/</span>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search cases by title, tag, or keyword…"
              aria-label="Search labs"
              className="pl-8"
            />
          </div>
          {activeCats.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              <button onClick={() => setCat('')} className={chip(!cat)}>All categories</button>
              {activeCats.map((c) => (
                <button key={c} onClick={() => setCat(c === cat ? '' : c)} className={chip(cat === c)}>{c}</button>
              ))}
            </div>
          )}
          <div className="flex flex-wrap gap-2 mb-8">
            {tags.map((t) => (
              <button key={t} onClick={() => setTag(t === tag ? '' : t)} className={chip(tag === t).replace('text-xs', 'text-[10px] uppercase tracking-wider')}>
                {t}
              </button>
            ))}
          </div>
          <p className="font-mono text-[11px] text-faint mb-4">
            {shown.length} of {labs.length} case{labs.length === 1 ? '' : 's'}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {shown.map((lab) => (
              <CaseCard key={lab.id} lab={lab} caseNo={caseNumber(lab, labs.indexOf(lab))} />
            ))}
          </div>
          {!shown.length && (
            <p className="font-mono text-xs text-faint">
              No cases match. Clear the search or filters to see everything.
            </p>
          )}
        </>
      )}
    </Section>
  )
}

export function LabDetailPage() {
  const { slug } = useParams()
  const [lab, setLab] = useState(undefined)
  const [caseNo, setCaseNo] = useState('')
  useEffect(() => {
    getLabs().then((labs) => {
      const found = labs.find((l) => l.slug === slug) || null
      setLab(found)
      if (found) setCaseNo(caseNumber(found, labs.indexOf(found)))
    })
  }, [slug])

  if (lab === undefined) return <Loading />
  if (lab === null) {
    return (
      <Section eyebrow="404" title="Case not found">
        <Link to="/labs" className="btn-ghost">← Back to case files</Link>
      </Section>
    )
  }
  return (
    <article className="max-w-4xl mx-auto px-4 py-14">
      <Link to="/labs" className="font-mono text-xs text-dim hover:text-accent">← All cases</Link>
      <div className="mt-6 flex items-center gap-3 flex-wrap">
        <EvidenceTag>{caseNo}</EvidenceTag>
        <span className="font-mono text-xs text-faint">{lab.lab_date}</span>
      </div>
      <h1 className="display text-3xl sm:text-4xl text-ink mt-4">{lab.title}</h1>
      <HashStrip input={lab.title} />
      <div className="mt-4 flex flex-wrap gap-2">
        {(lab.tags || []).map((t) => (
          <span key={t} className="font-mono text-[10px] uppercase tracking-wider text-accent/80 border border-accent/25 rounded px-2 py-0.5">
            {t}
          </span>
        ))}
      </div>
      {lab.cover_url && (
        <img src={lab.cover_url} alt={lab.title} className="mt-8 w-full rounded-lg border border-line" />
      )}
      <p className="mt-8 text-ink leading-relaxed">{lab.summary}</p>
      <div className="mt-6">
        <MarkdownLite text={lab.description} />
      </div>

      {(lab.links?.repo || lab.links?.writeup || lab.links?.external) && (
        <div className="mt-10 flex flex-wrap gap-3">
          {lab.links.repo && <a href={lab.links.repo} target="_blank" rel="noreferrer" className="btn-primary">GitHub repo</a>}
          {lab.links.writeup && <a href={lab.links.writeup} target="_blank" rel="noreferrer" className="btn-ghost">Write-up</a>}
          {lab.links.external && <a href={lab.links.external} target="_blank" rel="noreferrer" className="btn-ghost">Lab page</a>}
        </div>
      )}

      {(lab.files || []).length > 0 && (
        <div className="mt-10">
          <h2 className="display text-xl text-ink border-b border-line pb-2">Attached material</h2>
          <ul className="mt-4 space-y-2">
            {lab.files.map((f, i) => (
              <li key={i} className="flex items-center justify-between gap-4 bg-panel border border-line rounded px-4 py-3">
                <span className="font-mono text-sm text-ink truncate">{f.label}</span>
                <span className="flex gap-3 whitespace-nowrap">
                  <a href={f.url} target="_blank" rel="noreferrer" className="font-mono text-xs text-accent hover:underline">View</a>
                  <a href={f.url} download className="font-mono text-xs text-dim hover:text-ink hover:underline">Download</a>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  )
}

export function ExperiencePage() {
  const [exp, setExp] = useState(null)
  useEffect(() => {
    getExperience().then(setExp)
  }, [])
  return (
    <Section eyebrow="chain of custody" title="Experience">
      {!exp ? <Loading /> : <ExperienceTimeline items={exp} />}
    </Section>
  )
}

export function CertificationsPage() {
  const [certs, setCerts] = useState(null)
  useEffect(() => {
    getCertifications().then(setCerts)
  }, [])
  return (
    <Section eyebrow="credentials" title="Certifications">
      {!certs ? <Loading /> : <CertGrid items={certs} />}
    </Section>
  )
}

export function RecommendationsPage() {
  const [recs, setRecs] = useState(null)
  useEffect(() => {
    getRecommendations().then(setRecs)
  }, [])
  return (
    <Section eyebrow="attestations" title="Recommendations">
      {!recs ? <Loading /> : <RecGrid items={recs} />}
    </Section>
  )
}

export function ContactPage({ settings }) {
  return <ContactSection profile={settings.profile} />
}
