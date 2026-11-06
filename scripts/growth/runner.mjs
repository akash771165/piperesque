/**
 * PipeResque Autonomous AI Growth Engine - Master Coordinator
 * 
 * Runs all 11 phases of the autonomous growth loop:
 * 1. Data Collection (GSC & GA4)
 * 2. Search Performance Analysis
 * 3. Market Research & Regulatory Checks
 * 4. Duplicate Detection & Registry Indexing
 * 5. Conditional Blog Creation (Max 1 article, Quality >= 85)
 * 6. Existing Page Self-Optimization
 * 7. Verification & Safety Gate (Vitest / Allowlist)
 * 8. Rollback Recovery (if needed)
 * 9. Self-Learning Memory Feedback Update
 * 10. Revenue & Conversion Operations
 * 11. 15-Section Daily Intelligence Report Generation
 */

import "dotenv/config";
import { GSCClient } from "./gsc-client.mjs";
import { GA4Client } from "./ga-client.mjs";
import { MarketResearchEngine } from "./market-research.mjs";
import { ContentRegistry } from "./content-registry.mjs";
import { DailyBlogEngine } from "./daily-blog-engine.mjs";
import { PageOptimizer } from "./page-optimizer.mjs";
import { AutonomousPublisher } from "./publisher.mjs";
import { LearningMemory } from "./learning-memory.mjs";
import { RevenueTracker } from "./revenue-tracker.mjs";
import { DailyReportGenerator } from "./daily-report.mjs";
import { RollbackManager } from "./rollback.mjs";

async function runAutonomousGrowthCycle() {
  const isDryRun = process.argv.includes("--dry-run");
  const today = new Date().toISOString().split("T")[0];

  console.log("=======================================================");
  console.log(`  PIPERESQUE AUTONOMOUS AI GROWTH ENGINE - RUNNER`);
  console.log(`  Date: ${today} | Dry Run: ${isDryRun ? "YES" : "NO"}`);
  console.log("=======================================================\n");

  const rollback = new RollbackManager();
  const publisher = new AutonomousPublisher();
  const memory = new LearningMemory();
  const revenueTracker = new RevenueTracker();
  const reportGen = new DailyReportGenerator();

  try {
    // PHASE 1 & 2: Search Console & Analytics Intelligence
    console.log("[Phase 1/11] Ingesting Search Console Performance Data...");
    const gscClient = new GSCClient();
    const gscData = await gscClient.getPerformanceData();
    const gscAnalysis = gscClient.analyzeOpportunities(gscData);
    console.log(`  -> Analyzed ${gscAnalysis.totalQueriesAnalyzed} queries (${gscAnalysis.lowCtrOpportunities.length} low-CTR, ${gscAnalysis.strikingDistance.length} striking distance).`);

    console.log("[Phase 2/11] Ingesting GA4 Traffic & Conversion Metrics...");
    const gaClient = new GA4Client();
    const gaData = await gaClient.getTrafficAndConversions();
    console.log(`  -> Total Sessions: ${gaData.metrics.uniqueSessions} | Phone Clicks: ${gaData.eventSummary.click_to_call} | Form Submissions: ${gaData.eventSummary.contact_form_submit}`);

    // PHASE 3: Houston Market Research
    console.log("[Phase 3/11] Conducting Houston Market Research & Seasonal Trigger Audit...");
    const researchEngine = new MarketResearchEngine();
    const marketResearch = await researchEngine.conductDailyResearch({ gscQueries: gscData.rows || [] });
    console.log(`  -> Evaluated ${marketResearch.findings.length} research opportunities grounded in Houston municipal codes.`);

    // PHASE 4: Content Registry & Duplicate Check
    console.log("[Phase 4/11] Indexing Permanent Content Registry & Semantic Vectors...");
    const registry = new ContentRegistry();
    console.log(`  -> Active indexed items: ${registry.entries.length} pages.`);

    // PHASE 5: Conditional Daily Blog Engine (Max 1 article)
    const autoPublish = process.env.GROWTH_AUTO_PUBLISH !== "false" && !isDryRun;
    console.log(`[Phase 5/11] Evaluating Candidate Opportunities (Auto-Publish: ${autoPublish ? "ENABLED" : "DISABLED"})...`);
    const blogEngine = new DailyBlogEngine();
    let blogOutcome;

    if (!autoPublish) {
      console.log("  -> [AUTO-PUBLISH OFF / DRY RUN] Skipping actual blog file creation.");
      blogOutcome = { attempted: true, published: false, skipped: true, rejectionReason: "Auto-publish disabled or dry run mode active." };
    } else {
      blogOutcome = await blogEngine.processDailyCandidate(marketResearch.findings);
      if (blogOutcome.published) {
        console.log(`  -> Published: ${blogOutcome.slug} (Quality Score: ${blogOutcome.qualityScore}/100)`);
      } else {
        console.log(`  -> Skipped: ${blogOutcome.rejectionReason}`);
      }
    }

    // PHASE 6: Existing Page Optimization
    console.log("[Phase 6/11] Auditing Existing Pages for Title/Meta/Internal Link Improvements...");
    const pageOptimizer = new PageOptimizer();
    let pageOptimizations = { evaluatedCount: 0, improvedPages: [], summary: "Skipped in dry-run or auto-publish disabled" };
    if (autoPublish) {
      pageOptimizations = await pageOptimizer.optimizeExistingPages(gscAnalysis);
      console.log(`  -> ${pageOptimizations.summary}`);
    }

    // PHASE 7: Safety & Test Verification Gate
    console.log("[Phase 7/11] Executing Verification Tests & Quality Gate...");
    let testResults = { passed: true };
    if (!isDryRun) {
      testResults = publisher.runVerificationTests();
      if (!testResults.passed) {
        console.error("  -> CRITICAL: Test suite failed after autonomous modifications. Initiating rollback...");
        if (blogOutcome.published && blogOutcome.articlePath) {
          rollback.rollbackCreatedFile(blogOutcome.articlePath);
        }
        rollback.logExecution({
          date: today,
          status: "FAILED_ROLLED_BACK",
          error: testResults.error
        });
        throw new Error(`Publishing aborted: Test verification failed: ${testResults.error}`);
      }
    }

    // PHASE 8 & 9: Learning Memory & Revenue Telemetry Update
    console.log("[Phase 8/11] Updating Self-Learning Memory & Feedback Weights...");
    const revenueMetrics = revenueTracker.getMetrics();
    memory.recordCycle({
      date: today,
      gscData: gscAnalysis,
      gaData,
      blogOutcome,
      pageOptimizations,
      revenueData: revenueMetrics
    });
    console.log("  -> Strategic weights updated based on rolling performance.");

    // PHASE 10: Revenue Operations Audit
    console.log("[Phase 9/11] Auditing Verified Referral Revenue & Funnel Retention...");
    console.log(`  -> Verified Revenue: ${revenueMetrics.verifiedRevenue} | Qualified Leads: ${revenueMetrics.qualifiedLeads} | Phone-to-Lead Rate: ${revenueMetrics.funnel.phoneClickToQualifiedLeadRate}`);

    // PHASE 11: 15-Section Daily Intelligence Report Generation
    console.log("[Phase 10/11] Compiling 15-Section Daily Intelligence Report...");
    const nextPriorities = [
      "Target AC condensate & attic drain clogs ahead of summer humidity surge",
      "Optimize striking-distance keywords (positions 5-30) for slab leaks and Katy drain cleaning",
      "Onboard 2 additional TSBPE-verified West Houston Master Plumbers"
    ];

    const report = reportGen.generate({
      date: today,
      gscData,
      gscAnalysis,
      gaData,
      marketResearch,
      blogOutcome,
      pageOptimizations,
      testResults,
      deploymentStatus: { published: !isDryRun && blogOutcome.published },
      revenueData: revenueMetrics,
      nextPriorities
    });
    console.log(`  -> Intelligence report written to: ${report.mdFile}`);

    rollback.logExecution({
      date: today,
      status: "SUCCESS",
      publishedArticle: blogOutcome.published ? blogOutcome.slug : null,
      testsPassed: testResults.passed
    });

    console.log("\n=======================================================");
    console.log("  PIPERESQUE AUTONOMOUS GROWTH ENGINE CYCLE COMPLETE");
    console.log("=======================================================\n");

    return { success: true, report: report.mdFile };
  } catch (error) {
    console.error("[Autonomous Growth Engine] Unhandled Error during cycle:", error);
    rollback.logExecution({
      date: today,
      status: "FATAL_ERROR",
      error: error.message
    });
    process.exit(1);
  }
}

runAutonomousGrowthCycle();
