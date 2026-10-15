import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const leadSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(30),
  email: z.string().trim().email().max(254),
  service: z.enum([
    "Emergency Plumbing",
    "Drain Cleaning",
    "Leak Detection",
    "Water Heater Repair",
    "Sewer Line Repair",
    "Other",
  ]),
  message: z.string().trim().max(2000).optional().default(""),
  website: z.string().optional().default(""),
  consent: z.literal("yes"),
});

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Please submit a valid request." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Please check your contact details and consent, then try again." }, { status: 400 });
  }

  // Quietly reject bots that fill the hidden honeypot field.
  if (parsed.data.website.trim()) {
    return NextResponse.json({ ok: true, message: "Request received." });
  }

  const webhookUrl = process.env.N8N_LEAD_WEBHOOK_URL;
  const webhookSecret = process.env.N8N_LEAD_WEBHOOK_SECRET;

  if (!webhookUrl || !webhookSecret) {
    return NextResponse.json(
      { message: "The enquiry form is being configured. Please call the phone number shown on this page for assistance." },
      { status: 503 },
    );
  }

  try {
    const endpoint = new URL(webhookUrl);
    if (endpoint.protocol !== "https:") {
      return NextResponse.json({ message: "Lead routing is not securely configured." }, { status: 503 });
    }

    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Secret": webhookSecret,
      },
      body: JSON.stringify({
        name: parsed.data.name,
        phone: parsed.data.phone,
        email: parsed.data.email,
        service: parsed.data.service,
        message: parsed.data.message,
        consent: true,
        source: "piperesque.com/contact",
        submittedAt: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });

    if (!upstream.ok) {
      console.error("n8n lead webhook rejected the submission", { status: upstream.status });
      return NextResponse.json(
        { message: "We couldn't send your request right now. Please call the phone number shown on this page." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, message: "Your request has been sent." });
  } catch (error) {
    console.error("n8n lead forwarding failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { message: "We couldn't send your request right now. Please call the phone number shown on this page." },
      { status: 502 },
    );
  }
}
