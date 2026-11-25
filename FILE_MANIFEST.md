# PipeResque — Deployment File Manifest

- **Project Root:** `/app/applet`
- **Target GitHub Repository:** `https://github.com/akash771165/piperesque`
- **Target Production Domain:** `https://www.piperesque.com`
- **Archive Name:** `piperesque-production-deploy.zip`

> **Git History Notice:** The workspace does not contain a `.git` directory, so `git status` / `git diff` against `origin/main` cannot be run inside this sandbox. File change classifications below are verified from workspace filesystem state, build/test audits, and `package.json` / `package-lock.json` verification.

---

## 1. Summary Inventory (Included vs. Excluded)

### Included Top-Level Directories & Files
- `app/` — Next.js App Router pages, metadata, `sitemap.ts`, `robots.ts`, and `app/api/referral-lead/route.ts`
- `components/` — UI components, CTA/footer sections, `PhoneClickTracker`, `ClarityProvider`, and `ReferralLeadForm`
- `lib/` — Site config, SEO schema helpers, service/location/blog data, zero-PII analytics (`lib/analytics/track.ts`), and Supabase lead persistence (`lib/leads/*`)
- `content/` — Blog JSON/Markdown content (`87` files in `content/blogs/`), SEO opportunity manifest, and growth metadata stores (initialized empty / zero fabricated leads)
- `supabase/` — Production PostgreSQL migration (`supabase/migrations/0001_create_referral_leads.sql`)
- `public/` — Static images, icons, manifests, and Google site verification HTML
- `scripts/` — SEO audit, growth engine, smoke test, and publishing scripts
- `tests/` — Vitest unit/integration suite (`28` test files)
- `types/` — TypeScript ambient declarations
- `docs/` — Architecture, SEO audit, and Supabase storage documentation (`docs/SUPABASE_LEAD_STORAGE.md`)
- `reports/` — Audit crawler and baseline daily report JSON/Markdown
- `.github/` — GitHub Actions workflow definitions (autonomous schedule remains disabled)
- Root config & docs — `package.json`, `package-lock.json` (synced), `bun.lock`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `vitest.config.mts`, `components.json`, `proxy.ts`, `.env.example`, `.gitignore`, `README.md`, `PROJECT-SUMMARY.md`, `DEPLOYMENT_README.md`, `FILE_MANIFEST.md`, `AGENTS.md`, `CLAUDE.md`, `structure.txt`

### Explicitly Excluded from Deployment ZIP
- `node_modules/`
- `.next/`
- `.vercel/`
- `.git/`
- `.env`, `.env.local`, `.env.*.local`
- `tsconfig.tsbuildinfo`, `next-env.d.ts`
- `*.zip`, `*.pem`, `*.tmp`, `*.temp`, `*.bak`
- `.DS_Store`

---

## 2. Lockfile & DevOps Fixes Applied

| File | Action | Details |
| --- | --- | --- |
| `package-lock.json` | Modified (Synced) | Synced lockfile with `package.json` (`npm install --package-lock-only --offline`) to include `@supabase/supabase-js@^2.119.0` (`2.119.0`) and its `@supabase/*` dependencies with valid `resolved` and `integrity` fields so `npm ci` passes in CI/Vercel. |
| `DEPLOYMENT_README.md` | Created | Step-by-step GitHub, Supabase SQL migration, Vercel environment variable, and live verification guide. |
| `FILE_MANIFEST.md` | Created | Complete inventory of included, modified, created, and excluded files. |

---

## 3. Supabase Migration & Lead Intake API Files (Verified Included)

- `supabase/migrations/0001_create_referral_leads.sql` — Creates `public.referral_leads` table, constraints, indexes, `updated_at` trigger, `ENABLE ROW LEVEL SECURITY`, `FORCE ROW LEVEL SECURITY`, and `service_role`-only policy (`anon`/`authenticated` revoked).
- `app/api/referral-lead/route.ts` — Node.js runtime `POST /api/referral-lead` endpoint.
- `lib/leads/intake-handler.ts` — IP rate limiting (5 req / 10 min), JSON parsing, spam filtering, and Supabase persistence orchestration (returns HTTP `503` when unconfigured; never falls back to JSON files).
- `lib/leads/supabase-server.ts` — Server-only Supabase admin client (`assertServerOnly()`, reads `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`).
- `lib/leads/validation.ts` — Zod payload validation, sanitization, phone normalization, Houston metro ZIP qualification (`77001–77598`), and SHA-256 IP hashing.
- `components/contact/referral-lead-form.tsx` — Client referral form emitting zero-PII `contact_form_submit` only on confirmed database insert.
- `docs/SUPABASE_LEAD_STORAGE.md` — Supabase schema and verification guide.
- `tests/api/referral-lead/route.test.ts` — 8 integration tests covering `503 NOT_CONFIGURED`, rate limits, spam filtering, ZIP qualification, and confirmed inserts.

---

## 4. Modified Application, SEO & Analytics Files (11 Code Files)

1. `app/page.tsx`
2. `app/services/emergency-plumbing/page.tsx`
3. `app/services/[slug]/page.tsx`
4. `app/location/[location]/[service]/page.tsx`
5. `app/service-areas/[city]/page.tsx`
6. `app/sitemap.ts`
7. `components/sections/cta.tsx`
8. `components/layout/footer.tsx`
9. `lib/analytics/track.ts`
10. `lib/data/services.ts`
11. `lib/data/locations.ts`

---

## 5. Updated Blog JSON Files (`84` Updated + `3` Baseline = `87` Total in `content/blogs/`)

### Updated Blog JSON Files (`84`)
1. `content/blogs/24-hour-emergency-plumber-houston.json`
2. `content/blogs/24-hour-plumber-houston-tx.json`
3. `content/blogs/apartment-complex-main-water-line-leak-houston.json`
4. `content/blogs/attic-water-heater-code-requirements-houston.json`
5. `content/blogs/bathroom-remodel-plumbing-rough-in-houston.json`
6. `content/blogs/bathroom-shower-bathtub-drain-clog-houston.json`
7. `content/blogs/bidet-attachment-backflow-risk-houston.json`
8. `content/blogs/burst-pipe-repair-houston-tx.json`
9. `content/blogs/buying-home-with-cast-iron-pipes-houston.json`
10. `content/blogs/cast-iron-sewer-pipe-replacement-houston.json`
11. `content/blogs/chemical-drain-cleaner-pipe-damage-houston.json`
12. `content/blogs/commercial-backflow-preventer-testing-houston.json`
13. `content/blogs/commercial-grease-trap-backup-houston.json`
14. `content/blogs/commercial-lift-station-pump-failure-houston.json`
15. `content/blogs/commercial-plumbing-preventative-maintenance-houston.json`
16. `content/blogs/commercial-restroom-drain-backup-houston.json`
17. `content/blogs/commercial-urinal-sensor-flushometer-houston.json`
18. `content/blogs/commercial-water-heater-repair-houston.json`
19. `content/blogs/condensate-drain-line-clog-houston.json`
20. `content/blogs/copper-pipe-pinhole-slab-leak-houston.json`
21. `content/blogs/cypress-tx-mud-district-water-pressure.json`
22. `content/blogs/dishwasher-leaking-on-kitchen-floor-houston.json`
23. `content/blogs/drain-cleaning-houston-tx.json`
24. `content/blogs/electric-water-heater-element-repair-houston.json`
25. `content/blogs/emergency-drain-cleaning-houston.json`
26. `content/blogs/emergency-plumber-houston-cost-2026.json`
27. `content/blogs/emergency-plumber-houston-tx.json`
28. `content/blogs/emergency-plumber-near-me-houston.json`
29. `content/blogs/emergency-plumbing-services-houston.json`
30. `content/blogs/foundation-shifting-plumbing-damage-houston.json`
31. `content/blogs/frozen-pipes-thawing-prevention-houston.json`
32. `content/blogs/galvanized-steel-pipe-corrosion-houston.json`
33. `content/blogs/garbage-disposal-jammed-leaking-houston.json`
34. `content/blogs/gas-line-leak-detection-pool-heater-houston.json`
35. `content/blogs/gas-smell-water-heater-shutoff-houston.json`
36. `content/blogs/gas-water-heater-pilot-light-houston.json`
37. `content/blogs/hard-water-plumbing-scale-softener-houston.json`
38. `content/blogs/high-water-bill-hidden-leak-houston.json`
39. `content/blogs/high-water-pressure-plumbing-damage-houston.json`
40. `content/blogs/historic-home-plumbing-renovation-houston.json`
41. `content/blogs/holiday-emergency-plumbing-scenarios-houston.json`
42. `content/blogs/home-inspection-plumbing-defects-houston.json`
43. `content/blogs/hot-spots-floor-slab-leak-houston.json`
44. `content/blogs/hotel-motel-central-hot-water-failure-houston.json`
45. `content/blogs/how-to-shut-off-main-water-houston.json`
46. `content/blogs/hurricane-storm-flood-plumbing-inspection-houston.json`
47. `content/blogs/hybrid-heat-pump-water-heater-houston.json`
48. `content/blogs/hydro-jetting-sewer-lines-houston.json`
49. `content/blogs/katy-tx-hard-water-plumbing-maintenance.json`
50. `content/blogs/kitchen-island-prep-sink-venting-houston.json`
51. `content/blogs/kitchen-sink-double-basin-backup-houston.json`
52. `content/blogs/lead-pipe-solder-testing-older-houston.json`
53. `content/blogs/leak-detection-houston-tx.json`
54. `content/blogs/leaking-water-heater-bottom-houston.json`
55. `content/blogs/low-water-pressure-whole-house-houston.json`
56. `content/blogs/main-floor-drain-overflow-houston.json`
57. `content/blogs/main-water-shutoff-valve-replacement-houston.json`
58. `content/blogs/missouri-city-tx-sewer-cleanout-access.json`
59. `content/blogs/office-building-water-pressure-booster-houston.json`
60. `content/blogs/outdoor-hose-bibb-freeze-burst-houston.json`
61. `content/blogs/pasadena-tx-industrial-corrosion-plumbing.json`
62. `content/blogs/pearland-tx-corrosive-soil-pipe-protection.json`
63. `content/blogs/pex-vs-copper-repipe-houston.json`
64. `content/blogs/plumber-near-me-houston-tx.json`
65. `content/blogs/plumbing-company-houston-tx.json`
66. `content/blogs/plumbing-disclosure-selling-home-houston.json`
67. `content/blogs/plumbing-permits-harris-county-houston.json`
68. `content/blogs/plumbing-vent-pipe-blockage-houston.json`
69. `content/blogs/polybutylene-pipe-replacement-houston.json`
70. `content/blogs/post-slab-leak-drying-restoration-prep-houston.json`
71. `content/blogs/pressure-reducing-valve-failure-houston.json`
72. `content/blogs/recirculating-hot-water-pump-troubleshooting-houston.json`
73. `content/blogs/recurrent-toilet-clogging-rebuild-houston.json`
74. `content/blogs/repipe-services-houston-tx.json`
75. `content/blogs/sewer-camera-inspection-houston.json`
76. `content/blogs/sewer-cleanout-installation-houston.json`
77. `content/blogs/sewer-line-repair-houston-tx.json`
78. `content/blogs/tankless-water-heater-repair-houston.json`
79. `content/blogs/water-heater-anode-rod-replacement-houston.json`
80. `content/blogs/water-heater-expansion-tank-houston-tx.json`
81. `content/blogs/water-heater-repair-houston-tx.json`
82. `content/blogs/water-heater-replacement-size-calculator-houston.json`
83. `content/blogs/water-heater-sediment-flush-houston.json`
84. `content/blogs/water-heater-temperature-pressure-relief-valve-houston.json`

### Baseline Blog JSON Files Included Unchanged (`3`)
1. `content/blogs/hydrostatic-plumbing-test-houston-tx.json`
2. `content/blogs/slab-leak-repair-houston-tx.json`
3. `content/blogs/water-line-repair-houston-tx.json`

---

## 6. Deleted Files Status

- **Current Session / SEO & Lead Implementation:** `0` files deleted in this workspace.
- **Prior Baseline Consolidations (Documented in `next.config.ts` & `PROJECT-SUMMARY.md`):** `8` legacy blog posts and `3` pruned location/service-area routes were already absent from the baseline workspace and are handled via permanent `301` redirects in `next.config.ts` (`/location/tomball`, `/location/conroe`, `/location/league-city`, `/service-areas/tomball`, `/service-areas/conroe`, `/service-areas/league-city`, and the 8 redirected `/blog/*` slugs).
