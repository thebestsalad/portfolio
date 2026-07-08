import React, { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { sha256Hex } from '../lib/data'

// ---------------- HEADER ----------------
export function Header({ profile }) {
  const [open, setOpen] = useState(false)
  const links = [
    { to: '/labs', label: 'Labs' },
    { to: '/experience', label: 'Experience' },
    { to: '/certifications', label: 'Certifications' },
    { to: '/recommendations', label: 'Recommendations' },
    { to: '/contact', label: 'Contact' }
  ]
  const navCls = ({ isActive }) =>
    `font-mono text-xs uppercase tracking-widest px-3 py-2 transition-colors ${
      isActive ? 'text-accent' : 'text-dim hover:text-ink'
    }`
  return (
    <header className="sticky top-0 z-40 bg-carbon/85 backdrop-blur border-b border-line">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="w-2 h-2 rounded-full bg-accent group-hover:animate-pulse" aria-hidden="true" />
          <span className="font-mono text-sm text-ink tracking-tight">
            cesarkdiab<span className="text-faint">.com</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={navCls}>
              {l.label}
            </NavLink>
          ))}
          {profile?.resume_url && (
            <a href={profile.resume_url} target="_blank" rel="noreferrer" className="btn-primary ml-3">
              Resume
            </a>
          )}
        </nav>
        <button
          className="md:hidden btn-ghost"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>
      {open && (
        <nav className="md:hidden border-t border-line bg-panel px-4 py-3 flex flex-col">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={navCls} onClick={() => setOpen(false)}>
              {l.label}
            </NavLink>
          ))}
          {profile?.resume_url && (
            <a href={profile.resume_url} target="_blank" rel="noreferrer" className="btn-primary mt-2 self-start">
              Resume
            </a>
          )}
        </nav>
      )}
    </header>
  )
}

// ---------------- FOOTER ----------------
export function Footer({ profile }) {
  return (
    <footer className="border-t border-line mt-24">
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-mono text-xs text-faint">
          © {new Date().getFullYear()} {profile?.name || 'Cesar K. Diab'} · evidence-first, report-driven
        </p>
        <div className="flex items-center gap-4 font-mono text-xs">
          {profile?.socials?.github && (
            <a className="text-dim hover:text-accent" href={profile.socials.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          )}
          {profile?.socials?.linkedin && (
            <a className="text-dim hover:text-accent" href={profile.socials.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          )}
          {profile?.email && (
            <a className="text-dim hover:text-accent" href={`mailto:${profile.email}`}>
              Email
            </a>
          )}
        </div>
      </div>
    </footer>
  )
}

// ---------------- SECTION ----------------
export function Section({ id, eyebrow, title, action, children }) {
  return (
    <section id={id} className="scroll-mt-20 py-14">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-end justify-between gap-4 border-b border-line pb-3 mb-8">
          <div>
            {eyebrow && <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-faint">{eyebrow}</p>}
            <h2 className="display text-2xl sm:text-3xl text-ink mt-1">{title}</h2>
          </div>
          {action}
        </div>
        {children}
      </div>
    </section>
  )
}

// ---------------- EVIDENCE TAG + HASH ----------------
export const EvidenceTag = ({ children }) => <span className="evidence-tag">{children}</span>

export function HashStrip({ input, prefix = 'sha256' }) {
  const [hash, setHash] = useState('')
  useEffect(() => {
    let live = true
    sha256Hex(input || '').then((h) => live && setHash(h))
    return () => {
      live = false
    }
  }, [input])
  if (!hash) return null
  return (
    <p className="hash-strip" title={`SHA-256 of "${input}"`}>
      {prefix}:{hash.slice(0, 32)}…
    </p>
  )
}

// ---------------- CASE CARD (labs) ----------------
export function CaseCard({ lab, caseNo }) {
  return (
    <Link
      to={`/labs/${lab.slug}`}
      className="group block bg-panel border border-line rounded-lg overflow-hidden hover:border-accent/50 transition-colors"
    >
      <div className="aspect-[16/9] bg-panel2 relative overflow-hidden">
        {lab.cover_url ? (
          <img
            src={lab.cover_url}
            alt={lab.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center font-mono text-faint text-xs">
            [ no cover image ]
          </div>
        )}
        <div className="absolute top-3 left-3">
          <EvidenceTag>{caseNo}</EvidenceTag>
        </div>
      </div>
      <div className="p-5">
        <div className="flex flex-wrap gap-2 mb-3">
          {lab.category && (
            <span className="font-mono text-[10px] uppercase tracking-wider text-manila border border-manilaDim/50 rounded px-2 py-0.5">
              {lab.category}
            </span>
          )}
          {(lab.tags || []).map((t) => (
            <span key={t} className="font-mono text-[10px] uppercase tracking-wider text-accent/80 border border-accent/25 rounded px-2 py-0.5">
              {t}
            </span>
          ))}
        </div>
        <h3 className="display text-lg text-ink group-hover:text-accent transition-colors">{lab.title}</h3>
        <p className="mt-2 text-sm text-dim line-clamp-3">{lab.summary}</p>
        <div className="mt-4 pt-3 border-t border-line flex items-center justify-between gap-3">
          <HashStrip input={lab.title} />
          <span className="font-mono text-[10px] text-faint whitespace-nowrap">{lab.lab_date || ''}</span>
        </div>
      </div>
    </Link>
  )
}

// ---------------- MARKDOWN-LITE (safe, no HTML injection) ----------------
export function MarkdownLite({ text }) {
  if (!text) return null
  const blocks = text.split(/\n{2,}/)
  return (
    <div className="space-y-4 text-dim leading-relaxed">
      {blocks.map((block, i) => {
        const lines = block.split('\n')
        if (lines.every((l) => l.trim().startsWith('- '))) {
          return (
            <ul key={i} className="list-none space-y-1.5">
              {lines.map((l, j) => (
                <li key={j} className="flex gap-2">
                  <span className="text-accent font-mono select-none">›</span>
                  <span>{l.trim().slice(2)}</span>
                </li>
              ))}
            </ul>
          )
        }
        if (block.startsWith('## ')) {
          return (
            <h3 key={i} className="display text-lg text-ink pt-2">
              {block.slice(3)}
            </h3>
          )
        }
        if (block.startsWith('```') && block.endsWith('```')) {
          return (
            <pre key={i} className="bg-panel2 border border-line rounded p-4 font-mono text-xs text-ink overflow-x-auto">
              {block.replace(/^```\w*\n?/, '').replace(/```$/, '')}
            </pre>
          )
        }
        return <p key={i}>{block}</p>
      })}
    </div>
  )
}

// ---------------- MODAL ----------------
export function Modal({ open, onClose, children }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-carbon/80 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-xl max-h-[85vh] overflow-y-auto bg-panel border border-line rounded-lg p-6 sm:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 font-mono text-dim hover:text-ink text-sm border border-line rounded px-2 py-0.5"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  )
}

// ---------------- FILE / LINK LIST (inside modals) ----------------
export function FileList({ files, title = 'Attached material' }) {
  if (!files?.length) return null
  return (
    <div className="mt-6">
      <p className="font-mono text-[11px] uppercase tracking-widest text-faint border-b border-line pb-2">{title}</p>
      <ul className="mt-3 space-y-2">
        {files.map((f, i) => (
          <li key={i} className="flex items-center justify-between gap-4 bg-panel2 border border-line rounded px-3 py-2">
            <span className="font-mono text-sm text-ink truncate">{f.label}</span>
            <span className="flex gap-3 whitespace-nowrap">
              <a href={f.url} target="_blank" rel="noreferrer" className="font-mono text-xs text-accent hover:underline">View</a>
              <a href={f.url} download className="font-mono text-xs text-dim hover:text-ink hover:underline">Download</a>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Loading() {
  return <p className="font-mono text-xs text-faint py-16 text-center animate-pulse">[ loading… ]</p>
}
