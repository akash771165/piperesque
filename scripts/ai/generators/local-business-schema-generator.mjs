import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

import {
  validateSchema,
} from "../validators/schema-validator.mjs";

export class LocalBusinessSchemaGenerator extends BaseGenerator {

  static config = {

    namespace: "local-business-schema",

    label: "Local Business schema",

    defaultPrompt: "local-business-schema",

    outputKey: "schema",

    emptyOutput: "{}",

    validator: validateSchema,

    cacheKey: (business) => `local-business:${business.slug ?? business.name}`,

    promptVars: (business) => ({
      business: JSON.stringify( business, null, 2 ),
    }),

    result: (business) => ({
      slug: business.slug ?? null,
      name: business.name ?? "",
    }),

  };

}

export const generateLocalBusinessSchema = createGenerateFunction(LocalBusinessSchemaGenerator);

export default LocalBusinessSchemaGenerator;
