export type PhoneClickEvent =
  | "phone_click_header"
  | "phone_click_hero"
  | "phone_click_sticky"
  | "phone_click_content"
  | "phone_click_footer"
  | "phone_click_service"
  | "phone_click_contact";

export type ConversionEvent =
  | "click_to_call"
  | "contact_form_submit"
  | "qualified_lead"
  | "referral_delivered";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

// In-memory deduplication cache to prevent double-firing events within 3 seconds
const recentEvents = new Map<string, number>();

function isDuplicateEvent(fingerprint: string, windowMs = 3000): boolean {
  const now = Date.now();
  const lastFired = recentEvents.get(fingerprint);
  if (lastFired && now - lastFired < windowMs) {
    return true;
  }
  recentEvents.set(fingerprint, now);
  // Clean old entries
  if (recentEvents.size > 50) {
    for (const [key, time] of recentEvents.entries()) {
      if (now - time > 10000) recentEvents.delete(key);
    }
  }
  return false;
}

/**
 * Sanitizes metadata to strictly exclude any personally identifiable information (PII)
 * such as customer emails, personal phone numbers, or street addresses.
 */
function sanitizeAnalyticsMetadata(metadata?: Record<string, unknown>): Record<string, unknown> {
  if (!metadata) return {};
  const sanitized: Record<string, unknown> = {};
  const forbiddenKeys = ["email", "phone", "customer_phone", "customer_email", "name", "address"];

  for (const [key, value] of Object.entries(metadata)) {
    if (!forbiddenKeys.includes(key.toLowerCase()) && typeof value !== "function") {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

/**
 * Fires phone click conversion tracking safely across available analytics providers (GA4, GTM, Clarity)
 * without blocking native telephone dialer actions.
 */
export function trackPhoneClick(
  eventName: PhoneClickEvent,
  metadata?: Record<string, unknown>
): void {
  if (typeof window === "undefined") return;

  const fingerprint = `${eventName}_${metadata?.tel || "tollfree"}`;
  if (isDuplicateEvent(fingerprint)) return;

  const cleanMetadata = sanitizeAnalyticsMetadata(metadata);

  const payload = {
    event: eventName,
    action: "click_to_call",
    category: "engagement",
    referral_phone: "+18773640861",
    timestamp: new Date().toISOString(),
    ...cleanMetadata,
  };

  try {
    // 1. Google Tag Manager dataLayer
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push(payload);
    }

    // 2. Google Analytics gtag (click_to_call event standard)
    if (typeof window.gtag === "function") {
      window.gtag("event", "click_to_call", {
        event_category: "phone_referral",
        event_label: eventName,
        ...cleanMetadata,
      });
    }

    // 3. Microsoft Clarity custom event
    if (typeof window.clarity === "function") {
      window.clarity("event", "click_to_call");
    }

    // 4. Custom DOM Event
    window.dispatchEvent(
      new CustomEvent("pipe_conversion_event", {
        detail: payload,
      })
    );
  } catch {
    // Silent fail to preserve seamless user experience
  }
}

/**
 * Tracks a successfully validated and submitted contact or referral inquiry.
 * Never pass customer PII (phone/email/name) to this function.
 */
export function trackContactFormSubmit(metadata: {
  serviceRequested: string;
  pagePath: string;
  source?: string;
}): void {
  if (typeof window === "undefined") return;

  const fingerprint = `form_submit_${metadata.serviceRequested}_${metadata.pagePath}`;
  if (isDuplicateEvent(fingerprint, 5000)) return;

  const payload = {
    event: "contact_form_submit",
    action: "form_submission",
    category: "lead_generation",
    service: metadata.serviceRequested,
    page: metadata.pagePath,
    timestamp: new Date().toISOString(),
  };

  try {
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push(payload);
    }
    if (typeof window.gtag === "function") {
      window.gtag("event", "contact_form_submit", {
        event_category: "referral_lead",
        service_category: metadata.serviceRequested,
      });
    }
    if (typeof window.clarity === "function") {
      window.clarity("event", "contact_form_submit");
    }
  } catch {
    // Silent fail
  }
}

/**
 * Tracks when an inquiry is validated as a qualified referral by an operator or backend.
 * Only call this upon an actual qualification decision.
 */
export function trackQualifiedLead(metadata: {
  leadId: string;
  serviceCategory: string;
  zipCode?: string;
}): void {
  if (typeof window === "undefined") return;

  const payload = {
    event: "qualified_lead",
    lead_id: metadata.leadId,
    service: metadata.serviceCategory,
    zip: metadata.zipCode,
    timestamp: new Date().toISOString(),
  };

  try {
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push(payload);
    }
    if (typeof window.gtag === "function") {
      window.gtag("event", "qualified_lead", payload);
    }
  } catch {
    // Silent fail
  }
}

/**
 * Tracks when a qualified referral is successfully delivered to an independent plumbing contractor.
 */
export function trackReferralDelivered(metadata: {
  leadId: string;
  providerId: string;
}): void {
  if (typeof window === "undefined") return;

  const payload = {
    event: "referral_delivered",
    lead_id: metadata.leadId,
    provider_id: metadata.providerId,
    timestamp: new Date().toISOString(),
  };

  try {
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push(payload);
    }
    if (typeof window.gtag === "function") {
      window.gtag("event", "referral_delivered", payload);
    }
  } catch {
    // Silent fail
  }
}

