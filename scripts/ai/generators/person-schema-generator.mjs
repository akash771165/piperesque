import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

import {
  validateSchema,
} from "../validators/schema-validator.mjs";

export class PersonSchemaGenerator extends BaseGenerator {

  static config = {

    namespace: "person-schema",

    label: "Person schema",

    defaultPrompt: "person-schema",

    outputKey: "schema",

    emptyOutput: "{}",

    validator: validateSchema,

    cacheKey: (person) => `person-schema:${person.slug ?? person.name}`,

    promptVars: (person) => ({
      person: JSON.stringify( person, null, 2 ),
    }),

    result: (person) => ({
      slug: person.slug ?? null,
      name: person.name ?? "",
    }),

  };

}

export const generatePersonSchema = createGenerateFunction(PersonSchemaGenerator);

export default PersonSchemaGenerator;
