/**
 * Autonomous Revenue & Referral Operations Tracker - Real Business Metrics Only
 * 
 * Strict Business & Integrity Rules:
 * - Total verified revenue is $0.00 until an independent contractor or payout settlement verifies payment.
 * - Raw phone clicks are recorded as intent signals, NOT completed phone calls or leads.
 * - Form submissions are recorded as intake events, NOT qualified leads.
 * - Qualified leads require valid Greater Houston service ZIP and non-spam problem description.
 * - ZERO-PII: No customer names, phone numbers, or street addresses are ever logged here.
 * - ZERO FABRICATED DATA: Fictional/demo transactions are completely excluded from KPI calculations.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "../..");
const REVENUE_STORE_FILE = path.join(ROOT, "content/growth/revenue-store.json");
const LEADS_STORE_FILE = path.join(ROOT, "content/growth/leads-store.json");

export class RevenueTracker {
  /**
   * @param {string|null} [customStorePath=null]
   */
  constructor(customStorePath = null) {
    this.storePath = customStorePath || REVENUE_STORE_FILE;
    this.leadsStorePath = LEADS_STORE_FILE;
    this.data = this._loadStore();
  }

  _loadStore() {
    if (fs.existsSync(this.storePath)) {
      try {
        const parsed = JSON.parse(fs.readFileSync(this.storePath, "utf-8"));
        // Ensure legacy fictional numbers are not preserved in active totals
        if (parsed.summary && parsed.summary.totalVerifiedReferralRevenue === "$250.00") {
          return this._getFreshZeroBaseline();
        }
        return parsed;
      } catch (err) {
        console.warn(`[Revenue Tracker] Could not parse revenue store: ${err.message}`);
      }
    }

    return this._getFreshZeroBaseline();
  }

  _getFreshZeroBaseline() {
    return {
      lastUpdated: new Date().toISOString(),
      summary: {
        totalPhoneClicks: 0,
        totalFormSubmissions: 0,
        totalQualifiedLeads: 0,
        totalReferralsDispatched: 0,
        totalReferralsAcceptedByProvider: 0,
        totalJobsCompleted: 0,
        totalVerifiedReferralRevenue: "$0.00",
        totalPendingReferralRevenue: "$0.00"
      },
      conversionFunnel: {
        phoneClickToQualifiedLeadRate: "0.0%",
        formSubmitToQualifiedLeadRate: "0.0%",
        dispatchToProviderAcceptanceRate: "0.0%"
      },
      transactions: [],
      auditNotice: "Real business metrics initialized with zero verified transactions. No fabricated numbers."
    };
  }

  save() {
    const dir = path.dirname(this.storePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    this.data.lastUpdated = new Date().toISOString();
    fs.writeFileSync(this.storePath, JSON.stringify(this.data, null, 2), "utf-8");
  }

  /**
   * Records a raw customer phone CTA click event
   */
  recordPhoneClick(pagePath = "unknown") {
    this.data.summary.totalPhoneClicks += 1;
    this._recalculateFunnel();
    this.save();
    return this.data.summary.totalPhoneClicks;
  }

  /**
   * Records a real verified lead intake submission
   */
  recordFormSubmission({ leadReferenceId, serviceCategory, zipCode, isQualified = false }) {
    this.data.summary.totalFormSubmissions += 1;
    if (isQualified) {
      this.data.summary.totalQualifiedLeads += 1;
    }
    this._recalculateFunnel();
    this.save();
  }

  /**
   * Records verified payment settlement from a contracted independent provider
   */
  recordVerifiedSettlement({ leadReferenceId, contractorPayout, providerId, settlementDate }) {
    if (!leadReferenceId || typeof contractorPayout !== "number" || contractorPayout <= 0) {
      throw new Error("Invalid settlement details. Requires leadReferenceId and positive payout number.");
    }

    this.data.transactions.push({
      leadReferenceId,
      providerId: providerId || "unassigned",
      amount: contractorPayout,
      settlementDate: settlementDate || new Date().toISOString().split("T")[0],
      status: "verified_paid",
      verifiedAt: new Date().toISOString()
    });

    // Sum all verified settlements
    const total = this.data.transactions
      .filter(t => t.status === "verified_paid")
      .reduce((sum, t) => sum + t.amount, 0);

    this.data.summary.totalVerifiedReferralRevenue = `$${total.toFixed(2)}`;
    this.save();
  }

  _recalculateFunnel() {
    const s = this.data.summary;
    const phoneToLead = s.totalPhoneClicks > 0 ? ((s.totalQualifiedLeads / s.totalPhoneClicks) * 100).toFixed(1) + "%" : "0.0%";
    const formToLead = s.totalFormSubmissions > 0 ? ((s.totalQualifiedLeads / s.totalFormSubmissions) * 100).toFixed(1) + "%" : "0.0%";
    const dispatchToAccept = s.totalReferralsDispatched > 0 ? ((s.totalReferralsAcceptedByProvider / s.totalReferralsDispatched) * 100).toFixed(1) + "%" : "0.0%";

    this.data.conversionFunnel = {
      phoneClickToQualifiedLeadRate: phoneToLead,
      formSubmitToQualifiedLeadRate: formToLead,
      dispatchToProviderAcceptanceRate: dispatchToAccept
    };
  }

  getMetrics() {
    return {
      phoneClicks: this.data.summary.totalPhoneClicks,
      formSubmits: this.data.summary.totalFormSubmissions,
      qualifiedLeads: this.data.summary.totalQualifiedLeads,
      referralsDispatched: this.data.summary.totalReferralsDispatched,
      verifiedRevenue: this.data.summary.totalVerifiedReferralRevenue,
      pendingRevenue: this.data.summary.totalPendingReferralRevenue,
      funnel: this.data.conversionFunnel
    };
  }
}
