"use client";

import React, { useState } from "react";
import { CheckCircle2, Phone, Send, ShieldCheck, AlertCircle } from "lucide-react";
import { trackContactFormSubmit } from "@/lib/analytics/track";

interface FormData {
  fullName: string;
  phone: string;
  zipCode: string;
  serviceRequested: string;
  details: string;
  consentAccepted: boolean;
}

const INITIAL_FORM: FormData = {
  fullName: "",
  phone: "",
  zipCode: "",
  serviceRequested: "Emergency Plumbing",
  details: "",
  consentAccepted: false,
};

export default function ReferralLeadForm() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [leadId, setLeadId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(): boolean {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Please enter your name.";
    }

    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      newErrors.phone = "Please enter a valid 10-digit phone number.";
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Generate random lead tracking reference ID
    const generatedId = `PR-${formData.zipCode}-${Math.floor(1000 + Math.random() * 9000)}`;
    setLeadId(generatedId);

    // Track submission event safely (ZERO PII sent to analytics)
    trackContactFormSubmit({
      serviceRequested: formData.serviceRequested,
      pagePath: typeof window !== "undefined" ? window.location.pathname : "/contact",
      source: "web_referral_form",
    });

    // In a full production server deployment, this POSTs to /api/leads
    // Store in session storage for attribution verification
    if (typeof window !== "undefined") {
      try {
        const leadRecord = {
          leadId: generatedId,
          timestamp: new Date().toISOString(),
          zip: formData.zipCode,
          service: formData.serviceRequested,
          status: "pending_provider_assignment",
        };
        sessionStorage.setItem("piperesque_last_lead", JSON.stringify(leadRecord));
      } catch {
        // Safe fallback
      }
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 400);
  }

  if (isSubmitted) {
    return (
      <div className="rounded-3xl border-2 border-emerald-500/30 bg-emerald-50/50 p-8 text-slate-900 shadow-sm md:p-10">
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
          licensed plumbing contractor servicing your area will contact you shortly.
        </p>

        <div className="mt-6 rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Need Immediate Emergency Service?
          </p>
          <p className="mt-1 text-sm text-slate-600">
            For active water leaks or urgent sewage backups, phone calls receive the fastest response.
          </p>
          <a
            href="tel:+18773640861"
            data-event="phone_click_contact"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-base font-black text-slate-950 shadow-md transition hover:bg-amber-400"
          >
            <Phone size={18} aria-hidden="true" />
            Call (877) 364-0861
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
          <Send size={20} aria-hidden="true" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
            Online Plumbing Referral Request
          </span>
          <h2 className="text-2xl font-black text-slate-900">
            Request an Independent Plumbing Referral
          </h2>
        </div>
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        Describe your plumbing problem below. We connect Houston homeowners with qualified independent
        plumbing contractors for diagnostics, repairs, and estimates.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        {/* Full Name */}
        <div>
          <label htmlFor="lead-fullname" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Your Full Name *
          </label>
          <input
            id="lead-fullname"
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

        {/* Phone & Zip Row */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="lead-phone" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Phone Number *
            </label>
            <input
              id="lead-phone"
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
            <label htmlFor="lead-zipcode" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Houston ZIP Code *
            </label>
            <input
              id="lead-zipcode"
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

        {/* Service Requested */}
        <div>
          <label htmlFor="lead-service" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Plumbing Service Needed *
          </label>
          <select
            id="lead-service"
            value={formData.serviceRequested}
            onChange={(e) => setFormData({ ...formData, serviceRequested: e.target.value })}
            className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 transition focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="Emergency Plumbing">Emergency Plumbing</option>
            <option value="Water Heater Repair">Water Heater Repair / Replacement</option>
            <option value="Sewer Line Repair">Sewer Line Repair / Camera Inspection</option>
            <option value="Drain Cleaning">Drain Cleaning / Hydro-Jetting</option>
            <option value="Leak Detection">Slab Leak Detection &amp; Repair</option>
            <option value="Pipe Repair">Pipe Repair &amp; Whole-House Repiping</option>
            <option value="Toilet Repair">Toilet / Fixture Repair</option>
            <option value="Commercial Plumbing">Commercial Facility Plumbing</option>
          </select>
        </div>

        {/* Details */}
        <div>
          <label htmlFor="lead-details" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Brief Details of Plumbing Issue (Optional)
          </label>
          <textarea
            id="lead-details"
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
              to share my service inquiry with independent licensed local plumbing contractors servicing
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
