import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

export class SERPAnalysisGenerator extends BaseGenerator {

  static config = {

    namespace: "serp-analysis",

    label: "SERP analysis",

    defaultPrompt: "serp-analysis",

    outputKey: "analysis",

    emptyOutput: "{}",

    cacheKey: (serpData) => `serp-analysis:${serpData.keyword ?? serpData.query}`,

    promptVars: (serpData) => ({
      serp: JSON.stringify( serpData, null, 2 ),
    }),

    result: (serpData) => ({
      keyword: serpData.keyword ?? null,
      query: serpData.query ?? null,
    }),

  };

}

export const generateSERPAnalysis = createGenerateFunction(SERPAnalysisGenerator);

export default SERPAnalysisGenerator;
