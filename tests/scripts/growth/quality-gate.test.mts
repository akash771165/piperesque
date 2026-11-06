import { describe, it, expect } from "vitest";
import { QualityGate } from "../../../scripts/growth/quality-gate.mjs";

describe("QualityGate Automated Scoring & Zero-Tolerance Compliance", () => {
  const gate = new QualityGate({ minScore: 85 });

  it("instantly rejects articles with employee/in-house claims", () => {
    const invalidArticle = {
      title: "Drain Cleaning Services in Houston",
      seo: { title: "Drain Cleaning Houston | PipeResque", description: "Call our plumbers for fast drain cleaning in Houston TX today." },
      introduction: ["Our team of licensed plumbers can fix any drain in Houston."],
      sections: [{ title: "Section 1", content: ["Our master plumber arrives with our trucks."] }],
      callToAction: { phone: "(877) 364-0861", url: "tel:+18773640861" }
    };

    const evaluation = gate.evaluate(invalidArticle);
    expect(evaluation.passed).toBe(false);
    expect(evaluation.score).toBe(0);
    expect(evaluation.decision).toBe("REJECT");
    expect(evaluation.violations.some(v => v.includes("VIOLATION_EMPLOYEE_CLAIM"))).toBe(true);
  });

  it("instantly rejects articles with fake license or review claims", () => {
    const invalidArticle = {
      title: "Water Heater Repair Houston",
      seo: { title: "Water Heater Repair Houston", description: "Check our verified review from John: 5 stars on google!" },
      introduction: ["We hold licensed master plumber #12345 in Texas."],
      sections: [{ title: "Section 1", content: ["Reliable service."] }],
      callToAction: { phone: "(877) 364-0861", url: "tel:+18773640861" }
    };

    const evaluation = gate.evaluate(invalidArticle);
    expect(evaluation.passed).toBe(false);
    expect(evaluation.score).toBe(0);
    expect(evaluation.violations.length).toBeGreaterThanOrEqual(1);
  });

  it("approves well-structured, factually compliant technical articles", () => {
    // Construct mock article with sufficient depth and valid meta lengths
    const longContent = "In Greater Houston, high relative humidity during summer causes residential AC systems to generate 5 to 20 gallons of condensate daily. ".repeat(8);
    const validArticle = {
      title: "AC Condensate Drain Line Clogs in Houston TX: Safety & Repair",
      description: "Dealing with a clogged AC drain line in Houston? Understand humidity condensate volume, auxiliary attic pan float switches, and professional clearing.",
      author: "PipeResque Editorial & Research Team",
      category: "Drain Cleaning",
      keywords: ["ac drain line clog houston", "ac condensate drain cleaning houston"],
      seo: {
        title: "AC Drain Line Clogs Houston TX | PipeResque",
        description: "Water dripping from your attic AC? Learn how high humidity causes AC condensate drain clogs in Houston homes and when to connect with licensed plumbers.",
        canonical: "https://www.piperesque.com/blog/ac-condensate-drain-clog-houston-tx",
        focusKeyword: "ac drain line clog houston"
      },
      introduction: [
        longContent,
        "When dark warm attic environments cause zoogleal algae to colonize the PVC line, clogs occur.",
        "Connecting with independent licensed plumbing contractors ensures safe clearing in Harris County, Katy, and Sugar Land."
      ],
      sections: [
        { id: "s1", title: "Why Houston Drain Lines Clog", content: [longContent], bullets: ["Volume 5-20 gal.", "Shallow slope in Houston attics."] },
        { id: "s2", title: "Houston Municipal Mechanical Codes", content: ["City of Houston code requires float switches or secondary drain pans in attics.", longContent], bullets: ["2021 Uniform Mechanical Code."] },
        { id: "s3", title: "Safe Clearing Methods", content: ["Nitrogen blowouts and shop vacuum extraction safely dislodge clogs.", longContent] },
        { id: "s4", title: "Questions to Ask Independent Providers", content: ["Ask if they test primary and auxiliary lines and verify float switch function.", longContent] }
      ],
      faqs: [
        { question: "Where does the condensate line drain in Houston?", answer: "Usually into bathroom sink tailpieces or exterior walls in Houston homes." },
        { question: "Why is water dripping above my window?", answer: "It indicates the primary line is clogged and emergency pan is receiving water." },
        { question: "Does PipeResque do the repair work?", answer: "No, PipeResque connects callers to independent third-party plumbers." }
      ],
      callToAction: {
        title: "Facing an Attic AC Drain Line Backup in Houston?",
        description: "Connect with independent licensed Houston plumbing professionals through PipeResque.",
        button: "Call (877) 364-0861",
        phone: "(877) 364-0861",
        url: "tel:+18773640861"
      }
    };

    const evaluation = gate.evaluate(validArticle);
    expect(evaluation.passed).toBe(true);
    expect(evaluation.score).toBeGreaterThanOrEqual(85);
    expect(evaluation.decision).toBe("APPROVE");
    expect(evaluation.violations.length).toBe(0);
  });
});
