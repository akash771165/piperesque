import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

export class KeywordIntentGenerator extends BaseGenerator {

  static config = {

    namespace: "keyword-intent",

    label: "Keyword intent",

    defaultPrompt: "keyword-intent",

    outputKey: "intent",

    emptyOutput: "{}",

    cacheKey: (keyword) => `keyword-intent:${keyword.term ?? keyword.keyword}`,

    promptVars: (keyword) => ({
      keyword: JSON.stringify( keyword, null, 2 ),
    }),

    result: (keyword) => ({
      keyword: keyword.term ?? keyword.keyword ?? null,
    }),

  };

}

export const generateKeywordIntent = createGenerateFunction(KeywordIntentGenerator);

export default KeywordIntentGenerator;
