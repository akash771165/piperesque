import { ExternalLink, FileText, Phone, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/lib/config/site";

export const LEADSMART_ESTIMATE_URL =
  "https://leads.leadsmartinc.com/?api_key=eb7353a561f876a7c03543787a0cd05ac8a926d3&affiliate_source=mohitjkeg1&category=1&funnel=3&buttons=btn-success&step=1";

export const LEADSMART_QUOTE_IFRAME_URL =
  "https://leads.leadsmartinc.com/?api_key=eb7353a561f876a7c03543787a0cd05ac8a926d3&affiliate_source=mohitjkeg1&funnel=4&category=1&step=1&buttons=btn-success";

export const LEADSMART_FULL_IFRAME_URL =
  "https://leads.leadsmartinc.com/?api_key=eb7353a561f876a7c03543787a0cd05ac8a926d3&affiliate_source=mohitjkeg1&funnel=3&category=1&step=1&buttons=btn-success";

export type LeadSmartEmbedVariant = "quote-form" | "full-form";

interface LeadSmartEmbedSectionProps {
  variant?: LeadSmartEmbedVariant;
  id?: string;
  eyebrow?: string;
  heading?: string;
  description?: string;
  phoneEvent?:
    | "phone_click_header"
    | "phone_click_hero"
    | "phone_click_sticky"
    | "phone_click_content"
    | "phone_click_footer"
    | "phone_click_service"
    | "phone_click_contact";
}

export default function LeadSmartEmbedSection({
  variant = "quote-form",
  id = "request-referral",
  eyebrow = "Free Online Plumbing Estimate",
  heading = "Get a Free Plumbing Quote in Houston",
  description = "Compare estimate options from independent local plumbing professionals or call our hotline directly for urgent assistance.",
  phoneEvent = "phone_click_content",
}: LeadSmartEmbedSectionProps) {
  const isFullForm = variant === "full-form";
  const iframeSrc = isFullForm
    ? LEADSMART_FULL_IFRAME_URL
    : LEADSMART_QUOTE_IFRAME_URL;
  const iframeTitle = isFullForm
    ? "Request a Plumbing Estimate"
    : "Get a Free Plumbing Quote";

  return (
    <div
      id={id}
      className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 md:p-10"
    >
      {/* Header & Direct Action Row */}
      <div className="flex flex-col gap-6 border-b border-slate-100 pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
            <FileText size={14} aria-hidden="true" />
            <span>{eyebrow}</span>
          </div>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            {heading}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
            {description}
          </p>
        </div>

        {/* Primary Call CTA + Estimate Link */}
        <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
          <a
            href={`tel:${siteConfig.phone}`}
            data-event={phoneEvent}
            aria-label={`Call Now at ${siteConfig.phoneDisplay}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3.5 text-sm font-black text-slate-950 shadow-md shadow-amber-500/20 transition hover:bg-amber-400 active:scale-[0.98] sm:text-base"
          >
            <Phone size={18} className="fill-slate-950" aria-hidden="true" />
            <span>Call Now: {siteConfig.phoneDisplay}</span>
          </a>

          <a
            href={LEADSMART_ESTIMATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-500 active:scale-[0.98] sm:text-base"
          >
            <span>Get a Free Estimate</span>
            <ExternalLink size={16} aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* Responsive Iframe Wrapper */}
      <div className="mt-6">
        <div
          className={
            isFullForm
              ? "w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
              : "mx-auto w-full max-w-[640px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
          }
        >
          <iframe
            src={iframeSrc}
            title={iframeTitle}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className={
              isFullForm
                ? "block w-full min-h-[600px] h-[620px] border-0"
                : "block w-full min-h-[560px] h-[580px] md:h-[600px] border-0"
            }
          />
        </div>
      </div>

      {/* Transparent Referral Notice */}
      <p className="mt-5 flex items-start gap-2 text-xs leading-5 text-slate-500 sm:items-center">
        <ShieldCheck
          size={15}
          className="mt-0.5 shrink-0 text-emerald-600 sm:mt-0"
          aria-hidden="true"
        />
        <span>
          PipeResque connects homeowners with independent third-party plumbing
          professionals. Estimates, availability, and service terms are provided
          directly by independent contractors. For active leaks or urgent
          backups, call{" "}
          <a
            href={`tel:${siteConfig.phone}`}
            data-event={phoneEvent}
            className="font-bold text-slate-800 underline decoration-amber-500 underline-offset-2 hover:text-blue-700"
          >
            {siteConfig.phoneDisplay}
          </a>
          .
        </span>
      </p>
    </div>
  );
}
