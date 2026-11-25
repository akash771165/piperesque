-- =============================================================================
-- PipeResque Production Lead Storage Migration
-- Target: Supabase PostgreSQL
-- Purpose: Persistent server-side storage for referral lead submissions with
--          strict Row Level Security (RLS) protecting customer PII.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.referral_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_reference_id TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Restricted Customer PII (server-side only; never exposed to browser clients)
  full_name TEXT NOT NULL CHECK (char_length(trim(full_name)) >= 2 AND char_length(full_name) <= 120),
  phone TEXT NOT NULL CHECK (char_length(phone) >= 10 AND char_length(phone) <= 15),
  email TEXT,
  details TEXT NOT NULL DEFAULT '' CHECK (char_length(details) <= 2000),

  -- Service & Qualification Metadata
  zip_code TEXT NOT NULL CHECK (zip_code ~ '^\d{5}$'),
  service_category TEXT NOT NULL CHECK (char_length(trim(service_category)) >= 1 AND char_length(service_category) <= 120),
  urgency TEXT NOT NULL DEFAULT 'standard' CHECK (urgency IN ('urgent', 'standard')),
  source_page TEXT NOT NULL DEFAULT '/contact' CHECK (char_length(source_page) <= 256),

  -- Consent & Referral Pipeline Lifecycle
  consent_accepted BOOLEAN NOT NULL CHECK (consent_accepted = TRUE),
  consent_status TEXT NOT NULL DEFAULT 'EXPLICIT_ACCEPTED',
  qualification_status TEXT NOT NULL CHECK (qualification_status IN ('QUALIFIED', 'OUT_OF_SERVICE_AREA')),
  referral_status TEXT NOT NULL DEFAULT 'PENDING_DISPATCH' CHECK (referral_status IN ('PENDING_DISPATCH', 'DISPATCHED', 'ACCEPTED', 'COMPLETED', 'REJECTED_OUT_OF_AREA')),
  provider_id TEXT,
  provider_response TEXT,
  job_completion_status TEXT NOT NULL DEFAULT 'PENDING',
  verified_payment_status TEXT NOT NULL DEFAULT 'UNPAID',
  revenue_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,

  -- Privacy-Safe Security Telemetry (irreversible SHA-256 IP digest, no raw IP)
  client_ip_hash TEXT,
  user_agent TEXT CHECK (user_agent IS NULL OR char_length(user_agent) <= 512)
);

-- Operational indexes for sorting, qualification filtering, and ZIP dispatch lookup
CREATE INDEX IF NOT EXISTS idx_referral_leads_created_at
  ON public.referral_leads (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_referral_leads_qualification_status
  ON public.referral_leads (qualification_status);

CREATE INDEX IF NOT EXISTS idx_referral_leads_zip_code
  ON public.referral_leads (zip_code);

CREATE INDEX IF NOT EXISTS idx_referral_leads_referral_status
  ON public.referral_leads (referral_status);

-- Automatic updated_at timestamp maintenance
CREATE OR REPLACE FUNCTION public.set_referral_leads_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_referral_leads_updated_at ON public.referral_leads;
CREATE TRIGGER trg_referral_leads_updated_at
  BEFORE UPDATE ON public.referral_leads
  FOR EACH ROW
  EXECUTE FUNCTION public.set_referral_leads_updated_at();

-- =============================================================================
-- Row Level Security (RLS) & Least-Privilege Access Control
-- Customer PII must NEVER be readable or writable by browser/anon keys.
-- Only trusted server-side requests using SUPABASE_SERVICE_ROLE_KEY may access.
-- =============================================================================

ALTER TABLE public.referral_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_leads FORCE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.referral_leads FROM PUBLIC;
REVOKE ALL ON TABLE public.referral_leads FROM anon;
REVOKE ALL ON TABLE public.referral_leads FROM authenticated;

DROP POLICY IF EXISTS "service_role_full_access" ON public.referral_leads;
CREATE POLICY "service_role_full_access"
  ON public.referral_leads
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
