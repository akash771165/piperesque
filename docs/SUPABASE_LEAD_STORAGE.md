# PipeResque Production Lead Storage (Supabase PostgreSQL)

PipeResque stores customer referral callback submissions in a server-side **Supabase PostgreSQL** table (`public.referral_leads`) rather than ephemeral local JSON files (`content/growth/leads-store.json` / `content/growth/revenue-store.json`).

---

## 1. Security Model & Zero Client Exposure

- Customer PII (`full_name`, `phone`, `email`, `details`, `client_ip_hash`) is written **only** from the Next.js Node.js API route (`POST /api/referral-lead`).
- `public.referral_leads` enforces **Row Level Security (RLS)** (`ENABLE ROW LEVEL SECURITY` + `FORCE ROW LEVEL SECURITY`) and revokes all privileges from `PUBLIC`, `anon`, and `authenticated` roles.
- No Supabase anon key or service-role key is exposed in browser code or `NEXT_PUBLIC_*` environment variables.
- Analytics events (`trackContactFormSubmit` in `lib/analytics/track.ts`) fire **only after confirmed database insertion** and transmit zero PII (only `serviceRequested`, `pagePath`, and `source`).
- If `SUPABASE_URL` or `SUPABASE_SERVICE_ROLE_KEY` is missing, `POST /api/referral-lead` fails safely with HTTP `503` (`NOT_CONFIGURED`) and directs the homeowner to call `(877) 587-3986`. It never falls back to JSON files or fakes a success state.

---

## 2. Database Setup (Run SQL Migration)

1. Create a Supabase project (or open your existing Supabase project).
2. Open the **SQL Editor** in the Supabase Dashboard (or run via Supabase CLI).
3. Run the migration file:
   - `supabase/migrations/0001_create_referral_leads.sql`
4. Verify in **Table Editor** / **Database -> Tables** that `public.referral_leads` exists and **RLS Enabled** badge is active with zero `anon`/`authenticated` policies.

---

## 3. Required Environment Variables (Vercel / Server-Side)

Configure these variables in **Vercel Project Settings -> Environment Variables** (Production & Preview) and in local `.env.local` for local verification:

| Variable | Visibility | Source in Supabase Dashboard |
| --- | --- | --- |
| `SUPABASE_URL` | Server-only | **Project Settings -> API -> Project URL** (e.g. `https://<project-ref>.supabase.co`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only secret | **Project Settings -> API -> `service_role` key** |

> **Important:** Never add `NEXT_PUBLIC_` to either variable, and never commit real `.env` or `.env.local` values to Git.

---

## 4. Verifying Production Persistence

After configuring environment variables and running the migration:

1. Submit a test inquiry from `/contact` or `POST /api/referral-lead` (using a non-empty consent checkbox, valid 10-digit phone, and 5-digit ZIP such as `77002`).
2. Confirm HTTP `200` with `{ success: true, leadId: "PR-77002-...", qualificationStatus: "QUALIFIED" }`.
3. Verify the inserted row appears in `public.referral_leads` via Supabase SQL Editor:
   ```sql
   SELECT lead_reference_id, created_at, service_category, urgency, zip_code, qualification_status
   FROM public.referral_leads
   ORDER BY created_at DESC
   LIMIT 10;
   ```
4. Delete any manual verification test row afterward so production reporting stays accurate.
