import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

export class RankingAnalysisGenerator extends BaseGenerator {

  static config = {

    namespace: "ranking-analysis",

    label: "Ranking analysis",

    defaultPrompt: "ranking-analysis",

    outputKey: "analysis",

    emptyOutput: "{}",

    cacheKey: (rankingData) => `ranking-analysis:${rankingData.keyword ?? rankingData.url}`,

    promptVars: (rankingData) => ({
      ranking: JSON.stringify( rankingData, null, 2 ),
    }),

    result: (rankingData) => ({
      keyword: rankingData.keyword ?? null,
      url: rankingData.url ?? null,
      currentPosition: rankingData.position ?? null,
    }),

  };

}

export const generateRankingAnalysis = createGenerateFunction(RankingAnalysisGenerator);

export default RankingAnalysisGenerator;
