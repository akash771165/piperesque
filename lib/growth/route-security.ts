import crypto from "node:crypto";
import type { NextRequest } from "next/server";

export interface SecretVerificationResult {
  ok: boolean;
  status?: 401 | 503;
  error?: string;
}

/**
 * Constant-time equality check for secret tokens using SHA-256 digests so
 * differing string lengths never leak secret length via timing.
 */
export function timingSafeTokenEquals(provided: string, expected: string): boolean {
  const providedDigest = crypto.createHash("sha256").update(provided, "utf8").digest();
  const expectedDigest = crypto.createHash("sha256").update(expected, "utf8").digest();
  return crypto.timingSafeEqual(providedDigest, expectedDigest);
}

/**
 * Extracts a shared secret token from `?token=...`, `Authorization: Bearer ...`,
 * or an optional custom header name.
 */
export function extractTokenFromRequest(
  req: NextRequest,
  customHeader?: string
): string | null {
  const queryToken = req.nextUrl.searchParams.get("token")?.trim();
  if (queryToken) return queryToken;

  const authHeader = req.headers.get("authorization")?.trim();
  if (authHeader && /^Bearer\s+/i.test(authHeader)) {
    const bearer = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (bearer) return bearer;
  }

  if (customHeader) {
    const headerVal = req.headers.get(customHeader)?.trim();
    if (headerVal) return headerVal;
  }

  return null;
}

/**
 * Verifies a request against one or more server-side environment variable secrets.
 * Fails closed if no secret is configured or if the token does not match.
 */
export function verifySecretToken(
  req: NextRequest,
  envVarNames: string | string[],
  options?: {
    customHeader?: string;
    env?: NodeJS.ProcessEnv;
  }
): SecretVerificationResult {
  const env = options?.env ?? process.env;
  const names = Array.isArray(envVarNames) ? envVarNames : [envVarNames];

  const configuredSecrets = names
    .map((name) => env[name]?.trim() || "")
    .filter((val) => val.length > 0);

  if (configuredSecrets.length === 0) {
    return {
      ok: false,
      status: 503,
      error: `Server secret is not configured (${names.join(" or ")}).`,
    };
  }

  const provided = extractTokenFromRequest(req, options?.customHeader);
  if (!provided) {
    return {
      ok: false,
      status: 401,
      error: "Missing authentication token.",
    };
  }

  const matched = configuredSecrets.some((secret) =>
    timingSafeTokenEquals(provided, secret)
  );

  if (!matched) {
    return {
      ok: false,
      status: 401,
      error: "Invalid authentication token.",
    };
  }

  return { ok: true };
}

/**
 * Rejects cross-origin browser requests when an Origin header is present and
 * does not match the request Host / X-Forwarded-Host.
 */
export function isCrossOriginRequest(req: NextRequest): boolean {
  const originHeader = req.headers.get("origin");
  if (!originHeader) return false;

  let urlHost = "";
  try {
    urlHost = new URL(req.url).host;
  } catch {
    urlHost = "";
  }

  const expectedHost =
    req.headers.get("x-forwarded-host") ||
    req.headers.get("host") ||
    urlHost;
  if (!expectedHost) return false;

  try {
    const parsedOrigin = new URL(originHeader);
    return parsedOrigin.host.toLowerCase() !== expectedHost.trim().toLowerCase();
  } catch {
    return true;
  }
}

export function extractClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = req.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  return "local";
}

export function checkSlidingWindowRateLimit(params: {
  key: string;
  nowMs: number;
  windowMs: number;
  maxRequests: number;
  buckets: Map<string, number[]>;
}): { allowed: boolean; retryAfterSeconds: number } {
  const cutoff = params.nowMs - params.windowMs;
  const existing = (params.buckets.get(params.key) ?? []).filter(
    (ts) => ts > cutoff
  );

  if (existing.length >= params.maxRequests) {
    const oldest = existing[0] ?? params.nowMs;
    const retryAfterMs = Math.max(1000, oldest + params.windowMs - params.nowMs);
    params.buckets.set(params.key, existing);
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil(retryAfterMs / 1000),
    };
  }

  existing.push(params.nowMs);
  params.buckets.set(params.key, existing);

  if (params.buckets.size > 500) {
    for (const [bucketKey, timestamps] of params.buckets.entries()) {
      const fresh = timestamps.filter((ts) => ts > cutoff);
      if (fresh.length === 0) {
        params.buckets.delete(bucketKey);
      } else {
        params.buckets.set(bucketKey, fresh);
      }
    }
  }

  return { allowed: true, retryAfterSeconds: 0 };
}
