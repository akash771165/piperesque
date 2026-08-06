import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

import {
  validateSchema,
} from "../validators/schema-validator.mjs";

export class EntitySchemaGenerator extends BaseGenerator {

  static config = {

    namespace: "entity-schema",

    label: "Entity schema",

    defaultPrompt: "entity-schema",

    outputKey: "schema",

    emptyOutput: "{}",

    validator: validateSchema,

    cacheKey: (entity) => `entity-schema:${entity.slug ?? entity.name}`,

    promptVars: (entity) => ({
      entity: JSON.stringify( entity, null, 2 ),
    }),

    result: (entity) => ({
      slug: entity.slug ?? null,
      name: entity.name ?? "",
      type: entity.type ?? "Thing",
    }),

  };

}

export const generateEntitySchema = createGenerateFunction(EntitySchemaGenerator);

export default EntitySchemaGenerator;
