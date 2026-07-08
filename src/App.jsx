import React, { Suspense, lazy, useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { getSettings, SEED } from './lib/data'
import { Header, Footer, Loading } from './components/ui'
import {
  HomePage,
  LabsPage,
  LabDetailPage,
  ExperiencePage,
  CertificationsPage,
  RecommendationsPage,
  ContactPage
} from './pages/public'

// Admin bundle is lazy-loaded: it never ships to normal visitors.
const Admin = lazy(() => import('./admin/Admin'))

// Hidden admin path. Not linked anywhere on the site. Rename to taste —
// remember: this is obscurity, the security lives in Supabase Auth + RLS.
const ADMIN_PATH = '/console-7f3a'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  const [settings, setSettings] = useState(SEED.settings)
  const location = useLocation()
  const isAdmin = location.pathname.startsWith(ADMIN_PATH)

  useEffect(() => {
    getSettings().then(setSettings)
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      {!isAdmin && <Header profile={settings.profile} />}
      <main className="flex-1">
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<HomePage settings={settings} />} />
            <Route path="/labs" element={<LabsPage />} />
            <Route path="/labs/:slug" element={<LabDetailPage />} />
            <Route path="/experience" element={<ExperiencePage />} />
            <Route path="/certifications" element={<CertificationsPage />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />
            <Route path="/contact" element={<ContactPage settings={settings} />} />
            <Route path={ADMIN_PATH} element={<Admin />} />
            <Route
              path="*"
              element={
                <div className="max-w-4xl mx-auto px-4 py-24 text-center">
                  <p className="font-mono text-xs text-faint uppercase tracking-[0.25em]">404</p>
                  <h1 className="display text-3xl text-ink mt-2">No such record</h1>
                </div>
              }
            />
          </Routes>
        </Suspense>
      </main>
      {!isAdmin && <Footer profile={settings.profile} />}
    </div>
  )
}
