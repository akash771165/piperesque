# PipeRescue automation rollout

## Current baseline

The Next.js repository already contains custom automation commands for AI-assisted blog generation/publishing, keyword planning, SEO audits, metadata/schema generation, quality checks, internal-link updates, and sitemap updates. These commands should be reviewed and tested individually before they are scheduled. In particular, do not schedule `ai:publish` or `ai:full` unattended: the publisher can overwrite existing content, and `ai:full` includes a production deployment command.

## Phase 1 — production health monitoring

A GitHub Actions workflow checks the homepage, key service pages, the Houston sewer-line-repair landing page, contact page, sitemap, and robots.txt every six hours. It can also send a JSON failure report to an n8n webhook.

Configure the following in GitHub repository settings:

- Optional repository variable `SITE_URL` (defaults to `https://www.piperesque.com`).
- Optional repository secret `N8N_ALERT_WEBHOOK_URL`: the production URL of an n8n Webhook node. Protect the workflow with Header Auth or another supported authentication method; do not use an unauthenticated public webhook.

Use **Actions → PipeRescue Site Health → Run workflow** to test manually. A failed URL causes the job to fail and appears in the logs. A webhook alert is attempted only when the secret is configured.

## Phase 2 — n8n workflows (after n8n workspace access is verified)

1. **Lead intake:** validate and normalize form submissions, notify the owner, record status, and prevent duplicate notifications.
2. **SEO reporting:** schedule a weekly Google Search Console report (clicks, impressions, CTR, position, top queries/pages) and send prioritized opportunities.
3. **Content pipeline:** research topic → draft → quality/policy checks → human approval → pull request. Publishing should remain approval-gated.
4. **Incident routing:** receive health-check alerts, deduplicate repeated failures, and send one notification with affected URLs and timestamps.

## Safety and publishing rules

- Never place API keys, service-account JSON, email credentials, or webhook URLs in source code or commit history.
- Do not use Google's Indexing API for ordinary service or blog pages. Google documents it for pages containing JobPosting or livestream BroadcastEvent markup; submit the sitemap and use Search Console URL Inspection instead.
- AI drafts must be checked for factual accuracy, local relevance, originality, and the site's disclosure that it connects visitors with independent third-party providers.
- No automatic bulk city/service-page generation or production deployment until the content and technical checks pass and an explicit approval step exists.

## Phase 3 — integrations to verify

Before enabling the remaining flows, verify n8n workspace/project access and credentials, Google Search Console API access, the lead notification destination, and the repository's existing contact-form implementation. The connected n8n workspace could not be queried during the initial setup attempt, so no existing workflows or credentials are assumed.
