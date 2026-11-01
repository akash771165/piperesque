"use client";

import { useState } from "react";
import { Send, Phone, AlertTriangle, Loader2 } from "lucide-react";
import { ContactSchema, type ContactForm } from "@/lib/validators/contact";
import { siteConfig } from "@/lib/config/site";

export default function ContactFormComponent() {
  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    phone: "",
    email: "",
    service: "Emergency Plumbing",
    message: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ContactForm, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear individual field error on change
    if (fieldErrors[name as keyof ContactForm]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNoticeMessage(null);

    // Client-side validation with Zod
    const validation = ContactSchema.safeParse(formData);
    if (!validation.success) {
      const errors: Partial<Record<keyof ContactForm, string>> = {};
      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ContactForm;
        if (field && !errors[field]) {
          errors[field] = issue.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.status === 400 && data.fieldErrors) {
        setFieldErrors(data.fieldErrors);
      } else {
        // Online submission unavailable notice with direct phone contact option
        setNoticeMessage(
          data.message ||
            `Online form submissions are currently unavailable. Please call our 24/7 dispatch line directly at ${siteConfig.phoneDisplay} for immediate plumbing assistance.`
        );
      }
    } catch {
      setNoticeMessage(
        `Online form submissions are currently unavailable. Please call our 24/7 dispatch line directly at ${siteConfig.phoneDisplay} for immediate plumbing assistance.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-[36px] border border-slate-200 bg-slate-50 p-8 shadow-xl md:p-10">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white">
          <Send size={18} />
        </div>
        <h2 className="text-3xl font-black text-slate-900">Request service</h2>
      </div>

      {/* Prominent advisory banner directing to phone contact */}
      <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 shrink-0 text-amber-600" size={20} />
          <div>
            <h3 className="font-bold">Notice: Phone Service Priority</h3>
            <p className="mt-1 text-sm leading-6">
              Online contact form submissions are currently unavailable. For the fastest response
              and immediate dispatch, please call our 24/7 hotline directly:
            </p>
            <div className="mt-3">
              <a
                href={`tel:${siteConfig.phone}`}
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow transition hover:bg-blue-700"
              >
                <Phone size={16} />
                Call {siteConfig.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </div>

      {noticeMessage && (
        <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-5 text-blue-900">
          <div className="flex items-start gap-3">
            <Phone className="mt-0.5 shrink-0 text-blue-600" size={20} />
            <div>
              <h3 className="font-bold">Direct Phone Assistance</h3>
              <p className="mt-1 text-sm leading-6">{noticeMessage}</p>
              <div className="mt-3">
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm font-bold text-white hover:bg-blue-700"
                >
                  <Phone size={15} />
                  Call {siteConfig.phoneDisplay}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">
              Full name <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              disabled={isSubmitting}
              className={`w-full rounded-2xl border bg-white px-4 py-3 outline-none transition focus:border-blue-600 ${
                fieldErrors.name ? "border-red-500 bg-red-50/30" : "border-slate-300"
              }`}
            />
            {fieldErrors.name && (
              <span className="mt-1.5 block text-xs font-semibold text-red-600">
                {fieldErrors.name}
              </span>
            )}
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">
              Phone number <span className="text-red-500">*</span>
            </span>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(877) 364-0861"
              disabled={isSubmitting}
              className={`w-full rounded-2xl border bg-white px-4 py-3 outline-none transition focus:border-blue-600 ${
                fieldErrors.phone ? "border-red-500 bg-red-50/30" : "border-slate-300"
              }`}
            />
            {fieldErrors.phone && (
              <span className="mt-1.5 block text-xs font-semibold text-red-600">
                {fieldErrors.phone}
              </span>
            )}
          </label>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Email address <span className="text-red-500">*</span>
          </span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            disabled={isSubmitting}
            className={`w-full rounded-2xl border bg-white px-4 py-3 outline-none transition focus:border-blue-600 ${
              fieldErrors.email ? "border-red-500 bg-red-50/30" : "border-slate-300"
            }`}
          />
          {fieldErrors.email && (
            <span className="mt-1.5 block text-xs font-semibold text-red-600">
              {fieldErrors.email}
            </span>
          )}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Service needed <span className="text-red-500">*</span>
          </span>
          <select
            name="service"
            value={formData.service}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600"
          >
            <option value="Emergency Plumbing">Emergency Plumbing</option>
            <option value="Drain Cleaning">Drain Cleaning</option>
            <option value="Leak Detection">Leak Detection</option>
            <option value="Water Heater Repair">Water Heater Repair</option>
            <option value="Sewer Line Repair">Sewer Line Repair</option>
            <option value="Pipe Repair">Pipe Repair</option>
            <option value="Toilet Repair">Toilet Repair</option>
            <option value="Residential Plumbing">General Residential Plumbing</option>
            <option value="Other">Other Plumbing Service</option>
          </select>
          {fieldErrors.service && (
            <span className="mt-1.5 block text-xs font-semibold text-red-600">
              {fieldErrors.service}
            </span>
          )}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Message / Details <span className="text-red-500">*</span>
          </span>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            disabled={isSubmitting}
            placeholder="Tell us about the issue, property type, and urgency."
            className={`w-full rounded-2xl border bg-white px-4 py-3 outline-none transition focus:border-blue-600 ${
              fieldErrors.message ? "border-red-500 bg-red-50/30" : "border-slate-300"
            }`}
          />
          {fieldErrors.message && (
            <span className="mt-1.5 block text-xs font-semibold text-red-600">
              {fieldErrors.message}
            </span>
          )}
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-4 font-black text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Validating request...
            </>
          ) : (
            <>
              <Send size={18} />
              Submit request
            </>
          )}
        </button>

        <p className="text-center text-xs text-slate-500">
          For fastest emergency response, call{" "}
          <a href={`tel:${siteConfig.phone}`} className="font-bold text-blue-600 hover:underline">
            {siteConfig.phoneDisplay}
          </a>{" "}
          directly.
        </p>
      </form>
    </div>
  );
}
