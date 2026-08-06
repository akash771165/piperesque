import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

import {
  validateResponse,
} from "../validators/response-validator.mjs";

export class ContentGenerator extends BaseGenerator {

  static config = {

    namespace: "content",

    label: "Content",

    defaultPrompt: "blog",

    outputKey: "content",

    format: "text",

    validator: validateResponse,

    cacheKey: (research) => `content:${research.keyword}`,

    promptVars: (research) => ({
      keyword: research.keyword,
      research: JSON.stringify( research, null, 2 ),
    }),

    result: (research, { prompt }) => ({
      keyword: research.keyword,
      prompt: prompt,
    }),

  };

}

export const generateContent = createGenerateFunction(ContentGenerator);

export default ContentGenerator;
