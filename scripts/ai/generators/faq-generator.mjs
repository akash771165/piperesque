import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

import {
  validateResponse,
} from "../validators/response-validator.mjs";

export class FAQGenerator extends BaseGenerator {

  static config = {

    namespace: "faq",

    label: "FAQ",

    defaultPrompt: "faq",

    outputKey: "faq",

    format: "text",

    validator: validateResponse,

    cacheKey: (content) => `faq:${content.slug}`,

    promptVars: (content) => ({
      content: JSON.stringify( content, null, 2 ),
    }),

    result: (content) => ({
      slug: content.slug,
      title: content.title,
    }),

  };

}

export const generateFAQ = createGenerateFunction(FAQGenerator);

export default FAQGenerator;
