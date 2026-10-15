# n8n Lead Capture Setup

This setup routes the website's inbound contact form to an n8n webhook. The website will not report a successful delivery until n8n responds with a successful HTTP status.

## 1. Create an n8n workflow

1. Add a **Webhook** trigger.
2. Use **POST** and a path such as `piperesque-lead-intake`.
3. Configure the webhook to require a header named `X-Webhook-Secret` with a long random secret. If your n8n webhook version does not support header authentication directly, put an IF node immediately after the Webhook and compare the request header before allowing any data to continue. Respond with 401/403 for a mismatch; never log the secret.
4. After authentication, validate that name, phone, email, service, and `consent: true` are present.
5. Add the lead to a private CRM or spreadsheet with deduplication. Notify the designated lead recipient promptly (email/Slack/Telegram, whichever is configured).
6. Add an error path and log only non-sensitive execution metadata. Avoid copying phone/email into error logs unnecessarily.
7. Return HTTP 200 only after the lead has been durably saved or safely queued.

## 2. Set Vercel environment variables

In Vercel → Project `piperesque` → Settings → Environment Variables, set these for **Production** and Preview only where needed:

- `N8N_LEAD_WEBHOOK_URL`: the HTTPS production URL from the n8n Webhook node.
- `N8N_LEAD_WEBHOOK_SECRET`: a new, randomly generated secret, configured identically in n8n's header-auth check.

Keep both values server-side only. Do not prefix them with `NEXT_PUBLIC_`, commit them to Git, or paste them into chat. After adding them, redeploy the project.

## 3. Test safely

- First test the n8n workflow with synthetic data and confirm authentication rejects a bad secret.
- Test the website form using a clearly labelled internal test submission. Do not create fake affiliate calls or misrepresent a test as a real customer.
- Confirm the lead is saved once, notifications are received, retries do not duplicate records, and errors are visible to the operator.
- Use a real customer enquiry only after the test passes.

## Current limitations

- Production routing stays unavailable until both environment variables are configured and the n8n workflow is active.
- The form includes server validation and a honeypot, but a production rate limiter (Vercel Firewall or a shared-store limiter) should be configured before aggressive traffic campaigns.
- This workflow is for inbound enquiries only. Do not use the captured data for unsolicited SMS, outbound calls, or email campaigns.
- The website connects homeowners with independent plumbing service providers and does not itself perform plumbing work; preserve that disclosure.
