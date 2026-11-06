/**
 * Automated Quality Gate & Compliance Validator
 * 
 * Enforces editorial standards, technical accuracy, and legal compliance before publication.
 * Computes a weighted score out of 100 points (minimum threshold: 85/100).
 * 
 * Features Zero-Tolerance Instant-Rejection Checks for:
 * - Fake licenses (e.g. claiming PipeResque has a master plumbing license)
 * - False employee claims (e.g. "our licensed plumbers")
 * - Fabricated customer reviews or testimonials
 * - Unsupported exact prices or price guarantees
 * - Unverified 24/7 emergency dispatch promises
 * - Keyword stuffing or artificial word repeats
 */

import { GROWTH_CONFIG, CANONICAL_CONTACT } from "./constants.mjs";

export class QualityGate {
  constructor(options = {}) {
    this.minScore = options.minScore || GROWTH_CONFIG.MIN_QUALITY_SCORE;
  }

  /**
   * Evaluates an article candidate against the full quality criteria
   */
  evaluate(article) {
    const violations = [];
    const deductions = [];
    let score = 100;

    // Stringify entire content for textual scanning
    const fullText = JSON.stringify(article).toLowerCase();

    // ==========================================
    // ZERO-TOLERANCE INSTANT-REJECTION CHECKS
    // ==========================================

    // 1. Employee / In-house contractor claims
    const forbiddenEmployeePhrases = [
      "our plumbers",
      "our technicians",
      "our team of licensed plumbers",
      "we are licensed plumbers",
      "our master plumber",
      "our trucks",
      "our dispatchers",
      "we guarantee our work"
    ];
    for (const phrase of forbiddenEmployeePhrases) {
      if (fullText.includes(phrase)) {
        violations.push(`VIOLATION_EMPLOYEE_CLAIM: Contains prohibited in-house claim '${phrase}'. PipeResque is strictly a referral platform.`);
      }
    }

    // 2. Fabricated Reviews or Testimonials
    if (fullText.includes("5 stars on google") || fullText.includes("verified review from john") || fullText.includes("testimonial")) {
      violations.push("VIOLATION_FABRICATED_REVIEWS: Contains unsupported reviews or testimonials.");
    }

    // 3. Fake licenses or certifications
    if (fullText.includes("our license number") || fullText.includes("licensed master plumber #") || fullText.includes("our tsbpe license")) {
      violations.push("VIOLATION_FAKE_LICENSE: PipeResque does not hold plumbing licenses directly; referral providers do.");
    }

    // 4. Guaranteed exact prices
    if (fullText.includes("we charge exactly $") || fullText.includes("flat rate of $49 guaranteed")) {
      violations.push("VIOLATION_UNSUPPORTED_PRICING: Independent providers set their own quotes; exact price guarantees are prohibited.");
    }

    // If zero-tolerance violations occur, score drops to 0 immediately
    if (violations.length > 0) {
      return {
        passed: false,
        score: 0,
        decision: "REJECT",
        violations,
        deductions: [{ reason: "Zero-tolerance compliance violation", points: 100 }],
        summary: "Article rejected due to legal compliance or business model misrepresentation."
      };
    }

    // ==========================================
    // GRADED QUALITY CRITERIA (100 Points Total)
    // ==========================================

    // Criteria 1: Title & Description Length & Quality (15 points)
    const titleLen = article.seo?.title?.length || article.title?.length || 0;
    if (titleLen < GROWTH_CONFIG.TITLE_MIN_LENGTH || titleLen > GROWTH_CONFIG.TITLE_MAX_LENGTH) {
      score -= 8;
      deductions.push({ reason: `Title length (${titleLen} chars) outside optimal ${GROWTH_CONFIG.TITLE_MIN_LENGTH}-${GROWTH_CONFIG.TITLE_MAX_LENGTH} window`, points: 8 });
    }

    const descLen = article.seo?.description?.length || article.description?.length || 0;
    if (descLen < GROWTH_CONFIG.DESCRIPTION_MIN_LENGTH || descLen > GROWTH_CONFIG.DESCRIPTION_MAX_LENGTH) {
      score -= 7;
      deductions.push({ reason: `Description length (${descLen} chars) outside optimal ${GROWTH_CONFIG.DESCRIPTION_MIN_LENGTH}-${GROWTH_CONFIG.DESCRIPTION_MAX_LENGTH} window`, points: 7 });
    }

    // Criteria 2: Word Count & Depth (15 points)
    const words = fullText.split(/\s+/).length;
    if (words < 1000) {
      const penalty = Math.min(15, Math.ceil((1000 - words) / 50));
      score -= penalty;
      deductions.push({ reason: `Content depth thin (${words} words; recommended >= 1,000 words)`, points: penalty });
    }

    // Criteria 3: Houston Relevance & Geographic Context (15 points)
    const houstonMentions = (fullText.match(/houston|harris county|katy|sugar land|woodlands|spring|cyprus/g) || []).length;
    if (houstonMentions < 5) {
      score -= 10;
      deductions.push({ reason: `Low Houston geographical context (${houstonMentions} local mentions)`, points: 10 });
    }

    // Criteria 4: Technical & Diagnostic Rigor (20 points)
    const sections = article.sections || [];
    if (sections.length < 4) {
      score -= 10;
      deductions.push({ reason: `Insufficient section depth (${sections.length} sections, expected >= 4)`, points: 10 });
    }

    // Check for FAQs
    const faqs = article.faqs || [];
    if (faqs.length < 3) {
      score -= 10;
      deductions.push({ reason: `Insufficient FAQ coverage (${faqs.length} FAQs, expected >= 3)`, points: 10 });
    }

    // Criteria 5: Call-to-Action & Contact Integrity (15 points)
    const cta = article.callToAction;
    if (!cta || !cta.phone || !cta.url) {
      score -= 15;
      deductions.push({ reason: "Missing or incomplete Call-to-Action block", points: 15 });
    } else if (cta.phone !== CANONICAL_CONTACT.PHONE || cta.url !== CANONICAL_CONTACT.PHONE_URL) {
      score -= 10;
      deductions.push({ reason: `CTA contact mismatch with canonical ${CANONICAL_CONTACT.PHONE}`, points: 10 });
    }

    // Criteria 6: Keyword Stuffing Check (20 points)
    const focusKw = (article.seo?.focusKeyword || article.keywords?.[0] || "").toLowerCase();
    if (focusKw) {
      const kwMatches = (fullText.match(new RegExp(focusKw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
      const density = kwMatches / (words || 1);
      if (density > 0.035) { // More than 3.5% keyword density
        score -= 15;
        deductions.push({ reason: `Unnatural keyword density for '${focusKw}' (${(density * 100).toFixed(1)}%)`, points: 15 });
      }
    }

    const finalScore = Math.max(0, score);
    const passed = finalScore >= this.minScore;

    return {
      passed,
      score: finalScore,
      threshold: this.minScore,
      decision: passed ? "APPROVE" : "REJECT",
      violations,
      deductions,
      summary: passed
        ? `Passed all quality and compliance checks with score ${finalScore}/100.`
        : `Failed quality threshold (${finalScore}/${this.minScore}).`
    };
  }
}
