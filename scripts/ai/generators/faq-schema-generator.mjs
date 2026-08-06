import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

import {
  validateSchema,
} from "../validators/schema-validator.mjs";

export class FAQSchemaGenerator extends BaseGenerator {

  static config = {

    namespace: "faq-schema",

    label: "FAQ Schema",

    defaultPrompt: "faq-schema",

    outputKey: "schema",

    emptyOutput: "{}",

    validator: validateSchema,

    cacheKey: (faq) => `faq-schema:${faq.slug ?? faq.title}`,

    promptVars: (faq) => ({
      faq: JSON.stringify( faq, null, 2 ),
    }),

    result: (faq) => ({
      slug: faq.slug ?? null,
      title: faq.title ?? "",
    }),

  };

}

export const generateFAQSchema = createGenerateFunction(FAQSchemaGenerator);

export default FAQSchemaGenerator;
