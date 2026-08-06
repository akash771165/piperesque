import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

import {
  validateSchema,
} from "../validators/schema-validator.mjs";

export class EventSchemaGenerator extends BaseGenerator {

  static config = {

    namespace: "event-schema",

    label: "Event schema",

    defaultPrompt: "event-schema",

    outputKey: "schema",

    emptyOutput: "{}",

    validator: validateSchema,

    cacheKey: (event) => `event-schema:${event.slug ?? event.name}`,

    promptVars: (event) => ({
      event: JSON.stringify( event, null, 2 ),
    }),

    result: (event) => ({
      slug: event.slug ?? null,
      name: event.name ?? "",
    }),

  };

}

export const generateEventSchema = createGenerateFunction(EventSchemaGenerator);

export default EventSchemaGenerator;
