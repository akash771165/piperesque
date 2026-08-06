import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

export class SlugGenerator extends BaseGenerator {

  static config = {

    namespace: "slugs",

    label: "Slug",

    defaultPrompt: "slug",

    outputKey: "slug",

    format: "text",

    transform: (output) => output .trim() .toLowerCase() .replace(/[^a-z0-9\s-]/g, "") .replace(/\s+/g, "-") .replace(/-+/g, "-") .replace(/^-|-$/g, ""),

    cacheKey: (content) => `slug:${content.slug ?? content.title}`,

    promptVars: (content) => ({
      content: JSON.stringify( content, null, 2 ),
    }),

    result: (content) => ({
      title: content.title,
    }),

  };

}

export const generateSlug = createGenerateFunction(SlugGenerator);

export default SlugGenerator;
