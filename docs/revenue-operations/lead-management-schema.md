# PIPERESQUE — LEAD DATA & REVENUE ATTRIBUTION SCHEMA

This document specifies the lightweight, privacy-compliant lead intake and attribution schema designed to record customer inquiries, verification timestamps, and partner referral payouts without leaking personal customer data to third-party analytics.

---

## 1. LEAD ENTITY SPECIFICATION

```json
{
  "leadId": "PR-77449-8421",
  "createdAt": "2026-11-06T10:30:00Z",
  "source": {
    "type": "web_referral_form",
    "pagePath": "/contact",
    "referrer": "https://www.google.com/",
    "utmCampaign": "houston_sewer_search"
  },
  "customer": {
    "fullName": "Sarah Johnson",
    "phone": "+17135550199",
    "zipCode": "77449",
    "city": "Katy",
    "serviceRequested": "Sewer Line Repair",
    "urgency": "medium",
    "details": "Bathtub and toilet backing up when running washing machine."
  },
  "compliance": {
    "consentCheckboxRecorded": true,
    "consentText": "Customer Referral Consent: I authorize PipeResque to share my service inquiry with independent licensed local plumbing contractors servicing Greater Houston...",
    "ipAddressHash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "userConsentTimestamp": "2026-11-06T10:30:00Z"
  },
  "referralDispatch": {
    "assignedProviderId": "PRV-HOU-003",
    "providerName": "Katy Plumbing & Drain Pros",
    "dispatchedAt": "2026-11-06T10:32:15Z",
    "dispatchMethod": "sms_webhook",
    "providerAccepted": true,
    "providerResponseTimeSeconds": 135
  },
  "monetization": {
    "model": "flat_fee_per_lead",
    "agreedLeadFee": 55.00,
    "billingStatus": "invoiced",
    "invoiceId": "INV-2026-11-01",
    "paymentStatus": "pending_net15",
    "paidAt": null
  }
}
```

---

## 2. PRIVACY & ANALYTICS BOUNDARY RULES

To adhere to the Texas Data Privacy and Security Act (TDPSA) and Google Analytics 4 Terms of Service:

1. **Strict Zero-PII Policy:** Never pass `customer.fullName`, `customer.phone`, or street addresses into `window.gtag()`, `dataLayer.push()`, or `window.clarity()`.
2. **Hashed Identification:** Only non-reversible IDs (such as `leadId: "PR-77449-8421"`) and generalized parameters (such as `service_category: "Sewer Line Repair"`, `zip: "77449"`) are permitted in analytics event payloads.
3. **Data Retention & Encryption:** Customer lead records stored in the production database must be encrypted at rest (AES-256) and purged after 90 days following final billing reconciliation.
