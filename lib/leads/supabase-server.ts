import crypto from "node:crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { SanitizedReferralLead } from "@/lib/leads/validation";

export type SupabaseConfigStatus =
  | {
      configured: true;
      url: string;
      serviceRoleKey: string;
    }
  | {
      configured: false;
      status: "NOT_CONFIGURED";
      missing: string[];
    };

export interface ConfirmedLeadInsert {
  ok: true;
  leadId: string;
  qualificationStatus: "QUALIFIED" | "OUT_OF_SERVICE_AREA";
  createdAt: string;
}

export interface FailedLeadInsert {
  ok: false;
  code: "NOT_CONFIGURED" | "DATABASE_ERROR";
  error: string;
}

export type InsertReferralLeadResult = ConfirmedLeadInsert | FailedLeadInsert;

export interface LeadInsertionClient {
  from: (table: "referral_leads") => {
    insert: (row: Record<string, unknown>) => {
      select: (columns: string) => {
        single: () => Promise<{
          data: {
            lead_reference_id?: string;
            qualification_status?: "QUALIFIED" | "OUT_OF_SERVICE_AREA";
            created_at?: string;
          } | null;
          error: { message?: string; code?: string } | null;
        }>;
      };
    };
  };
}

function assertServerOnly() {
  if (typeof window !== "undefined") {
    throw new Error("Supabase service-role lead storage must only run on the server.");
  }
}

export function getSupabaseConfigStatus(): SupabaseConfigStatus {
  assertServerOnly();

  const url = (process.env.SUPABASE_URL || "").trim();
  const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();

  const missing: string[] = [];
  if (!url) missing.push("SUPABASE_URL");
  if (!serviceRoleKey) missing.push("SUPABASE_SERVICE_ROLE_KEY");

  if (missing.length > 0) {
    return {
      configured: false,
      status: "NOT_CONFIGURED",
      missing,
    };
  }

  let validUrl = false;
  try {
    const parsed = new URL(url);
    validUrl = parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    validUrl = false;
  }

  if (!validUrl) {
    return {
      configured: false,
      status: "NOT_CONFIGURED",
      missing: ["SUPABASE_URL (invalid URL)"],
    };
  }

  return {
    configured: true,
    url,
    serviceRoleKey,
  };
}

export function createSupabaseAdminClient(): SupabaseClient | null {
  const config = getSupabaseConfigStatus();
  if (!config.configured) {
    return null;
  }

  return createClient(config.url, config.serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

export function generateLeadReferenceId(zipCode: string): string {
  const randomToken = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `PR-${zipCode}-${randomToken}`;
}

export async function insertReferralLead(
  lead: SanitizedReferralLead,
  telemetry: { clientIpHash: string; userAgent?: string | null },
  clientOverride?: LeadInsertionClient
): Promise<InsertReferralLeadResult> {
  assertServerOnly();

  let client: LeadInsertionClient | null = clientOverride ?? null;

  if (!client) {
    const config = getSupabaseConfigStatus();
    if (!config.configured) {
      return {
        ok: false,
        code: "NOT_CONFIGURED",
        error: `Supabase credentials are ${config.status}: missing ${config.missing.join(", ")}.`,
      };
    }

    client = createSupabaseAdminClient() as unknown as LeadInsertionClient | null;
    if (!client) {
      return {
        ok: false,
        code: "NOT_CONFIGURED",
        error: "Supabase client could not be initialized.",
      };
    }
  }

  const leadReferenceId = generateLeadReferenceId(lead.zipCode);

  const row = {
    lead_reference_id: leadReferenceId,
    full_name: lead.fullName,
    phone: lead.phone,
    email: lead.email,
    zip_code: lead.zipCode,
    service_category: lead.serviceCategory,
    urgency: lead.urgency,
    details: lead.details,
    source_page: lead.sourcePage,
    consent_accepted: lead.consentAccepted,
    consent_status: "EXPLICIT_ACCEPTED",
    qualification_status: lead.qualificationStatus,
    referral_status: lead.referralStatus,
    provider_id: null,
    provider_response: null,
    job_completion_status: "PENDING",
    verified_payment_status: "UNPAID",
    revenue_amount: 0,
    client_ip_hash: telemetry.clientIpHash,
    user_agent: telemetry.userAgent ? telemetry.userAgent.slice(0, 512) : null,
  };

  try {
    const { data, error } = await client
      .from("referral_leads")
      .insert(row)
      .select("lead_reference_id, qualification_status, created_at")
      .single();

    if (error) {
      return {
        ok: false,
        code: "DATABASE_ERROR",
        error: `Database insert failed${error.code ? ` (${error.code})` : ""}: ${error.message || "Unknown PostgreSQL error"}`,
      };
    }

    if (!data || !data.lead_reference_id || !data.qualification_status) {
      return {
        ok: false,
        code: "DATABASE_ERROR",
        error: "Database did not confirm lead row insertion.",
      };
    }

    return {
      ok: true,
      leadId: data.lead_reference_id,
      qualificationStatus: data.qualification_status,
      createdAt: data.created_at || new Date().toISOString(),
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unexpected database error";
    return {
      ok: false,
      code: "DATABASE_ERROR",
      error: message,
    };
  }
}
