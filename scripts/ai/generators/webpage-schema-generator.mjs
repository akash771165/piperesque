import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

import {
  validateSchema,
} from "../validators/schema-validator.mjs";

export class WebPageSchemaGenerator extends BaseGenerator {

  static config = {

    namespace: "webpage-schema",

    label: "WebPage schema",

    defaultPrompt: "webpage-schema",

    outputKey: "schema",

    emptyOutput: "{}",

    validator: validateSchema,

    cacheKey: (page) => `webpage-schema:${page.slug ?? page.url ?? page.title}`,

    promptVars: (page) => ({
      page: JSON.stringify( page, null, 2 ),
    }),

    result: (page) => ({
      slug: page.slug ?? null,
      title: page.title ?? "",
      url: page.url ?? null,
    }),

  };

}

export const generateWebPageSchema = createGenerateFunction(WebPageSchemaGenerator);

export default WebPageSchemaGenerator;
