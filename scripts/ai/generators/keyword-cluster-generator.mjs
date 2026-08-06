import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

export class KeywordClusterGenerator extends BaseGenerator {

  static config = {

    namespace: "keyword-clusters",

    label: "Keyword clusters",

    defaultPrompt: "keyword-cluster",

    outputKey: "clusters",

    emptyOutput: "{}",

    cacheKey: (keywords) => `keyword-cluster:${keywords.id ?? keywords.topic ?? "default"}`,

    promptVars: (keywords) => ({
      keywords: JSON.stringify( keywords, null, 2 ),
    }),

    result: (keywords) => ({
      topic: keywords.topic ?? null,
    }),

  };

}

export const generateKeywordClusters = createGenerateFunction(KeywordClusterGenerator);

export default KeywordClusterGenerator;
