import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

import {
  validateSchema,
} from "../validators/schema-validator.mjs";

export class SchemaGenerator extends BaseGenerator {

  static config = {

    namespace: "schema",

    label: "Schema",

    defaultPrompt: "schema",

    outputKey: "schema",

    emptyOutput: "{}",

    validator: validateSchema,

    cacheKey: (content) => `schema:${content.slug}`,

    promptVars: (content) => ({
      content: JSON.stringify( content, null, 2 ),
    }),

    result: (content) => ({
      slug: content.slug,
      title: content.title,
    }),

  };

}

export const generateSchema = createGenerateFunction(SchemaGenerator);

export default SchemaGenerator;
