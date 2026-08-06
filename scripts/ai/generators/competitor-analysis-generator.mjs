import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

export class CompetitorAnalysisGenerator extends BaseGenerator {

  static config = {

    namespace: "competitor-analysis",

    label: "Competitor analysis",

    defaultPrompt: "competitor-analysis",

    outputKey: "analysis",

    emptyOutput: "{}",

    cacheKey: (competitor) => `competitor-analysis:${competitor.url ?? competitor.domain}`,

    promptVars: (competitor) => ({
      competitor: JSON.stringify( competitor, null, 2 ),
    }),

    result: (competitor) => ({
      url: competitor.url ?? null,
      domain: competitor.domain ?? "",
    }),

  };

}

export const generateCompetitorAnalysis = createGenerateFunction(CompetitorAnalysisGenerator);

export default CompetitorAnalysisGenerator;
