import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

export class KeywordGenerator extends BaseGenerator {

  static config = {

    namespace: "keywords",

    label: "Keywords",

    defaultPrompt: "keywords",

    outputKey: "keywords",

    emptyOutput: "[]",

    cacheKey: (content) => `keywords:${content.slug ?? content.title}`,

    promptVars: (content) => ({
      content: JSON.stringify( content, null, 2 ),
    }),

    result: (content) => ({
      slug: content.slug ?? null,
      title: content.title ?? "",
    }),

  };

}

export const generateKeywords = createGenerateFunction(KeywordGenerator);

export default KeywordGenerator;
