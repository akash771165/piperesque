import { describe, it, expect } from "vitest";
import { AutonomousPublisher } from "../../../scripts/growth/publisher.mjs";

describe("AutonomousPublisher Strict Allowlist & Security Boundaries", () => {
  const publisher = new AutonomousPublisher();

  it("permits valid content, growth database, and daily report files", () => {
    expect(publisher.isFilePermitted("content/blogs/ac-condensate-drain-clog-houston-tx.json").permitted).toBe(true);
    expect(publisher.isFilePermitted("content/growth/content-registry.json").permitted).toBe(true);
    expect(publisher.isFilePermitted("content/growth/performance-store.json").permitted).toBe(true);
    expect(publisher.isFilePermitted("content/seo/page-opportunity-manifest.json").permitted).toBe(true);
    expect(publisher.isFilePermitted("reports/daily/2026-11-06.md").permitted).toBe(true);
    expect(publisher.isFilePermitted("reports/daily/latest.json").permitted).toBe(true);
    expect(publisher.isFilePermitted("public/sitemap.xml").permitted).toBe(true);
  });

  it("strictly forbids modification of sensitive infrastructure and code files", () => {
    expect(publisher.isFilePermitted(".env").permitted).toBe(false);
    expect(publisher.isFilePermitted(".env.local").permitted).toBe(false);
    expect(publisher.isFilePermitted(".github/workflows/growth-engine.yml").permitted).toBe(false);
    expect(publisher.isFilePermitted("package.json").permitted).toBe(false);
    expect(publisher.isFilePermitted("package-lock.json").permitted).toBe(false);
    expect(publisher.isFilePermitted("tsconfig.json").permitted).toBe(false);
    expect(publisher.isFilePermitted("next.config.ts").permitted).toBe(false);
    expect(publisher.isFilePermitted("app/terms/page.tsx").permitted).toBe(false);
    expect(publisher.isFilePermitted("app/privacy-policy/page.tsx").permitted).toBe(false);
    expect(publisher.isFilePermitted("lib/analytics/track.ts").permitted).toBe(false);
  });

  it("validates batch of modified files and flags unauthorized changes", () => {
    const checkSafe = publisher.validateModifiedFiles([
      "content/blogs/test-article.json",
      "reports/daily/2026-11-06.md"
    ]);
    expect(checkSafe.safe).toBe(true);
    expect(checkSafe.violations.length).toBe(0);

    const checkUnsafe = publisher.validateModifiedFiles([
      "content/blogs/test-article.json",
      ".github/workflows/deploy.yml"
    ]);
    expect(checkUnsafe.safe).toBe(false);
    expect(checkUnsafe.violations.length).toBe(1);
    expect(checkUnsafe.violations[0].file).toBe(".github/workflows/deploy.yml");
  });
});
