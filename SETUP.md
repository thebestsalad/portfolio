# Portfolio v2 — Setup

Vite + React + Tailwind on GitHub Pages, with Supabase for auth, content, and file storage.
The site runs on built-in seed data until Supabase is configured, so you can preview immediately.

## 1. Run locally

```bash
npm install
npm run dev
```

Public site: `http://localhost:5173/#/`
Admin console: `http://localhost:5173/#/console-7f3a` (shows a setup notice until step 2 is done)

## 2. Supabase (one-time, ~10 minutes)

1. Create a new Supabase project (separate from the GIA project).
2. SQL Editor → paste and run `supabase/schema.sql`.
3. Authentication → Sign In / Up → **disable "Allow new users to sign up"**.
4. Authentication → Users → **Add user** → your email + a strong unique password.
   This is the only account that can ever write. Also enable leaked password
   protection under Auth settings, same as you did for GIA.
5. Settings → API → copy the Project URL and anon public key into `.env`:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

The anon key shipping in the bundle is by design — it can only do what RLS
allows: read published rows. Every insert/update/delete requires your JWT.

6. Restart `npm run dev`, open the console path, sign in, and populate content.
   Once any table has rows, the site reads from Supabase instead of seed data.

## 3. Deploy to GitHub Pages

The build needs the env vars at build time. Two options:

**GitHub Actions (recommended):** add `VITE_SUPABASE_URL` and
`VITE_SUPABASE_ANON_KEY` as repository → Settings → Secrets and variables →
Actions → **Variables** (they are not secrets), and reference them in your
Pages workflow build step:

```yaml
- run: npm ci && npm run build
  env:
    VITE_SUPABASE_URL: ${{ vars.VITE_SUPABASE_URL }}
    VITE_SUPABASE_ANON_KEY: ${{ vars.VITE_SUPABASE_ANON_KEY }}
```

**Manual:** keep `.env` locally (gitignored), run `npm run build`, push `dist/`.

## 4. Admin path

The console lives at `/#/console-7f3a` — rename the constant `ADMIN_PATH` in
`src/App.jsx` to whatever you want. It is not linked anywhere on the site.
Remember: the hidden path is obscurity; the security is Supabase Auth + RLS.

## 5. Content notes

- **Labs** are the core: title, slug, summary (card, truncated), full
  description (supports `## headings`, `- bullets`, blank-line paragraphs,
  triple-backtick code blocks), cover image, tags, repo/writeup/external
  links, and attached files (uploaded to Supabase Storage → view/download
  buttons on the lab page).
- **Settings tab** edits the hero, about, headshot, resume PDF, socials,
  skills (JSON), and education.
- Featured labs (checkbox) surface on the homepage; unpublished labs are
  invisible to visitors but visible to you.

## 6. Hardening checklist (optional but you'll want it)

- [ ] Signups disabled, single admin user, strong unique password
- [ ] Leaked password protection enabled
- [ ] MFA on your Supabase dashboard account itself
- [ ] Rename the admin path
- [ ] Keep `.env` out of git (add to `.gitignore` if not present)
