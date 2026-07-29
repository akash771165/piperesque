declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

// ----------------------------
// Page View
// ----------------------------
export const pageview = (url: string) => {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

// ----------------------------
// Generic Event
// ----------------------------
export const event = ({
  action,
  category,
  label,
  value,
  ...params
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
  [key: string]: any;
}) => {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value,
    ...params,
  });
};

// ----------------------------
// Phone Click Tracking
// ----------------------------
export const trackPhoneCall = (location: string) => {
  event({
    action: "phone_click",
    category: "lead",
    label: location,
    value: 1,
    phone_number: "+18773640861",
  });
};

// ----------------------------
// Contact Form Tracking
// ----------------------------
export const trackContactForm = () => {
  event({
    action: "contact_form_submit",
    category: "lead",
    label: "contact_form",
    value: 1,
  });
};

// ----------------------------
// CTA Button Tracking
// ----------------------------
export const trackCTA = (location: string) => {
  event({
    action: "cta_click",
    category: "engagement",
    label: location,
    value: 1,
  });
};