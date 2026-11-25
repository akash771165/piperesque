import fs from "node:fs";
import path from "node:path";
import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { processReferralLeadSubmission } from "@/lib/leads/intake-handler";
import { getSupabaseConfigStatus, type LeadInsertionClient } from "@/lib/leads/supabase-server";
import { createIpRateLimiter } from "@/lib/leads/validation";
import { POST } from "@/app/api/referral-lead/route";

function buildJsonRequest(
  payload: unknown,
  headers: Record<string, string> = {}
): NextRequest {
  return new NextRequest("https://www.piperesque.com/api/referral-lead", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": "203.0.113.10",
      "user-agent": "Vitest-Agent/1.0",
      ...headers,
    },
    body: typeof payload === "string" ? payload : JSON.stringify(payload),
  });
}

function createMockSupabaseClient(
  overrideImpl?: (row: Record<string, unknown>) => Promise<{
    data: {
      lead_reference_id?: string;
      qualification_status?: "QUALIFIED" | "OUT_OF_SERVICE_AREA";
      created_at?: string;
    } | null;
    error: { message?: string; code?: string } | null;
  }>
) {
  const insertedRows: Array<Record<string, unknown>> = [];

  const client: LeadInsertionClient = {
    from(table) {
      expect(table).toBe("referral_leads");
      return {
        insert(row) {
          insertedRows.push(row);
          return {
            select(columns) {
              expect(columns).toContain("lead_reference_id");
              return {
                async single() {
                  if (overrideImpl) {
                    return overrideImpl(row);
                  }
                  return {
                    data: {
                      lead_reference_id: String(row.lead_reference_id),
                      qualification_status: row.qualification_status as
                        | "QUALIFIED"
                        | "OUT_OF_SERVICE_AREA",
                      created_at: "2026-11-13T05:55:00.000Z",
                    },
                    error: null,
                  };
                },
              };
            },
          };
        },
      };
    },
  };

  return { client, insertedRows };
}

describe("Referral Lead Intake API & Supabase Persistence", () => {
  const origUrl = process.env.SUPABASE_URL;
  const origKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    if (origUrl === undefined) delete process.env.SUPABASE_URL;
    else process.env.SUPABASE_URL = origUrl;

    if (origKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    else process.env.SUPABASE_SERVICE_ROLE_KEY = origKey;
  });

  it("inserts a sanitized qualified Houston lead into Supabase PostgreSQL without touching JSON stores", async () => {
    const leadsStorePath = path.resolve(process.cwd(), "content/growth/leads-store.json");
    const revenueStorePath = path.resolve(process.cwd(), "content/growth/revenue-store.json");
    const leadsBefore = fs.readFileSync(leadsStorePath, "utf8");
    const revenueBefore = fs.readFileSync(revenueStorePath, "utf8");

    const { client, insertedRows } = createMockSupabaseClient();
    const rateLimiter = createIpRateLimiter(60_000, 5);

    const res = await processReferralLeadSubmission(
      buildJsonRequest({
        fullName: "  <Sarah>   Johnson\u0007 ",
        phone: "+1 (713) 555-0199",
        email: "  SARAH@Example.COM ",
        zipCode: "77002",
        serviceRequested: "Emergency Plumbing",
        urgency: "urgent",
        details: "Main line shutoff leaking near garage <script>",
        consentAccepted: true,
        sourcePage: "/services/emergency-plumbing",
        honeypot: "",
      }),
      { supabaseClient: client, rateLimiter }
    );

    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.qualificationStatus).toBe("QUALIFIED");
    expect(json.leadId).toMatch(/^PR-77002-[A-F0-9]{6}$/);

    expect(insertedRows).toHaveLength(1);
    const row = insertedRows[0];
    expect(row.full_name).toBe("Sarah Johnson");
    expect(row.phone).toBe("7135550199");
    expect(row.email).toBe("sarah@example.com");
    expect(row.zip_code).toBe("77002");
    expect(row.urgency).toBe("urgent");
    expect(row.details).toBe("Main line shutoff leaking near garage script");
    expect(row.qualification_status).toBe("QUALIFIED");
    expect(row.referral_status).toBe("PENDING_DISPATCH");
    expect(row.consent_accepted).toBe(true);
    expect(String(row.client_ip_hash)).toMatch(/^[a-f0-9]{64}$/);
    expect(String(row.client_ip_hash)).not.toContain("203.0.113.10");

    // Verify local JSON files are untouched
    expect(fs.readFileSync(leadsStorePath, "utf8")).toBe(leadsBefore);
    expect(fs.readFileSync(revenueStorePath, "utf8")).toBe(revenueBefore);
  });

  it("records out-of-service-area ZIPs accurately when confirmed by database", async () => {
    const { client, insertedRows } = createMockSupabaseClient();
    const res = await processReferralLeadSubmission(
      buildJsonRequest({
        fullName: "Austin Homeowner",
        phone: "(512) 555-0199",
        zipCode: "78701",
        serviceRequested: "Drain Cleaning",
        consentAccepted: true,
      }),
      { supabaseClient: client, rateLimiter: createIpRateLimiter() }
    );

    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.qualificationStatus).toBe("OUT_OF_SERVICE_AREA");
    expect(insertedRows[0].referral_status).toBe("REJECTED_OUT_OF_AREA");
  });

  it("rejects invalid fields and malformed JSON with HTTP 400 without hitting database", async () => {
    const { client, insertedRows } = createMockSupabaseClient();
    const limiter = createIpRateLimiter(60_000, 20);

    const malformedRes = await processReferralLeadSubmission(
      buildJsonRequest("{bad json"),
      { supabaseClient: client, rateLimiter: limiter }
    );
    expect(malformedRes.status).toBe(400);

    const badPayloads = [
      { fullName: "A", phone: "7135550199", zipCode: "77002", consentAccepted: true },
      { fullName: "Jane Doe", phone: "12345", zipCode: "77002", consentAccepted: true },
      { fullName: "Jane Doe", phone: "7135550199", email: "bad-email", zipCode: "77002", consentAccepted: true },
      { fullName: "Jane Doe", phone: "7135550199", zipCode: "7700", consentAccepted: true },
      { fullName: "Jane Doe", phone: "7135550199", zipCode: "77002", consentAccepted: false },
    ];

    for (const payload of badPayloads) {
      const res = await processReferralLeadSubmission(buildJsonRequest(payload), {
        supabaseClient: client,
        rateLimiter: limiter,
      });
      const json = await res.json();
      expect(res.status).toBe(400);
      expect(json.success).toBe(false);
    }

    expect(insertedRows).toHaveLength(0);
  });

  it("blocks honeypot and URL spam submissions without database writes", async () => {
    const { client, insertedRows } = createMockSupabaseClient();
    const limiter = createIpRateLimiter(60_000, 20);

    const honeypotRes = await processReferralLeadSubmission(
      buildJsonRequest({
        fullName: "Bot User",
        phone: "7135550199",
        zipCode: "77002",
        consentAccepted: true,
        honeypot: "http://spam-bot.example",
      }),
      { supabaseClient: client, rateLimiter: limiter }
    );
    expect(honeypotRes.status).toBe(200);
    expect((await honeypotRes.json()).leadId).toBe("PR-SPAM-IGN");

    const urlNameRes = await processReferralLeadSubmission(
      buildJsonRequest({
        fullName: "Buy at https://spam.example",
        phone: "7135550199",
        zipCode: "77002",
        consentAccepted: true,
      }),
      { supabaseClient: client, rateLimiter: limiter }
    );
    expect(urlNameRes.status).toBe(200);
    expect((await urlNameRes.json()).leadId).toBe("PR-SPAM-IGN");

    expect(insertedRows).toHaveLength(0);
  });

  it("enforces per-IP sliding window rate limiting with HTTP 429", async () => {
    const { client, insertedRows } = createMockSupabaseClient();
    const limiter = createIpRateLimiter(60_000, 2);

    const validBody = {
      fullName: "Rate Test",
      phone: "7135550199",
      zipCode: "77002",
      consentAccepted: true,
    };

    const res1 = await processReferralLeadSubmission(
      buildJsonRequest(validBody, { "x-forwarded-for": "198.51.100.77" }),
      { supabaseClient: client, rateLimiter: limiter }
    );
    const res2 = await processReferralLeadSubmission(
      buildJsonRequest(validBody, { "x-forwarded-for": "198.51.100.77" }),
      { supabaseClient: client, rateLimiter: limiter }
    );
    const res3 = await processReferralLeadSubmission(
      buildJsonRequest(validBody, { "x-forwarded-for": "198.51.100.77" }),
      { supabaseClient: client, rateLimiter: limiter }
    );

    expect(res1.status).toBe(200);
    expect(res2.status).toBe(200);
    expect(res3.status).toBe(429);
    expect(res3.headers.get("Retry-After")).toBeTruthy();
    expect((await res3.json()).success).toBe(false);
    expect(insertedRows).toHaveLength(2);
  });

  it("reports NOT_CONFIGURED and returns HTTP 503 when Supabase env vars are missing", async () => {
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;

    expect(getSupabaseConfigStatus()).toEqual({
      configured: false,
      status: "NOT_CONFIGURED",
      missing: ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"],
    });

    const res = await POST(
      buildJsonRequest(
        {
          fullName: "Sarah Johnson",
          phone: "(713) 555-0199",
          zipCode: "77002",
          serviceRequested: "Emergency Plumbing",
          consentAccepted: true,
        },
        { "x-forwarded-for": "198.51.100.99" }
      )
    );

    const json = await res.json();
    expect(res.status).toBe(503);
    expect(json.success).toBe(false);
    expect(json.code).toBe("NOT_CONFIGURED");
    expect(json.leadId).toBeUndefined();
  });

  it("never reports success when Supabase returns a database error or unconfirmed row", async () => {
    const errClient = createMockSupabaseClient(async () => ({
      data: null,
      error: { code: "23505", message: "duplicate key value violates unique constraint" },
    }));

    const errRes = await processReferralLeadSubmission(
      buildJsonRequest({
        fullName: "Sarah Johnson",
        phone: "7135550199",
        zipCode: "77002",
        consentAccepted: true,
      }),
      { supabaseClient: errClient.client, rateLimiter: createIpRateLimiter() }
    );
    const errJson = await errRes.json();
    expect(errRes.status).toBe(502);
    expect(errJson.success).toBe(false);
    expect(errJson.code).toBe("DATABASE_ERROR");
    expect(errJson.leadId).toBeUndefined();

    const nullDataClient = createMockSupabaseClient(async () => ({
      data: null,
      error: null,
    }));

    const unconfirmedRes = await processReferralLeadSubmission(
      buildJsonRequest({
        fullName: "Sarah Johnson",
        phone: "7135550199",
        zipCode: "77002",
        consentAccepted: true,
      }),
      { supabaseClient: nullDataClient.client, rateLimiter: createIpRateLimiter() }
    );
    const unconfirmedJson = await unconfirmedRes.json();
    expect(unconfirmedRes.status).toBe(502);
    expect(unconfirmedJson.success).toBe(false);
    expect(unconfirmedJson.code).toBe("DATABASE_ERROR");
  });

  it("keeps Supabase keys and customer PII completely absent from client form analytics code", () => {
    const formSource = fs.readFileSync(
      path.resolve(process.cwd(), "components/contact/referral-lead-form.tsx"),
      "utf8"
    );
    expect(formSource).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
    expect(formSource).not.toContain("SUPABASE_URL");
    expect(formSource).not.toContain("NEXT_PUBLIC_SUPABASE");

    // Verify GA4 tracking block never includes PII fields
    const trackCallMatch = formSource.match(/trackContactFormSubmit\(([\s\S]*?)\);/);
    expect(trackCallMatch).not.toBeNull();
    const trackArgs = trackCallMatch?.[1] || "";
    expect(trackArgs).not.toContain("fullName");
    expect(trackArgs).not.toContain("phone");
    expect(trackArgs).not.toContain("email");
    expect(trackArgs).not.toContain("details");
    expect(trackArgs).not.toContain("zipCode");
  });
});
