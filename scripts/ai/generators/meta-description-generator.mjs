import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

export class MetaDescriptionGenerator extends BaseGenerator {

  static config = {

    namespace: "meta-descriptions",

    label: "Meta description",

    defaultPrompt: "meta-description",

    outputKey: "metaDescription",

    format: "text",

    transform: (output) => output.trim(),

    cacheKey: (content) => `meta-description:${content.slug ?? content.title}`,

    promptVars: (content) => ({
      content: JSON.stringify( content, null, 2 ),
    }),

    result: (content) => ({
      slug: content.slug ?? null,
      title: content.title ?? "",
    }),

  };

}

export const generateMetaDescription = createGenerateFunction(MetaDescriptionGenerator);

export default MetaDescriptionGenerator;
