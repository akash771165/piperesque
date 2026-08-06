import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

export class SearchIntentGenerator extends BaseGenerator {

  static config = {

    namespace: "search-intent",

    label: "Search intent",

    defaultPrompt: "search-intent",

    outputKey: "intent",

    emptyOutput: "{}",

    cacheKey: (keyword) => `search-intent:${keyword.term ?? keyword.keyword}`,

    promptVars: (keyword) => ({
      keyword: JSON.stringify( keyword, null, 2 ),
    }),

    result: (keyword) => ({
      keyword: keyword.term ?? keyword.keyword ?? null,
    }),

  };

}

export const generateSearchIntent = createGenerateFunction(SearchIntentGenerator);

export default SearchIntentGenerator;
