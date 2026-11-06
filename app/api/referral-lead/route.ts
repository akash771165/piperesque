import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { RevenueTracker } from "@/scripts/growth/revenue-tracker.mjs";

const LEADS_STORE_PATH = path.resolve(process.cwd(), "content/growth/leads-store.json");

// In-memory rate limiting map: ip -> timestamps[]
const rateLimitMap = new Map<string, number[]>();

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const now = Date.now();

    // 1. Rate limiting: Max 5 submissions per 10 minutes per IP
    const windowMs = 10 * 60 * 1000;
    const timestamps = (rateLimitMap.get(ip) || []).filter(t => now - t < windowMs);
    if (timestamps.length >= 5) {
      return NextResponse.json(
        { success: false, error: "Too many submission attempts. Please call (877) 364-0861 directly for immediate assistance." },
        { status: 429 }
      );
    }
    timestamps.push(now);
    rateLimitMap.set(ip, timestamps);

    const body = await req.json();

    // 2. Honeypot check for spam bots
    if (body.honeypot && body.honeypot.trim().length > 0) {
      console.warn(`[Lead Intake] Honeypot triggered from IP ${ip}`);
      return NextResponse.json({ success: true, leadId: "PR-SPAM-IGN" }); // Silently absorb
    }

    // 3. Validation
    const fullName = (body.fullName || "").trim();
    const phone = (body.phone || "").replace(/\D/g, "");
    const zipCode = (body.zipCode || "").trim();
    const serviceRequested = (body.serviceRequested || "").trim();
    const details = (body.details || "").trim();
    const consentAccepted = Boolean(body.consentAccepted);
    const sourcePage = (body.sourcePage || "/contact").trim();

    if (!fullName || fullName.length < 2) {
      return NextResponse.json({ success: false, error: "Full name is required (minimum 2 characters)." }, { status: 400 });
    }

    if (phone.length < 10) {
      return NextResponse.json({ success: false, error: "A valid 10-digit phone number is required." }, { status: 400 });
    }

    if (!/^\d{5}$/.test(zipCode)) {
      return NextResponse.json({ success: false, error: "A valid 5-digit ZIP code is required." }, { status: 400 });
    }

    if (!consentAccepted) {
      return NextResponse.json(
        { success: false, error: "Customer consent to connect with an independent licensed contractor is mandatory." },
        { status: 400 }
      );
    }

    // 4. Greater Houston geographic qualification check
    // Houston area ZIP codes generally span 77001 to 77598
    const zipNum = parseInt(zipCode, 10);
    const isHoustonArea = zipNum >= 77001 && zipNum <= 77598;
    const qualificationStatus = isHoustonArea ? "QUALIFIED" : "OUT_OF_SERVICE_AREA";

    // 5. Generate secure Lead Reference ID
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    const leadId = `PR-${zipCode}-${randomHex}`;

    // 6. Build secure Lead Record (Separating restricted contact info)
    const leadRecord = {
      leadId,
      createdAt: new Date().toISOString(),
      serviceCategory: serviceRequested || "General Plumbing",
      zipCode,
      sourcePage,
      consentStatus: "EXPLICIT_ACCEPTED",
      qualificationStatus,
      referralStatus: qualificationStatus === "QUALIFIED" ? "PENDING_DISPATCH" : "REJECTED_OUT_OF_AREA",
      providerId: null,
      providerResponse: null,
      jobCompletionStatus: "PENDING",
      verifiedPaymentStatus: "UNPAID",
      revenueAmount: 0,
      // Server-only restricted customer data (never exposed to client or public logs)
      _restrictedCustomer: {
        fullName,
        phone,
        details,
        ipHash: Buffer.from(ip).toString("base64")
      }
    };

    // 7. Persist to secure server storage
    const dir = path.dirname(LEADS_STORE_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    let existingLeads = [];
    if (fs.existsSync(LEADS_STORE_PATH)) {
      try {
        existingLeads = JSON.parse(fs.readFileSync(LEADS_STORE_PATH, "utf-8"));
      } catch {
        existingLeads = [];
      }
    }

    existingLeads.unshift(leadRecord);
    fs.writeFileSync(LEADS_STORE_PATH, JSON.stringify(existingLeads, null, 2), "utf-8");

    // 8. Update Revenue Tracker
    try {
      const tracker = new RevenueTracker();
      tracker.recordFormSubmission({
        leadReferenceId: leadId,
        serviceCategory: leadRecord.serviceCategory,
        zipCode,
        isQualified: qualificationStatus === "QUALIFIED"
      });
    } catch (err) {
      console.warn("[Lead Intake] Could not record to revenue tracker:", err);
    }

    console.log(`[Lead Intake] Successfully persisted lead ${leadId} (${qualificationStatus})`);

    return NextResponse.json({
      success: true,
      leadId,
      qualificationStatus,
      message: "Referral request received and securely logged."
    });

  } catch (error: unknown) {
    console.error("[Lead Intake API] Fatal error processing lead:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error saving referral request. Please call (877) 364-0861 directly." },
      { status: 500 }
    );
  }
}
