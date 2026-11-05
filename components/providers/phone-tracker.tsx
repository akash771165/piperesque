"use client";

import { useEffect } from "react";
import { trackPhoneClick, type PhoneClickEvent } from "@/lib/analytics/track";

/**
 * Global passive listener for phone referral conversions across the site.
 * Intercepts tap-to-call links without blocking the native dialer action.
 */
export default function PhoneClickTracker() {
  useEffect(() => {
    function handleGlobalClick(e: MouseEvent) {
      const target = (e.target as HTMLElement)?.closest("a[href^='tel:']");
      if (!target) return;

      const eventAttr = target.getAttribute("data-event") as PhoneClickEvent | null;
      const eventName: PhoneClickEvent = eventAttr || "phone_click_content";
      const href = target.getAttribute("href") || "";
      const text = target.textContent?.trim().slice(0, 50) || "";

      trackPhoneClick(eventName, {
        tel: href,
        button_text: text,
        page_path: window.location.pathname,
      });
    }

    document.addEventListener("click", handleGlobalClick, { passive: true });
    return () => document.removeEventListener("click", handleGlobalClick);
  }, []);

  return null;
}
