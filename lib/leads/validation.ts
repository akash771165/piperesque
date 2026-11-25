import crypto from "node:crypto";
import { z } from "zod";

export const GREATER_HOUSTON_ZIP_MIN = 77001;
export const GREATER_HOUSTON_ZIP_MAX = 77598;

export interface SanitizedReferralLead {
  fullName: string;
  phone: string;
  email: string | null;
  zipCode: string;
  serviceCategory: string;
  urgency: "urgent" | "standard";
  details: string;
  sourcePage: string;
  consentAccepted: true;
  qualificationStatus: "QUALIFIED" | "OUT_OF_SERVICE_AREA";
  referralStatus: "PENDING_DISPATCH" | "REJECTED_OUT_OF_AREA";
}

export type ValidationOutcome =
  | { kind: "spam" }
  | { kind: "error"; error: string }
  | { kind: "valid"; data: SanitizedReferralLead };

const CONTROL_CHARS_REGEX = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const HTML_TAG_BRACKET_REGEX = /[<>]/g;
const URL_LIKE_REGEX = /(https?:\/\/|www\.)/gi;

export function sanitizeText(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value
    .replace(CONTROL_CHARS_REGEX, "")
    .replace(HTML_TAG_BRACKET_REGEX, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

export function normalizePhoneDigits(value: unknown): string {
  if (typeof value !== "string") return "";
  let digits = value.replace(/\D/g, "");
  // Strip US country code prefix '1' when 11-digit NANP number is entered
  if (digits.length === 11 && digits.startsWith("1")) {
    digits = digits.slice(1);
  }
  return digits.slice(0, 15);
}

export function sanitizeSourcePage(value: unknown): string {
  const cleaned = sanitizeText(value, 256);
  if (!cleaned || !cleaned.startsWith("/")) {
    return "/contact";
  }
  return cleaned;
}

export function isHoustonMetroZip(zipCode: string): boolean {
  if (!/^\d{5}$/.test(zipCode)) return false;
  const zipNum = Number.parseInt(zipCode, 10);
  return zipNum >= GREATER_HOUSTON_ZIP_MIN && zipNum <= GREATER_HOUSTON_ZIP_MAX;
}

export function hashClientIp(ip: string): string {
  const salt = process.env.SUPABASE_URL || "piperesque-lead-intake";
  return crypto
    .createHash("sha256")
    .update(`${salt}:${ip}`)
    .digest("hex");
}

const rawLeadPayloadSchema = z.object({
  fullName: z.unknown().optional(),
  phone: z.unknown().optional(),
  email: z.unknown().optional(),
  zipCode: z.unknown().optional(),
  serviceRequested: z.unknown().optional(),
  urgency: z.unknown().optional(),
  details: z.unknown().optional(),
  consentAccepted: z.unknown().optional(),
  sourcePage: z.unknown().optional(),
  honeypot: z.unknown().optional(),
});

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateAndSanitizeLeadPayload(rawBody: unknown): ValidationOutcome {
  if (!rawBody || typeof rawBody !== "object" || Array.isArray(rawBody)) {
    return {
      kind: "error",
      error: "Invalid request payload. Please check your entries and try again.",
    };
  }

  const parsed = rawLeadPayloadSchema.safeParse(rawBody);
  if (!parsed.success) {
    return {
      kind: "error",
      error: "Invalid request payload. Please check your entries and try again.",
    };
  }

  const body = parsed.data;

  // Anti-spam honeypot trap
  const honeypotValue = typeof body.honeypot === "string" ? body.honeypot.trim() : "";
  if (honeypotValue.length > 0) {
    return { kind: "spam" };
  }

  const fullName = sanitizeText(body.fullName, 120);
  if (fullName.length < 2) {
    return {
      kind: "error",
      error: "Full name is required (minimum 2 characters).",
    };
  }

  if (URL_LIKE_REGEX.test(fullName)) {
    return { kind: "spam" };
  }

  const phone = normalizePhoneDigits(body.phone);
  if (phone.length < 10) {
    return {
      kind: "error",
      error: "A valid 10-digit phone number is required.",
    };
  }

  const rawEmail = sanitizeText(body.email, 254).toLowerCase();
  if (rawEmail && !EMAIL_REGEX.test(rawEmail)) {
    return {
      kind: "error",
      error: "Please provide a valid email address or leave it blank.",
    };
  }

  const zipCode = sanitizeText(body.zipCode, 10);
  if (!/^\d{5}$/.test(zipCode)) {
    return {
      kind: "error",
      error: "A valid 5-digit ZIP code is required.",
    };
  }

  if (body.consentAccepted !== true) {
    return {
      kind: "error",
      error: "Customer consent to connect with an independent licensed contractor is mandatory.",
    };
  }

  const details = sanitizeText(body.details, 2000);
  const detailsUrlMatches = details.match(URL_LIKE_REGEX);
  if (detailsUrlMatches && detailsUrlMatches.length >= 2) {
    return { kind: "spam" };
  }

  const serviceCategory = sanitizeText(body.serviceRequested, 120) || "General Plumbing";
  const urgency: "urgent" | "standard" = body.urgency === "urgent" ? "urgent" : "standard";
  const sourcePage = sanitizeSourcePage(body.sourcePage);
  const qualified = isHoustonMetroZip(zipCode);

  return {
    kind: "valid",
    data: {
      fullName,
      phone,
      email: rawEmail || null,
      zipCode,
      serviceCategory,
      urgency,
      details,
      sourcePage,
      consentAccepted: true,
      qualificationStatus: qualified ? "QUALIFIED" : "OUT_OF_SERVICE_AREA",
      referralStatus: qualified ? "PENDING_DISPATCH" : "REJECTED_OUT_OF_AREA",
    },
  };
}

// Sliding-window in-memory rate limiter with periodic map pruning
export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

const DEFAULT_WINDOW_MS = 10 * 60 * 1000;
const DEFAULT_MAX_REQUESTS = 5;

export function createIpRateLimiter(
  windowMs = DEFAULT_WINDOW_MS,
  maxRequests = DEFAULT_MAX_REQUESTS
) {
  const store = new Map<string, number[]>();

  function pruneStaleEntries(now: number) {
    if (store.size < 500) return;
    for (const [key, timestamps] of store.entries()) {
      const fresh = timestamps.filter((t) => now - t < windowMs);
      if (fresh.length === 0) {
        store.delete(key);
      } else {
        store.set(key, fresh);
      }
    }
  }

  return {
    check(ip: string, now = Date.now()): RateLimitResult {
      pruneStaleEntries(now);
      const timestamps = (store.get(ip) || []).filter((t) => now - t < windowMs);

      if (timestamps.length >= maxRequests) {
        const oldest = timestamps[0];
        const retryAfterMs = Math.max(1000, windowMs - (now - oldest));
        return {
          allowed: false,
          retryAfterSeconds: Math.ceil(retryAfterMs / 1000),
        };
      }

      timestamps.push(now);
      store.set(ip, timestamps);
      return { allowed: true, retryAfterSeconds: 0 };
    },
    reset() {
      store.clear();
    },
  };
}
