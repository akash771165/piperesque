"use client";

import React, { useState } from "react";
import { CheckCircle2, Phone, Send, ShieldCheck, AlertCircle } from "lucide-react";
import { trackContactFormSubmit } from "@/lib/analytics/track";

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  zipCode: string;
  serviceRequested: string;
  urgency: "urgent" | "standard";
  details: string;
  consentAccepted: boolean;
}

interface ReferralLeadFormProps {
  defaultService?: string;
  heading?: string;
  id?: string;
}

const SERVICE_OPTIONS = [
  { value: "Emergency Plumbing", label: "Emergency Plumbing" },
  { value: "Sewer Line Repair", label: "Sewer Line Repair / Camera Inspection" },
  { value: "Water Heater Repair", label: "Water Heater Repair / Replacement" },
  { value: "Drain Cleaning", label: "Drain Cleaning / Hydro-Jetting" },
  { value: "Leak Detection", label: "Slab Leak Detection & Repair" },
  { value: "Pipe Repair", label: "Pipe Repair & Whole-House Repiping" },
  { value: "Toilet Repair", label: "Toilet / Fixture Repair" },
  { value: "Faucet Repair", label: "Faucet Repair & Replacement" },
  { value: "Residential Plumbing", label: "General Residential Plumbing" },
  { value: "Commercial Plumbing", label: "Commercial Facility Plumbing" },
];

export default function ReferralLeadForm({
  defaultService = "Emergency Plumbing",
  heading = "Request an Independent Plumbing Referral",
  id = "request-referral",
}: ReferralLeadFormProps) {
  const matchedOption =
    SERVICE_OPTIONS.find(
      (opt) => opt.value.toLowerCase() === defaultService.toLowerCase()
    )?.value || "Emergency Plumbing";

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phone: "",
    email: "",
    zipCode: "",
    serviceRequested: matchedOption,
    urgency: matchedOption === "Emergency Plumbing" ? "urgent" : "standard",
    details: "",
    consentAccepted: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [leadId, setLeadId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  function validate(): boolean {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Please enter your name.";
    }

    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      newErrors.phone = "Please enter a valid 10-digit phone number.";
    }

    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address or leave blank.";
    }

    const cleanZip = formData.zipCode.trim();
    if (!/^\d{5}$/.test(cleanZip)) {
      newErrors.zipCode = "Please enter a valid 5-digit Texas ZIP code.";
    }

    if (!formData.serviceRequested) {
      newErrors.serviceRequested = "Please select a service category.";
    }

    if (!formData.consentAccepted) {
      newErrors.consentAccepted = "You must provide consent to connect with an independent plumbing contractor.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/referral-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email.trim() || undefined,
          zipCode: formData.zipCode,
          serviceRequested: formData.serviceRequested,
          urgency: formData.urgency,
          details: formData.details,
          consentAccepted: formData.consentAccepted,
          sourcePage: typeof window !== "undefined" ? window.location.pathname : "/contact",
          honeypot
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success || !data.leadId) {
        throw new Error(data.error || "Unable to submit referral request. Please try calling (877) 587-3986 directly.");
      }

      setLeadId(data.leadId);
      setIsSubmitted(true);

      // Track submission event only on real verified server success (zero PII)
      trackContactFormSubmit({
        serviceRequested: formData.serviceRequested,
        pagePath: typeof window !== "undefined" ? window.location.pathname : "/contact",
        source: "web_referral_form",
      });

    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "A network or server error occurred. Please call (877) 587-3986.";
      setServerError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <div id={id} className="rounded-3xl border-2 border-emerald-500/30 bg-emerald-50/50 p-8 text-slate-900 shadow-sm md:p-10">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md">
          <CheckCircle2 size={28} aria-hidden="true" />
        </div>

        <h3 className="mt-6 text-2xl font-black text-slate-950">
          Referral Request Received
        </h3>

        <p className="mt-2 text-sm text-emerald-800">
          Reference ID: <span className="font-mono font-bold">{leadId}</span>
        </p>

        <p className="mt-4 leading-7 text-slate-700">
          Thank you, <span className="font-semibold">{formData.fullName}</span>. Your request for{" "}
          <span className="font-semibold">{formData.serviceRequested}</span> in{" "}
          <span className="font-semibold">{formData.zipCode}</span> has been logged. An independent
          plumbing service provider serving your area will review your request; availability and response timing depend on the independent provider.
        </p>

        <div className="mt-6 rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Dealing With an Active Leak or Backup?
          </p>
          <p className="mt-1 text-sm text-slate-600">
            For active water leaks or urgent sewage backups, calling directly is the fastest way to reach telephone routing.
          </p>
          <a
            href="tel:+18775873986"
            data-event="phone_click_contact"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-base font-black text-slate-950 shadow-md transition hover:bg-amber-400"
          >
            <Phone size={18} aria-hidden="true" />
            Call (877) 587-3986
          </a>
        </div>
      </div>
    );
  }

  return (
    <div id={id} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
          <Send size={20} aria-hidden="true" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
            Online Plumbing Referral Request
          </span>
          <h2 className="text-2xl font-black text-slate-900">
            {heading}
          </h2>
        </div>
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        Describe your plumbing problem below. PipeResque is a referral platform that connects Houston homeowners with independent plumbing service providers for diagnostics, repairs, and estimates.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        {/* Anti-Spam Honeypot Field */}
        <div style={{ display: "none" }} aria-hidden="true">
          <label htmlFor={`${id}-company-website`}>Do not fill this</label>
          <input
            id={`${id}-company-website`}
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        {/* Server-Side Error Alert */}
        {serverError && (
          <div className="rounded-xl border border-rose-300 bg-rose-50 p-4 text-xs text-rose-800 flex items-start gap-2">
            <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Submission Notice</p>
              <p className="mt-0.5">{serverError}</p>
            </div>
          </div>
        )}

        {/* Full Name & Email Row */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`${id}-fullname`} className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Your Full Name *
            </label>
            <input
              id={`${id}-fullname`}
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="e.g. Sarah Johnson"
              className={`mt-1.5 w-full rounded-xl border px-4 py-3 text-sm text-slate-900 transition focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                errors.fullName ? "border-rose-500 bg-rose-50/20" : "border-slate-300"
              }`}
            />
            {errors.fullName && (
              <p className="mt-1 flex items-center gap-1 text-xs text-rose-600">
                <AlertCircle size={12} /> {errors.fullName}
              </p>
            )}
          </div>

          <div>
            <label htmlFor={`${id}-email`} className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Email Address (Optional)
            </label>
            <input
              id={`${id}-email`}
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="you@example.com"
              className={`mt-1.5 w-full rounded-xl border px-4 py-3 text-sm text-slate-900 transition focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                errors.email ? "border-rose-500 bg-rose-50/20" : "border-slate-300"
              }`}
            />
            {errors.email && (
              <p className="mt-1 flex items-center gap-1 text-xs text-rose-600">
                <AlertCircle size={12} /> {errors.email}
              </p>
            )}
          </div>
        </div>

        {/* Phone & Zip Row */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`${id}-phone`} className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Phone Number *
            </label>
            <input
              id={`${id}-phone`}
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="(713) 555-0199"
              className={`mt-1.5 w-full rounded-xl border px-4 py-3 text-sm text-slate-900 transition focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                errors.phone ? "border-rose-500 bg-rose-50/20" : "border-slate-300"
              }`}
            />
            {errors.phone && (
              <p className="mt-1 flex items-center gap-1 text-xs text-rose-600">
                <AlertCircle size={12} /> {errors.phone}
              </p>
            )}
          </div>

          <div>
            <label htmlFor={`${id}-zipcode`} className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Houston ZIP Code *
            </label>
            <input
              id={`${id}-zipcode`}
              type="text"
              required
              maxLength={5}
              value={formData.zipCode}
              onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
              placeholder="e.g. 77002, 77449"
              className={`mt-1.5 w-full rounded-xl border px-4 py-3 text-sm text-slate-900 transition focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                errors.zipCode ? "border-rose-500 bg-rose-50/20" : "border-slate-300"
              }`}
            />
            {errors.zipCode && (
              <p className="mt-1 flex items-center gap-1 text-xs text-rose-600">
                <AlertCircle size={12} /> {errors.zipCode}
              </p>
            )}
          </div>
        </div>

        {/* Service & Urgency Row */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`${id}-service`} className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Plumbing Service Needed *
            </label>
            <select
              id={`${id}-service`}
              value={formData.serviceRequested}
              onChange={(e) => setFormData({ ...formData, serviceRequested: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 transition focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {SERVICE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor={`${id}-urgency`} className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Situation Urgency
            </label>
            <select
              id={`${id}-urgency`}
              value={formData.urgency}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  urgency: e.target.value === "urgent" ? "urgent" : "standard",
                })
              }
              className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 transition focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="urgent">Urgent — Active Leak, Backup, or No Hot Water</option>
              <option value="standard">Standard — Inspection or Scheduled Repair</option>
            </select>
          </div>
        </div>

        {/* Details */}
        <div>
          <label htmlFor={`${id}-details`} className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Brief Details of Plumbing Issue (Optional)
          </label>
          <textarea
            id={`${id}-details`}
            rows={3}
            value={formData.details}
            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
            placeholder="e.g. Water heater leaking from base, water shut off at valve..."
            className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 transition focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Explicit Customer Consent Checkbox */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.consentAccepted}
              onChange={(e) => setFormData({ ...formData, consentAccepted: e.target.checked })}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-xs leading-5 text-slate-600">
              <strong className="text-slate-900">Customer Referral Consent:</strong> I authorize PipeResque
              to share my service inquiry with independent local plumbing contractors servicing
              Greater Houston for the sole purpose of receiving service information, diagnostics, or an
              estimate. I understand PipeResque is an informational referral platform and not the plumbing
              contractor. *
            </span>
          </label>
          {errors.consentAccepted && (
            <p className="mt-2 flex items-center gap-1 text-xs text-rose-600">
              <AlertCircle size={12} /> {errors.consentAccepted}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-4 text-base font-bold text-white shadow-md shadow-blue-700/20 transition hover:bg-blue-600 active:scale-[0.99] disabled:opacity-60"
        >
          {isSubmitting ? "Submitting Inquiry..." : "Submit Referral Request"}
          <Send size={16} aria-hidden="true" />
        </button>

        <p className="text-center text-xs text-slate-500 flex items-center justify-center gap-1.5 pt-1">
          <ShieldCheck size={14} className="text-emerald-600" />
          Your information is protected under our Privacy Policy and never sold to marketing lists.
        </p>
      </form>
    </div>
  );
}
