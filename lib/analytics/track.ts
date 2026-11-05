export type PhoneClickEvent =
  | "phone_click_header"
  | "phone_click_hero"
  | "phone_click_sticky"
  | "phone_click_content"
  | "phone_click_footer"
  | "phone_click_service"
  | "phone_click_contact";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

/**
 * Fires phone click conversion tracking safely across available analytics providers (GA4, GTM, Clarity)
 * without failing or throwing if none are configured.
 */
export function trackPhoneClick(
  eventName: PhoneClickEvent,
  metadata?: Record<string, unknown>
): void {
  if (typeof window === "undefined") return;

  const payload = {
    event: eventName,
    action: "click_to_call",
    category: "engagement",
    phone_number: "+18773640861",
    timestamp: new Date().toISOString(),
    ...metadata,
  };

  try {
    // 1. Google Tag Manager dataLayer
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push(payload);
    }

    // 2. Google Analytics gtag
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, {
        event_category: "phone_referral",
        event_label: payload.phone_number,
        ...metadata,
      });
    }

    // 3. Microsoft Clarity custom event
    if (typeof window.clarity === "function") {
      window.clarity("event", eventName);
    }

    // 4. Custom DOM Event for custom listeners
    window.dispatchEvent(
      new CustomEvent("pipe_phone_click", {
        detail: payload,
      })
    );
  } catch {
    // Silent fail to preserve seamless user experience
  }
}
