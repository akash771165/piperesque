import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

import {
  validateSchema,
} from "../validators/schema-validator.mjs";

export class WebsiteSchemaGenerator extends BaseGenerator {

  static config = {

    namespace: "website-schema",

    label: "Website schema",

    defaultPrompt: "website-schema",

    outputKey: "schema",

    emptyOutput: "{}",

    validator: validateSchema,

    cacheKey: (website) => `website-schema:${website.slug ?? website.domain ?? website.name}`,

    promptVars: (website) => ({
      website: JSON.stringify( website, null, 2 ),
    }),

    result: (website) => ({
      slug: website.slug ?? null,
      name: website.name ?? "",
    }),

  };

}

export const generateWebsiteSchema = createGenerateFunction(WebsiteSchemaGenerator);

export default WebsiteSchemaGenerator;
