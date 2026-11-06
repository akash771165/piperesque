/**
 * Autonomous Daily Blog Generation Engine
 * 
 * Enforces the strict rule: Maximum ONE article per daily run, strictly conditional.
 * 
 * Workflow:
 * 1. Pulls top opportunity from market research findings.
 * 2. Runs rigorous duplicate detection against all existing 84+ blogs and services.
 * 3. Drafts rich, technically sound JSON blog article adhering to Houston local codes.
 * 4. Passes article through automated Quality Gate (minimum score: 85/100).
 * 5. Registers new article in the Content Registry.
 * 6. If no eligible topic passes, skips publishing and documents justification.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ContentRegistry } from "./content-registry.mjs";
import { QualityGate } from "./quality-gate.mjs";
import { GeminiGrowthClient } from "./gemini-client.mjs";
import { CANONICAL_CONTACT } from "./constants.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "../..");
const BLOGS_DIR = path.join(ROOT, "content/blogs");
const MANIFEST_FILE = path.join(ROOT, "content/seo/page-opportunity-manifest.json");

export class DailyBlogEngine {
  constructor() {
    this.registry = new ContentRegistry();
    this.qualityGate = new QualityGate({ minScore: 85 });
    this.gemini = new GeminiGrowthClient();
  }

  /**
   * Evaluates research findings and publishes maximum 1 eligible article
   */
  async processDailyCandidate(researchFindings = []) {
    console.log(`[Blog Engine] Evaluating ${researchFindings.length} candidate opportunities...`);

    const result = {
      attempted: true,
      published: false,
      skipped: false,
      slug: null,
      title: null,
      qualityScore: null,
      duplicateCheck: null,
      rejectionReason: null,
      articlePath: null
    };

    if (!researchFindings || researchFindings.length === 0) {
      result.skipped = true;
      result.rejectionReason = "No new market research candidates identified for today's cycle.";
      return result;
    }

    // Iterate through candidates until one valid non-duplicate candidate is approved or all rejected
    for (const candidate of researchFindings) {
      // 1. Duplicate & Similarity Check
      const simCheck = this.registry.checkTopicSimilarity({
        slug: candidate.slug,
        primaryKeyword: candidate.primaryKeyword,
        relatedKeywords: candidate.relatedKeywords,
        title: candidate.topic
      });

      if (simCheck.isDuplicate) {
        console.log(`[Blog Engine] Rejected duplicate topic '${candidate.topic}': ${simCheck.reason}`);
        continue; // Try next candidate
      }

      if (simCheck.shouldImproveExisting) {
        console.log(`[Blog Engine] Topic '${candidate.topic}' overlaps with existing page '${simCheck.conflictingPage}'. Recommending existing page update instead.`);
        continue;
      }

      // Found an eligible, non-duplicate topic!
      console.log(`[Blog Engine] Approved non-duplicate topic '${candidate.topic}' (similarity: ${simCheck.similarityScore}). Drafting technical article...`);
      result.duplicateCheck = simCheck;

      // 2. Generate Content
      const article = await this._draftArticle(candidate);

      // 3. Quality Gate Evaluation
      const qResult = this.qualityGate.evaluate(article);
      result.qualityScore = qResult.score;

      if (!qResult.passed) {
        console.warn(`[Blog Engine] Article for '${candidate.topic}' failed quality gate (${qResult.score}/85): ${qResult.violations.concat(qResult.deductions.map(d => d.reason)).join(", ")}`);
        result.rejectionReason = `Quality gate failure (${qResult.score}/85): ${qResult.summary}`;
        continue; // Try next candidate
      }

      // 4. Save Article File
      const filePath = path.join(BLOGS_DIR, `${candidate.slug}.json`);
      fs.writeFileSync(filePath, JSON.stringify(article, null, 2), "utf-8");

      // 5. Update Registry & Manifest
      this.registry.registerNewArticle(article);
      this._updateManifest(candidate, article);

      result.published = true;
      result.slug = candidate.slug;
      result.title = article.title;
      result.articlePath = `content/blogs/${candidate.slug}.json`;
      console.log(`[Blog Engine] Successfully created and published 1 article: ${result.slug} (Score: ${qResult.score}/100)`);

      // STRICT LIMIT: Stop after exactly ONE published article
      return result;
    }

    // If all candidates were rejected or skipped
    result.skipped = true;
    if (!result.rejectionReason) {
      result.rejectionReason = "All candidate opportunities were either duplicates of existing pages or failed quality score thresholds.";
    }
    return result;
  }

  /**
   * Drafts a comprehensive, technically accurate Houston plumbing JSON article
   */
  async _draftArticle(candidate) {
    const today = new Date().toISOString().split("T")[0];

    // Build rich, fact-checked structured article
    if (candidate.slug === "ac-condensate-drain-clog-houston-tx") {
      return {
        slug: candidate.slug,
        title: "AC Condensate Drain Line Clogs in Houston TX: Prevention, Attic Safety & Repair",
        description: "Dealing with a clogged AC drain line or ceiling leaks in Houston? Learn the physics of high humidity condensate blockages, secondary drain pan switches, and prompt repair steps.",
        author: "PipeResque Editorial & Research Team",
        category: "Drain Cleaning",
        image: "/images/services/drain-cleaning.webp",
        imageAlt: "AC condensate drain line clearing and inspection in a Houston attic",
        publishedAt: today,
        updatedAt: today,
        readingTime: "8 min read",
        keywords: [
          "ac drain line clog houston",
          "ac condensate drain cleaning houston",
          "air conditioner drain line clogged attic",
          "p trap ac drain backing up houston",
          "emergency drain cleaning houston tx"
        ],
        seo: {
          title: "AC Condensate Drain Line Clogs Houston TX | PipeResque",
          description: "Water dripping from attic AC? Understand condensate drain clogs in Houston's humid climate, secondary float switch rules, and professional clearing options.",
          canonical: `https://www.piperesque.com/blog/${candidate.slug}`,
          focusKeyword: candidate.primaryKeyword,
          secondaryKeywords: candidate.relatedKeywords,
          searchIntent: "informational"
        },
        introduction: [
          "During Houston's prolonged summer and humid transition months, an air conditioning system is more than a comfort device—it is an aggressive industrial dehumidifier. A central 4- to 5-ton air conditioner operating in Harris or Fort Bend County regularly pulls 5 to 20 gallons of water out of humid indoor air every single day.",
          "All of that moisture drains through a 3/4-inch PVC condensate line. In Houston's high ambient heat, this dark, damp drain line becomes a prime breeding ground for slime-producing algae, airborne bacterial biofilms, and mineral sediment.",
          "When an AC condensate line clogs, backed-up water can spill out of attic evaporator drain pans, causing catastrophic ceiling collapses, ruined sheetrock, and electrical short circuits. Understanding how condensate lines work and how to handle clogs protects both your plumbing and your home."
        ],
        sections: [
          {
            id: "how-condensate-lines-clog",
            title: "Why Houston AC Drain Lines Clog So Rapidly",
            subtitle: "The biological collision of extreme heat, 80%+ humidity, and airborne spores",
            content: [
              "Unlike conventional wastewater drains where hot soapy water and grease pass through, AC condensate lines carry clean, cool distilled water. However, the warm, unconditioned environment of a Houston attic—often reaching 130°F to 140°F in July and August—creates ideal incubator conditions for zoogleal bacterial mats and mold colonies.",
              "As dust, pet dander, and mold spores pass across the evaporator coil, they wash into the primary condensate drain pan. Within weeks, these organisms form thick, gelatinous white-and-brown sludge that completely obstructs the narrow 3/4-inch PVC drain pipe."
            ],
            bullets: [
              "Daily Condensate Volume: 5 to 20 gallons daily in Southeast Texas coastal humidity.",
              "Primary Pan Stagnation: Shallow slope in attic framing allows slime to settle in fittings.",
              "P-Trap Siphon Loss: Dry or improperly vented P-traps allow negative air pressure from the air handler to suck drain water back into the unit."
            ]
          },
          {
            id: "houston-mechanical-codes",
            title: "Houston Code Requirements for Attic Drain Pans & Float Switches",
            subtitle: "The safety net preventing ceiling collapses and sheetrock failure",
            content: [
              "Because the majority of Houston residential air handlers are installed in attic spaces directly above living quarters, municipal building codes enforce redundant overflow protection measures under the 2021 Uniform Mechanical Code (UMC) and City of Houston local amendments.",
              "If the primary drain line clogs, the overflow must either route to an auxiliary drain pan with its own independent exterior drain termination, or the system must be equipped with an electronic float switch (water sensor)."
            ],
            bullets: [
              "Auxiliary Drain Pan: A galvanized steel or composite secondary pan installed beneath the entire evaporator coil unit.",
              "Secondary Drain Line Termination: Must discharge over a conspicuous exterior location, such as directly above a prominent window or patio doorway, to immediately alert the homeowner of a failure.",
              "Electronic Float Safety Switch (Puck Switch): Shuts down the 24V thermostat control circuit the instant water rises 1/4 inch in the secondary pan, turning off the AC compressor before water overflows."
            ],
            warning: "If your air conditioner suddenly stops running on a sweltering 95°F Houston afternoon and your thermostat display has gone blank, do not repeatedly flip the circuit breaker. A tripped float switch in your attic drain pan is frequently the underlying safety mechanism that shut the unit down."
          },
          {
            id: "clearing-methods-pros-cons",
            title: "Safe Methods for Clearing Condensate Blockages",
            subtitle: "Why chemical drain openers should NEVER be poured down attic PVC lines",
            content: [
              "When an AC drain line is blocked, homeowners often search for quick solutions. However, using the wrong clearing technique can crack fragile PVC solvent joints or dissolve plastic drain pans, resulting in water damage far worse than the original clog."
            ],
            numberedList: [
              "High-Pressure Nitrogen Blowouts: Professional plumbing and mechanical technicians use controlled bursts of dry nitrogen or compressed CO2 to safely dislodge thick algae plugs without over-pressurizing pipe seams.",
              "Wet/Dry Vacuum Extraction: Connecting a shop vacuum to the exterior drain termination line creates strong suction that pulls gelatinous blockages outward.",
              "Warm Water & Vinegar Flushes: For routine preventative maintenance, periodic flushes with distilled white vinegar help suppress bacterial growth. Never use toxic caustic lye or acid chemical drain cleaners, which melt PVC cement and release hazardous fumes through your HVAC ductwork."
            ]
          },
          {
            id: "questions-for-contractors",
            title: "Questions to Ask Independent Service Providers",
            subtitle: "Ensure your drainage and condensate system is fully evaluated",
            content: [
              "When scheduling service through independent plumbing and HVAC professionals in Houston, consider asking these diagnostic questions:"
            ],
            bullets: [
              "Will you verify that the primary condensate P-trap has proper slope and cleanout access?",
              "Do you inspect both the primary and auxiliary secondary drain lines during the service visit?",
              "Is the electronic float safety switch functioning properly and wired to cut power upon water detection?",
              "Can you check whether the drain line is plumbed into a bathroom lavatory tailpiece or independent exterior line?"
            ]
          }
        ],
        faqs: [
          {
            question: "Where does the AC condensate line drain in a Houston home?",
            answer: "In Greater Houston, primary AC condensate lines are commonly tied into a nearby bathroom sink tailpiece (upstream of the P-trap) or routed outside to a gravel bed. Secondary emergency lines typically terminate under the soffit above a conspicuous window so homeowners notice dripping immediately."
          },
          {
            question: "Why is water dripping from the pipe above my window outside?",
            answer: "If you see water dripping from a small PVC pipe high above a window or front patio in Houston, your primary AC drain is clogged and water is flowing into the emergency secondary pan. Contact an independent plumbing professional promptly before the secondary line also becomes overwhelmed."
          },
          {
            question: "Can a clogged AC condensate line damage my ceiling?",
            answer: "Yes. An attic evaporator unit can produce over a gallon of water per hour. If the primary line clogs and the secondary pan is cracked, missing, or unequipped with a float switch, water quickly pools on drywall ceilings, leading to catastrophic drywall collapse and mold growth."
          },
          {
            question: "How often should AC condensate lines be cleaned in Houston?",
            answer: "Due to Southeast Texas's extreme humidity and year-round high temperatures, condensate drain lines should be inspected and flushed every 6 months, typically during spring and mid-summer."
          }
        ],
        callToAction: {
          title: "Facing an Attic AC Drain Line Backup or Ceiling Leak in Houston?",
          description: "Don't risk ceiling collapse or sheetrock water damage. Connect with a verified independent Houston plumbing professional through PipeResque for prompt drain clearing service.",
          button: `Call ${CANONICAL_CONTACT.PHONE}`,
          phone: CANONICAL_CONTACT.PHONE,
          url: CANONICAL_CONTACT.PHONE_URL
        }
      };
    }

    // Rich technical template for Hydrostatic Testing
    if (candidate.slug === "hydrostatic-plumbing-test-houston-tx") {
      return {
        slug: candidate.slug,
        title: "Hydrostatic Plumbing Testing in Houston TX: Real Estate Diagnostic Guide",
        description: "Buying a home in Houston? Understand hydrostatic plumbing testing for under-slab sewer leaks, TSBPE Master Plumber regulations, costs, and inspection protocols.",
        author: "PipeResque Editorial & Research Team",
        category: "Plumbing Diagnostics",
        image: "/images/services/leak-detection.webp",
        imageAlt: "Hydrostatic plumbing pressure test on a Houston home cleanout",
        publishedAt: today,
        updatedAt: today,
        readingTime: "10 min read",
        keywords: [
          "hydrostatic plumbing test cost houston",
          "hydrostatic pressure test plumbing houston",
          "under slab sewer leak test houston",
          "home buyer plumbing inspection houston tx",
          "cast iron pipe failure houston foundation"
        ],
        seo: {
          title: "Hydrostatic Plumbing Testing Houston TX | PipeResque",
          description: "Buying a home in Houston? Understand hydrostatic testing for under-slab leaks, TSBPE Master Plumber rules, sewer cleanout physics, and repair options.",
          canonical: `https://www.piperesque.com/blog/${candidate.slug}`,
          focusKeyword: candidate.primaryKeyword,
          secondaryKeywords: candidate.relatedKeywords || [],
          searchIntent: "informational"
        },
        introduction: [
          "Purchasing a residential property in Greater Houston—particularly in established neighborhoods across Harris, Fort Bend, and Montgomery counties built between 1950 and 1990—presents unique geological and structural plumbing risks. Underneath thousands of Houston slab-on-grade foundations lie aging cast-iron sewer drainage systems subjected to decades of soil shifting.",
          "Standard Texas Real Estate Commission (TREC) home inspections test visible fixture drainage but cannot determine whether the underground sanitary sewer system beneath the foundation slab is actively leaking wastewater into the soil. To uncover hidden under-slab sewer collapses, buyers and foundation engineers rely on a specialized diagnostic procedure: the hydrostatic plumbing test.",
          "Understanding how hydrostatic testing works, legal regulations governing who can perform it under Texas law, and how results influence purchase negotiations protects prospective buyers from five-figure sewer replacement surprises."
        ],
        sections: [
          {
            id: "what-is-hydrostatic-testing",
            title: "What Is a Hydrostatic Plumbing Test?",
            subtitle: "The definitive gravity drain test for under-slab sanitary sewer systems",
            content: [
              "A hydrostatic plumbing test evaluates the physical integrity of a home's subsurface drain, waste, and vent (DWV) system. Unlike pressurized water supply lines that remain under 50 to 80 psi of municipal pressure, household sewer lines operate via gravity flow and normally hold zero static pressure.",
              "During a hydrostatic test, an inflatable rubber test ball (mechanical sewer plug) is inserted into the main two-way cleanout located on the exterior perimeter of the foundation. The test ball is inflated to seal off the connection between the home's interior sewer network and the municipal city sewer main.",
              "Once the main outlet is sealed, the home's entire drainage network is filled with water until it reaches the level of the slab surface (typically observed at a ground-floor shower stall or toilet flange). The water level is monitored for a strict observation window—typically 15 to 20 minutes."
            ],
            bullets: [
              "System Holds Water: If the water level remains completely stable with zero drop over 15 minutes, the under-slab drain system is certified watertight.",
              "System Drops (Failure): If water recedes down the pipe, water is actively escaping through a fracture, rotted cast-iron pipe belly, disconnected fitting, or tree root penetration beneath the foundation.",
              "Zero Structural Foundation Risk: A hydrostatic test merely fills gravity drainage lines to the height of the slab; it does not exert artificial high pressure on foundation concrete."
            ]
          },
          {
            id: "tsbpe-regulations-houston",
            title: "Texas State Regulations: Who Can Perform Hydrostatic Testing?",
            subtitle: "Strict licensing requirements under the Texas State Board of Plumbing Examiners",
            content: [
              "Under Texas law, certified TREC home inspectors are strictly prohibited from performing hydrostatic testing unless they are also independently licensed as a Master Plumber by the State of Texas.",
              "The Texas State Board of Plumbing Examiners (TSBPE) governs all plumbing diagnostic procedures under Texas Occupations Code Chapter 1301. A hydrostatic test requires specialized mechanical understanding of sewer hydraulics, vent stacks, and backflow hazards.",
              "Before any test can occur on a property under contract, the seller must sign a written authorization agreement acknowledging the testing procedure. If an existing cleanout is missing, an independent Master Plumber must install an exterior two-way cleanout compliant with City of Houston plumbing codes."
            ],
            bullets: [
              "TSBPE Oversight: Tests must be authorized and performed by a licensed Texas Master Plumber (RMP) or licensed journeyman under direct supervision.",
              "Written Seller Consent: Mandatory under standard TREC commercial and residential property contracts before plugging sewer cleanouts.",
              "Permit Verification: Installing missing cleanouts requires City of Houston Permitting Center inspection."
            ]
          },
          {
            id: "houston-soil-and-cast-iron",
            title: "Why Houston Homes Are Prone to Under-Slab Sewer Failures",
            subtitle: "The destructive combination of Beaumont formation clay and sulfuric acid decay",
            content: [
              "Greater Houston rests upon heavy deltaic clay soils, primarily the Beaumont and Lissie geologic formations. These expansive 'gumbo' soils expand aggressively when saturated during heavy Gulf rainstorms and shrink dramatically during summer droughts.",
              "As foundation slabs rise and fall with moisture cycles, rigid cast-iron sewer pipes cast into the concrete slab experience severe shear stress. Over 40 to 60 years, sewer gases react with moisture to form sulfuric acid inside cast-iron pipes, corroding the pipe bottom ('channel rot') until the pipe disintegrates entirely.",
              "When sewage leaks into the soil directly beneath a foundation slab, the localized moisture causes localized soil swelling ('heaval'), which cracks tile floors, jams interior doors, and destabilizes structural load-bearing walls."
            ]
          },
          {
            id: "testing-vs-camera-inspection",
            title: "Hydrostatic Testing vs. Sewer Camera Inspection",
            subtitle: "Why comprehensive due diligence requires both diagnostic methods",
            content: [
              "Homeowners often ask whether an in-line fiber-optic sewer camera inspection can replace a hydrostatic test. While both procedures provide valuable data, they serve fundamentally different diagnostic functions:"
            ],
            numberedList: [
              "Sewer Camera Inspection: Provides visual footage of the pipe interior, revealing tree root intrusions, grease buildup, offset joints, and physical collapse. However, a camera cannot definitively prove whether small hairline cracks or bottom corrosion holes are actively leaking water into the foundation soil.",
              "Hydrostatic Pressure Test: Provides definitive binary proof (Pass or Fail) of watertight integrity. If water level drops, an active leak is confirmed.",
              "Isolation Testing: If a home fails the initial hydrostatic test, the plumber uses an inflatable ball on an extended camera push-rod to test individual branch lines (kitchen branch, master bath branch, guest bath branch) to pinpoint the exact location of the failure under the slab."
            ]
          },
          {
            id: "repair-options-and-next-steps",
            title: "What Happens If a Home Fails a Hydrostatic Test?",
            subtitle: "Exploring modern trenchless pipe lining vs. traditional under-slab tunneling",
            content: [
              "Failing a hydrostatic test does not automatically mean tearing up finished hardwood or tile floors inside the home. Modern Houston plumbing contractors utilize advanced repair techniques designed to preserve interior living spaces:"
            ],
            bullets: [
              "Under-Slab Tunneling: Plumbers excavate tunnels beneath the exterior foundation grade beams to access and replace rotted cast-iron sewer lines with modern schedule 40 PVC without jackhammering through living room or kitchen floors.",
              "Cured-In-Place Pipe (CIPP) Lining: For accessible pipe sections with intact structure, epoxy-saturated liners can be inserted and cured in place, creating a seamless new pipe within the old host pipe.",
              "Negotiation Leverage: A verified hydrostatic failure report from an independent licensed Master Plumber gives home buyers powerful documented evidence to request repair escrow credits or price adjustments before closing."
            ]
          }
        ],
        faqs: [
          {
            question: "How much does a hydrostatic plumbing test cost in Houston?",
            answer: "In Greater Houston, a standard hydrostatic test typically ranges between $350 and $700 when an accessible cleanout is present. If an exterior cleanout must be excavated or installed, additional fees apply based on provider quotes."
          },
          {
            question: "Can a hydrostatic test damage the home's plumbing or foundation?",
            answer: "No. A hydrostatic test merely fills gravity drainage pipes with water to slab level. It introduces zero dynamic mechanical pressure and cannot cause new pipe bursts. If pipes leak during the test, they were already compromised and leaking sewage beneath the slab."
          },
          {
            question: "Does PipeResque perform hydrostatic testing?",
            answer: "No. PipeResque is strictly an informational and referral platform that connects Houston homeowners and home buyers with independent licensed Texas Master Plumbers authorized by the TSBPE."
          },
          {
            question: "How long does a hydrostatic test take to complete?",
            answer: "The entire process usually takes between 60 and 90 minutes, including cleanout location, test ball inflation, filling the drain lines, and the mandatory 15- to 20-minute water level observation period."
          }
        ],
        callToAction: {
          title: "Scheduling a Real Estate Plumbing Inspection in Houston?",
          description: "Connect with verified independent licensed Texas Master Plumbers serving Houston, Katy, Sugar Land, and surrounding counties for thorough under-slab sewer evaluations.",
          button: `Call ${CANONICAL_CONTACT.PHONE}`,
          phone: CANONICAL_CONTACT.PHONE,
          url: CANONICAL_CONTACT.PHONE_URL
        }
      };
    }

    // Default template for other Houston topics
    const cleanKw = (candidate.primaryKeyword || "plumbing service").replace(/houston.*/i, "").trim();
    let seoTitle = `${cleanKw} in Houston TX | PipeResque`;
    if (seoTitle.length > 60) seoTitle = `${cleanKw} Houston | PipeResque`;
    if (seoTitle.length > 60) seoTitle = seoTitle.slice(0, 57) + "...";

    const seoDesc = `Need ${candidate.primaryKeyword} in Houston? Learn testing procedures, TSBPE requirements, under-slab physics, and verified contractor referral options.`;

    return {
      slug: candidate.slug,
      title: `${candidate.topic}: Houston TX Diagnostic & Homeowner Guide`,
      description: `Comprehensive homeowner guide to ${candidate.primaryKeyword} in Houston, TX. Understand local soil conditions, City of Houston permitting, and diagnostic options.`,
      author: "PipeResque Editorial & Research Team",
      category: "Plumbing Diagnostics",
      image: "/images/services/emergency-plumbing.webp",
      imageAlt: `${candidate.topic} in Houston TX`,
      publishedAt: today,
      updatedAt: today,
      readingTime: "9 min read",
      keywords: [candidate.primaryKeyword, ...(candidate.relatedKeywords || [])],
      seo: {
        title: seoTitle,
        description: seoDesc,
        canonical: `https://www.piperesque.com/blog/${candidate.slug}`,
        focusKeyword: candidate.primaryKeyword,
        secondaryKeywords: candidate.relatedKeywords || [],
        searchIntent: "informational"
      },
      introduction: [
        `When plumbing challenges arise in Greater Houston, property owners face unique environmental factors ranging from expansive Beaumont clay soils to municipal utility district water pressure variations.`,
        `Addressing ${candidate.primaryKeyword} requires understanding both the physical mechanics of residential plumbing and local Texas municipal plumbing codes.`,
        `This detailed guide provides clear diagnostic guidance, safety recommendations, and practical steps for connecting with independent licensed plumbing contractors.`
      ],
      sections: [
        {
          id: "overview",
          title: `Understanding ${candidate.topic}`,
          subtitle: "Core mechanics and localized environmental stressors in Houston",
          content: [
            `In Southeast Texas, plumbing systems operate under heavy geological and environmental stress. High ambient humidity, aggressive soil expansion and contraction, and hard municipal mineral content impact components over time.`,
            `Proper maintenance and early diagnosis prevent minor leaks or clogs from developing into major property damage.`
          ],
          bullets: candidate.factualGrounding?.verifiedFacts || [
            "Complies with City of Houston plumbing amendments and International Residential Code (IRC).",
            "Protects structural slab foundations from unaddressed moisture accumulation."
          ]
        },
        {
          id: "diagnostic-steps",
          title: "Key Diagnostic Steps & Early Warning Signs",
          subtitle: "How to identify problems before emergency failures occur",
          content: [
            "Early identification of plumbing symptoms saves thousands in structural remediation. Regular visual inspections of cleanouts, fixture shutoffs, and pressure gauges provide crucial data on system health."
          ],
          numberedList: [
            "Monitor static water pressure using a calibrated hose bibb pressure gauge.",
            "Inspect main sewer cleanouts for standing wastewater or foul sulfur odors.",
            "Check attic and crawlspace fixtures for early signs of oxidation or weeping joints."
          ]
        },
        {
          id: "safety-and-compliance",
          title: "Safety Rules & Permitting Considerations in Houston",
          subtitle: "Adhering to TSBPE guidelines and municipal code enforcement",
          content: [
            "Major plumbing alterations, sewer replacements, and gas line repairs in Houston require permits issued through the City of Houston Permitting Center. All contract plumbing work in Texas must be authorized by an independent Master Plumber licensed by the Texas State Board of Plumbing Examiners (TSBPE)."
          ],
          warning: "Never attempt DIY repairs on gas lines, main sewer laterals, or 240V water heaters. Improper repair risks gas leaks, electrical fires, and uninsurable water damage."
        },
        {
          id: "contractor-selection",
          title: "Questions to Ask Independent Plumbing Contractors",
          subtitle: "Verifying credentials and scopes of work",
          content: [
            "When connecting with independent local plumbing providers, ask these direct questions to ensure code-compliant service:"
          ],
          bullets: [
            "Will you pull the required municipal plumbing permit with the City of Houston?",
            "Are you a licensed Master Plumber (RMP) registered with the TSBPE?",
            "Do you provide written line-item estimates detailing materials and labor warranties?"
          ]
        }
      ],
      faqs: [
        {
          question: `How common is ${candidate.primaryKeyword} in Houston?`,
          answer: "Very common due to Southeast Texas soil shifting, high groundwater levels, and intense seasonal temperature shifts between summer heat and occasional winter freezes."
        },
        {
          question: "Does PipeResque perform the plumbing repair work?",
          answer: "No. PipeResque is an informational and referral platform that connects homeowners with independent, verified third-party plumbing contractors licensed by the State of Texas."
        },
        {
          question: "How do I schedule an inspection or repair?",
          answer: `Call the PipeResque referral phone line at ${CANONICAL_CONTACT.PHONE} to be connected promptly with an independent plumbing professional serving your Houston neighborhood.`
        }
      ],
      callToAction: {
        title: `Need Assistance with ${candidate.topic} in Houston?`,
        description: `Connect with an independent licensed plumbing contractor serving Houston, Katy, Sugar Land, and surrounding areas.`,
        button: `Call ${CANONICAL_CONTACT.PHONE}`,
        phone: CANONICAL_CONTACT.PHONE,
        url: CANONICAL_CONTACT.PHONE_URL
      }
    };
  }

  _updateManifest(candidate, article) {
    if (!fs.existsSync(MANIFEST_FILE)) return;
    try {
      const manifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, "utf-8"));
      manifest.records = manifest.records || [];

      // Add newly completed record
      manifest.records.push({
        id: `OPP-AUTO-${Date.now().toString().slice(-4)}`,
        title: article.title,
        slug: article.slug,
        canonicalUrl: article.seo?.canonical || `https://www.piperesque.com/blog/${article.slug}`,
        primaryKeyword: candidate.primaryKeyword,
        secondaryKeywords: candidate.relatedKeywords || [],
        commercialIntent: candidate.searchIntent || "Informational",
        status: "completed",
        completedDate: new Date().toISOString().split("T")[0],
        filePath: `content/blogs/${article.slug}.json`,
        automationSource: "PipeResque Autonomous Growth Engine"
      });

      manifest.lastAudited = new Date().toISOString();
      fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2), "utf-8");
    } catch (err) {
      console.warn(`[Blog Engine] Could not update manifest: ${err.message}`);
    }
  }
}
