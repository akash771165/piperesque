import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

import {
  validateSEO,
} from "../validators/seo-validator.mjs";

export class MetadataGenerator extends BaseGenerator {

  static config = {

    namespace: "metadata",

    label: "Metadata",

    defaultPrompt: "metadata",

    outputKey: "metadata",

    emptyOutput: "{}",

    validator: validateSEO,

    cacheKey: (content) => `metadata:${content.slug}`,

    promptVars: (content) => ({
      content: JSON.stringify( content, null, 2 ),
    }),

    result: (content) => ({
      slug: content.slug,
      title: content.title,
    }),

  };

}

export const generateMetadata = createGenerateFunction(MetadataGenerator);

export default MetadataGenerator;
