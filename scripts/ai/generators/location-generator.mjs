import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

import {
  validateResponse,
} from "../validators/response-validator.mjs";

export class LocationGenerator extends BaseGenerator {

  static config = {

    namespace: "locations",

    label: "Location",

    defaultPrompt: "location",

    arity: 2,

    outputKey: "content",

    format: "text",

    validator: validateResponse,

    cacheKey: (location, research) => `location:${location.slug}`,

    promptVars: (location, research) => ({
      location: JSON.stringify( location, null, 2 ),
      research: JSON.stringify( research, null, 2 ),
    }),

    result: (location, research, { prompt }) => ({
      location: location,
      research: research,
      prompt: prompt,
    }),

  };

}

export const generateLocation = createGenerateFunction(LocationGenerator);

export default LocationGenerator;
