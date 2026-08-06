import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

import {
  validateSchema,
} from "../validators/schema-validator.mjs";

export class ServiceSchemaGenerator extends BaseGenerator {

  static config = {

    namespace: "service-schema",

    label: "Service schema",

    defaultPrompt: "service-schema",

    outputKey: "schema",

    emptyOutput: "{}",

    validator: validateSchema,

    cacheKey: (service) => `service-schema:${service.slug ?? service.name}`,

    promptVars: (service) => ({
      service: JSON.stringify( service, null, 2 ),
    }),

    result: (service) => ({
      slug: service.slug ?? null,
      name: service.name ?? "",
    }),

  };

}

export const generateServiceSchema = createGenerateFunction(ServiceSchemaGenerator);

export default ServiceSchemaGenerator;
