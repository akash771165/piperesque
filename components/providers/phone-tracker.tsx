"use client";

import { useEffect } from "react";
import { trackPhoneClick, type PhoneClickEvent } from "@/lib/analytics/track";

function sendIntentBeacon(payload: {
  type: "call" | "form";
  page: string;
  event: string;
}) {
  try {
    const body = JSON.stringify(payload);
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon("/api/track-intent", blob)) {
        return;
      }
    }
    void fetch("/api/track-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {
      // Non-blocking telemetry
    });
  } catch {
    // Ignore client beacon errors so dialer / link navigation never blocks
  }
}

/**
 * Global passive listener for phone referral and estimate intent conversions across the site.
 * Intercepts tap-to-call links and estimate CTAs without blocking native navigation.
 */
export default function PhoneClickTracker() {
  useEffect(() => {
    function handleGlobalClick(e: MouseEvent) {
      const originNode = e.target as HTMLElement | null;
      if (!originNode) return;

      const telTarget = originNode.closest("a[href^='tel:']");
      if (telTarget) {
        const eventAttr = telTarget.getAttribute("data-event") as PhoneClickEvent | null;
        const eventName: PhoneClickEvent = eventAttr || "phone_click_content";
        const href = telTarget.getAttribute("href") || "";
        const text = telTarget.textContent?.trim().slice(0, 50) || "";
        const pagePath = window.location.pathname;

        trackPhoneClick(eventName, {
          tel: href,
          button_text: text,
          page_path: pagePath,
        });

        sendIntentBeacon({
          type: "call",
          page: pagePath,
          event: eventName,
        });
        return;
      }

      const estimateTarget = originNode.closest(
        "a[data-intent='form'], a[href*='leadsmart']"
      );
      if (estimateTarget) {
        sendIntentBeacon({
          type: "form",
          page: window.location.pathname,
          event: "estimate_cta_click",
        });
      }
    }

    document.addEventListener("click", handleGlobalClick, { passive: true });
    return () => document.removeEventListener("click", handleGlobalClick);
  }, []);

  return null;
}
