import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

import {
  validateSchema,
} from "../validators/schema-validator.mjs";

export class SearchActionSchemaGenerator extends BaseGenerator {

  static config = {

    namespace: "search-action-schema",

    label: "SearchAction schema",

    defaultPrompt: "search-action-schema",

    outputKey: "schema",

    emptyOutput: "{}",

    validator: validateSchema,

    cacheKey: (website) => `search-action-schema:${website.slug ?? website.domain ?? website.name}`,

    promptVars: (website) => ({
      website: JSON.stringify( website, null, 2 ),
    }),

    result: (website) => ({
      slug: website.slug ?? null,
      name: website.name ?? "",
    }),

  };

}

export const generateSearchActionSchema = createGenerateFunction(SearchActionSchemaGenerator);

export default SearchActionSchemaGenerator;
