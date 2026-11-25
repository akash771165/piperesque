# PipeResque — Production Deployment Guide

This package contains the complete, deployment-ready **PipeResque** Next.js 16 application prepared for production hosting on **https://www.piperesque.com** via **https://github.com/akash771165/piperesque**.

> **Important Status Notice:** No production deployment has been executed from the build sandbox. Live deployment requires pushing this package to your GitHub repository, applying the Supabase PostgreSQL migration, configuring environment variables on your hosting provider (Vercel), and verifying the live endpoints.

---

## 1. Archive & Exclusion Verification

This deployment archive (`piperesque-production-deploy.zip`) includes all application source code, SEO/blog content (`87` blog JSON files including all `84` updated files), tests, public assets, Supabase SQL migration, and synced `package.json` / `package-lock.json` (`@supabase/supabase-js@^2.119.0` locked for `npm ci`).

The following paths are **excluded** from the archive:
- `node_modules/`
- `.next/`
- `.vercel/`
- `.git/`
- `.env`, `.env.local`, `.env.*.local`
- `tsconfig.tsbuildinfo`, `next-env.d.ts`
- `*.zip`, `*.pem`, `*.tmp`, `*.bak`

---

## 2. Step 1 — Push Code to GitHub (`akash771165/piperesque`)

Do **not** push directly to `main` or merge PR #10 without reviewing the diff first.

```bash
# 1. Clone your production repository locally
git clone https://github.com/akash771165/piperesque.git
cd piperesque

# 2. Create a clean release branch
git checkout -b release/production-seo-and-supabase

# 3. Extract piperesque-production-deploy.zip into a staging folder
#    and copy contents into the cloned repository (excluding any .git or .env* files)
unzip /path/to/piperesque-production-deploy.zip -d ../piperesque-staging
rsync -av --exclude='.git' ../piperesque-staging/ ./

# 4. Inspect changed files and verify no secrets or build artifacts are staged
git status
```

Verify locally before pushing:
```bash
npm ci
npm test
npx tsc --noEmit
npm run lint
npm run build
```

Commit and push:
```bash
git add -A
git commit -m "chore(release): apply SEO updates, lockfile sync, and Supabase lead storage"
git push -u origin release/production-seo-and-supabase
```

---

## 3. Step 2 — Provision Supabase & Apply SQL Migration

PipeResque stores customer referral submissions in `public.referral_leads` with strict Row Level Security (`FORCE ROW LEVEL SECURITY`) and zero browser-side key exposure.

1. Open your Supabase project dashboard -> **SQL Editor**.
2. Open and run `supabase/migrations/0001_create_referral_leads.sql`.
3. Confirm in **Database -> Tables** that `public.referral_leads` exists with **RLS Enabled** and zero `anon` or `authenticated` policies (`service_role` only).
4. From **Project Settings -> API**, copy:
   - **Project URL** -> `SUPABASE_URL`
   - **`service_role` secret key** -> `SUPABASE_SERVICE_ROLE_KEY`

---

## 4. Step 3 — Configure Hosting Environment Variables (Vercel)

In **Vercel -> Project Settings -> Environment Variables**, configure the following for **Production** (and **Preview** if preview form testing is desired):

### Required for Live Website & Lead Intake
| Variable | Visibility | Description |
| --- | --- | --- |
| `SUPABASE_URL` | Server-only | Supabase Project URL (`https://<project-ref>.supabase.co`). |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only secret | Supabase `service_role` key. **Never** prefix with `NEXT_PUBLIC_`. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Client-public | GA4 Measurement ID (e.g. `G-XXXXXXXXXX`). Required to load `gtag.js`. |

### Optional (Growth Engine / CI Scripts Only)
| Variable | Visibility | Description |
| --- | --- | --- |
| `GEMINI_API_KEY` | Server-only secret | Google Gemini API key for growth scripts. |
| `GSC_SITE_URL` | Server-only | `https://www.piperesque.com` |
| `GSC_CLIENT_EMAIL` | Server-only | Google Service Account client email (Search Console + GA4 Data API). |
| `GSC_PRIVATE_KEY` | Server-only secret | Google Service Account PEM private key. |
| `GA4_PROPERTY_ID` | Server-only | Numeric GA4 property ID (`545324869`). |
| `GROWTH_AUTO_PUBLISH` | CI / Script config | Keep set to `"false"` unless intentionally enabling automated publishing. |

> **Security Reminder:** Never expose `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`, or `GSC_PRIVATE_KEY` with a `NEXT_PUBLIC_` prefix. Keep `.github/workflows/growth-engine.yml` cron schedule disabled unless explicitly authorized.

---

## 5. Step 4 — Domain & Production Deployment

1. Connect the `akash771165/piperesque` GitHub repository in Vercel (if not already connected) or merge `release/production-seo-and-supabase` into your production deployment branch after preview verification.
2. In **Vercel -> Project Settings -> Domains**:
   - Confirm `www.piperesque.com` is assigned as the primary production domain.
   - Confirm apex `piperesque.com` redirects cleanly (`301`/`308`) to `https://www.piperesque.com`.
3. Trigger a fresh production build **after** saving all environment variables so `NEXT_PUBLIC_GA_MEASUREMENT_ID` is compiled into the client layout.

---

## 6. Step 5 — Post-Deploy Live Verification Checklist

Complete every check below on `https://www.piperesque.com` before marking deployment complete:

- [ ] **Core Pages & SEO Routes (HTTP `200`):**
  - `https://www.piperesque.com/`
  - `https://www.piperesque.com/services/emergency-plumbing`
  - `https://www.piperesque.com/services/sewer-line-repair`
  - `https://www.piperesque.com/location/houston/emergency-plumbing`
  - `https://www.piperesque.com/service-areas/katy`
  - `https://www.piperesque.com/contact`
  - `https://www.piperesque.com/robots.txt`
  - `https://www.piperesque.com/sitemap.xml` (verify `191` canonical URLs and zero `noindex` routes)
- [ ] **Redirects:** Confirm legacy deleted blog/city URLs in `next.config.ts` return `301`/`308` without 404s.
- [ ] **Supabase Lead Intake End-to-End:**
  - Submit a test referral on `https://www.piperesque.com/contact` (Houston ZIP `77002`, consent checked).
  - Verify HTTP `200` response with `{ success: true, leadId: "PR-77002-..." }`.
  - Verify the row appears in `public.referral_leads` via Supabase SQL Editor, then delete the test row.
- [ ] **GA4 Event Verification (Property `545324869`):**
  - Open GA4 **Realtime** / **DebugView**, click a phone link (`click_to_call`) and submit the test form (`contact_form_submit`), and verify events arrive with zero PII parameters.
- [ ] **Security Headers:** Verify `Strict-Transport-Security`, `X-Frame-Options`, `X-Content-Type-Options`, and `Referrer-Policy` headers on `https://www.piperesque.com`.
