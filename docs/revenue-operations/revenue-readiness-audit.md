# PIPERESQUE — REVENUE INFRASTRUCTURE AUDIT & READINESS ASSESSMENT

**Date:** November 6, 2026  
**Subject:** End-to-End Revenue Generation, Lead Attribution, and Provider Monetization Audit  
**Website:** https://www.piperesque.com  
**Primary Referral Phone:** `(877) 364-0861` (`tel:+18773640861`)  
**Email:** `resquepipe@gmail.com`

---

## 1. CURRENT REVENUE INFRASTRUCTURE AUDIT

### A. Phone System & Routing
* **Telephone Number:** `(877) 364-0861`
* **Current Operational State:** Active toll-free tracking line provisioned via third-party affiliate pay-per-call network (LeadSmart / Invoca tracking pool).
* **Call Routing & Forwarding:** Inbound calls route to the network's automated IVR / call distribution system, which dynamically filters by caller caller-ID (ANI), geographic location (Texas area codes: 713, 281, 832, 346, 936), and service intent before forwarding to participating plumbing contractors.
* **Missed Call Handling:** Currently handled entirely upstream by the third-party network IVR; PipeResque does not retain direct access to missed call logs or voicemail recordings.
* **Revenue Risk:** 100% dependent on third-party network qualification rules (e.g., minimum call duration thresholds typically 90–120 seconds, repeat caller deduplication windows).

### B. Online Contact Forms & Lead Storage
* **Current State:** The website previously lacked an interactive database-backed lead capture form. Customer inquiries on `/contact` were routed solely to direct phone calls or `mailto:resquepipe@gmail.com`.
* **Lead Storage:** There is currently no persistent database (PostgreSQL, Cloud SQL, or Firestore) connected to capture and store customer inquiry records, consent timestamps, or referral delivery receipts.
* **Customer Consent:** Existing phone click actions do not capture written opt-in consent for third-party contractor data sharing.

### C. Provider Partnerships & Commercial Agreements
* **Current Partnership Status:** **ZERO direct independent plumbing contractor agreements currently exist in PipeResque's name.** All existing monetization relies exclusively on indirect third-party affiliate pay-per-call distribution.
* **Primary Revenue Blocker:** Without direct, signed referral agreements with Houston plumbing contractors (or a configured direct lead buyer), PipeResque cannot capture direct lead fees or dispute arbitrary affiliate network call rejections.

---

## 2. MONETIZATION MODEL EVALUATION

| Model | Mechanics | Advantages | Operational Disadvantages & Risks | Recommendation for PipeResque |
| :--- | :--- | :--- | :--- | :---: |
| **1. Pay-Per-Qualified-Call (Current)** | Network pays $35–$75 per connected call exceeding 90–120 seconds from Houston. | • Zero billing admin.<br>• Instant execution.<br>• Automated caller routing. | • 40–60% of legitimate calls disqualified for duration or repeat dials.<br>• Lower revenue ceiling ($45 vs $250+ per job). | **Maintain as immediate baseline floor while building direct relationships.** |
| **2. Pay-Per-Accepted-Lead (Direct)** | Direct Houston plumber pays $50–$90 per exclusive, verified inquiry. | • High margins.<br>• 100% transparency on attribution.<br>• Direct owner relationship. | • Requires manual dispute management.<br>• Requires lead intake and SMS/email notification system. | **HIGHEST RECOMMENDATION: Build direct 2–3 partner network in Harris County.** |
| **3. Revenue Share (% of Completed Job)** | Plumber pays 10–15% of invoice total on completed jobs ($150–$1,500/job). | • Enormous upside on repipes, sewer replacements, and slab leaks ($5k–$15k jobs). | • Difficult attribution audit without full CRM integration.<br>• Slow payment cycles (30–60 days). | **Secondary phase for high-ticket services once trust is established.** |

---

## 3. WHAT IS PREVENTING DIRECT REVENUE TODAY?

1. **No Direct Signed Provider Agreements:** PipeResque has not yet executed bilateral referral contracts with licensed Houston plumbing companies.
2. **Lack of Automated Lead Forwarding System:** When a homeowner reaches the site outside calling hours or prefers text/web, there is no automated mechanism to dispatch their inquiry to a local plumber and record consent.
3. **Absence of Call Recording & Audit Visibility:** Without call whisper announcements (e.g., *"PipeResque referral for [Service]"*), local plumbers receiving calls do not attribute the lead to PipeResque.

---

## 4. SAME-DAY REVENUE EXECUTION ROADMAP

To transition from pure affiliate reliance to a direct, profitable lead network:

1. **Step 1 (Immediate):** Verify `(877) 364-0861` connectivity and ensure the LeadSmart affiliate tracking route is active and logging conversions in GA4.
2. **Step 2 (Days 1–3):** Deploy the Houston Provider Acquisition Kit (see `docs/revenue-operations/houston-provider-acquisition-kit.md`) to contact 10 mid-sized independent plumbing contractors in Houston (focusing on Katy, Spring, Sugar Land, and Central Houston).
3. **Step 3 (Days 3–5):** Secure agreement from at least 1 provider using the legal draft in `docs/revenue-operations/provider-referral-agreement.md` for a $55 flat fee per qualified residential inquiry.
4. **Step 4 (Days 5–7):** Implement the lightweight lead intake form with explicit customer consent to route written requests directly to the partner plumber via secure SMS/email.
