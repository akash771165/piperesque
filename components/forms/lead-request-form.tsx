"use client";

import { useState } from "react";
import { Send } from "lucide-react";

const services = [
  "Emergency Plumbing",
  "Drain Cleaning",
  "Leak Detection",
  "Water Heater Repair",
  "Sewer Line Repair",
  "Other",
] as const;

type Status = { kind: "success" | "error"; message: string } | null;

export default function LeadRequestForm() {
  const [status, setStatus] = useState<Status>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || "We couldn't send your request. Please call us instead.");
      }

      form.reset();
      setStatus({
        kind: "success",
        message: "Your request has been sent. If this is an emergency, please call the number shown on this page.",
      });
    } catch (error) {
      setStatus({
        kind: "error",
        message: error instanceof Error
          ? error.message
          : "We couldn't send your request. Please call the number shown on this page.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">Full name</span>
          <input name="name" autoComplete="name" required minLength={2} maxLength={100} placeholder="Your name" className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600" />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">Phone</span>
          <input name="phone" type="tel" autoComplete="tel" required minLength={7} maxLength={30} placeholder="(555) 123-4567" className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600" />
        </label>
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-bold text-slate-700">Email</span>
        <input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600" />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-bold text-slate-700">Service needed</span>
        <select name="service" required defaultValue="Emergency Plumbing" className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600">
          {services.map((service) => <option key={service}>{service}</option>)}
        </select>
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-bold text-slate-700">Message (optional)</span>
        <textarea name="message" rows={5} maxLength={2000} placeholder="Describe the plumbing issue and your general location." className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600" />
      </label>

      <div className="hidden" aria-hidden="true">
        <label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <label className="flex items-start gap-3 text-sm leading-6 text-slate-600">
        <input name="consent" type="checkbox" value="yes" required className="mt-1" />
        <span>I agree to be contacted about this service request. Piperesque connects homeowners with independent plumbing service providers and does not itself perform plumbing work.</span>
      </label>

      <button type="submit" disabled={isSubmitting} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-4 font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
        <Send size={18} />
        {isSubmitting ? "Sending request..." : "Submit request"}
      </button>

      {status && (
        <p role="status" aria-live="polite" className={status.kind === "success" ? "rounded-xl bg-green-50 p-4 text-sm text-green-800" : "rounded-xl bg-red-50 p-4 text-sm text-red-800"}>
          {status.message}
        </p>
      )}
    </form>
  );
}
