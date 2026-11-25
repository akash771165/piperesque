import { NextRequest, NextResponse } from "next/server";
import {
  createIpRateLimiter,
  hashClientIp,
  validateAndSanitizeLeadPayload,
} from "@/lib/leads/validation";
import {
  insertReferralLead,
  type LeadInsertionClient,
} from "@/lib/leads/supabase-server";

const defaultRateLimiter = createIpRateLimiter(10 * 60 * 1000, 5);

function extractClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = req.headers.get("x-real-ip")?.trim();
  return realIp || "127.0.0.1";
}

export interface IntakeHandlerOptions {
  supabaseClient?: LeadInsertionClient;
  rateLimiter?: ReturnType<typeof createIpRateLimiter>;
}

export async function processReferralLeadSubmission(
  req: NextRequest,
  options: IntakeHandlerOptions = {}
): Promise<NextResponse> {
  const limiter = options.rateLimiter ?? defaultRateLimiter;
  const ip = extractClientIp(req);

  try {
    // 1. Sliding-window rate limit per IP (5 attempts / 10 minutes)
    const rate = limiter.check(ip);
    if (!rate.allowed) {
      return NextResponse.json(
        {
          success: false,
          code: "RATE_LIMITED",
          error:
            "Too many submission attempts. Please wait a few minutes or call (877) 587-3986 directly for assistance.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rate.retryAfterSeconds),
          },
        }
      );
    }

    // 2. Parse JSON safely
    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          code: "INVALID_JSON",
          error: "Invalid request payload. Please check your entries and try again.",
        },
        { status: 400 }
      );
    }

    // 3. Validate, sanitize, and filter spam/honeypot submissions
    const validation = validateAndSanitizeLeadPayload(rawBody);

    if (validation.kind === "spam") {
      console.warn("[Lead Intake API] Spam filter triggered; request discarded without persistence.");
      return NextResponse.json({ success: true, leadId: "PR-SPAM-IGN" });
    }

    if (validation.kind === "error") {
      return NextResponse.json(
        {
          success: false,
          code: "VALIDATION_ERROR",
          error: validation.error,
        },
        { status: 400 }
      );
    }

    // 4. Persist exclusively to server-side Supabase PostgreSQL (never JSON fallback)
    const clientIpHash = hashClientIp(ip);
    const userAgent = req.headers.get("user-agent");

    const dbResult = await insertReferralLead(
      validation.data,
      { clientIpHash, userAgent },
      options.supabaseClient
    );

    if (!dbResult.ok) {
      if (dbResult.code === "NOT_CONFIGURED") {
        console.error(`[Lead Intake API] ${dbResult.error}`);
        return NextResponse.json(
          {
            success: false,
            code: "NOT_CONFIGURED",
            error:
              "Online referral form storage is temporarily unavailable. Please call (877) 587-3986 directly for assistance.",
          },
          { status: 503 }
        );
      }

      // Log technical error code only — never log PII or secret keys
      console.error(`[Lead Intake API] Persistence error: ${dbResult.error}`);
      return NextResponse.json(
        {
          success: false,
          code: "DATABASE_ERROR",
          error:
            "Unable to save your referral request right now. Please try again or call (877) 587-3986 directly.",
        },
        { status: 502 }
      );
    }

    // Zero-PII operational log
    console.log(
      `[Lead Intake API] Confirmed Supabase insert: ${dbResult.leadId} (${dbResult.qualificationStatus})`
    );

    return NextResponse.json({
      success: true,
      leadId: dbResult.leadId,
      qualificationStatus: dbResult.qualificationStatus,
      message: "Referral request received and securely saved.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`[Lead Intake API] Unhandled exception: ${message}`);
    return NextResponse.json(
      {
        success: false,
        code: "INTERNAL_ERROR",
        error:
          "Internal server error saving referral request. Please call (877) 587-3986 directly.",
      },
      { status: 500 }
    );
  }
}
