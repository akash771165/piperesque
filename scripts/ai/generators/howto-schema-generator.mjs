import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

import {
  validateSchema,
} from "../validators/schema-validator.mjs";

export class HowToSchemaGenerator extends BaseGenerator {

  static config = {

    namespace: "howto-schema",

    label: "HowTo schema",

    defaultPrompt: "howto-schema",

    outputKey: "schema",

    emptyOutput: "{}",

    validator: validateSchema,

    cacheKey: (howto) => `howto-schema:${howto.slug ?? howto.title}`,

    promptVars: (howto) => ({
      howto: JSON.stringify( howto, null, 2 ),
    }),

    result: (howto) => ({
      slug: howto.slug ?? null,
      title: howto.title ?? "",
    }),

  };

}

export const generateHowToSchema = createGenerateFunction(HowToSchemaGenerator);

export default HowToSchemaGenerator;
