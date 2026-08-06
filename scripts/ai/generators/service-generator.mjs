import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

import {
  validateResponse,
} from "../validators/response-validator.mjs";

export class ServiceGenerator extends BaseGenerator {

  static config = {

    namespace: "services",

    label: "Service",

    defaultPrompt: "service",

    arity: 2,

    outputKey: "content",

    format: "text",

    validator: validateResponse,

    cacheKey: (service, research) => `service:${service.slug}`,

    promptVars: (service, research) => ({
      service: JSON.stringify( service, null, 2 ),
      research: JSON.stringify( research, null, 2 ),
    }),

    result: (service, research, { prompt }) => ({
      service: service,
      research: research,
      prompt: prompt,
    }),

  };

}

export const generateService = createGenerateFunction(ServiceGenerator);

export default ServiceGenerator;
