import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

export class ExcerptGenerator extends BaseGenerator {

  static config = {

    namespace: "excerpts",

    label: "Excerpt",

    defaultPrompt: "excerpt",

    outputKey: "excerpt",

    format: "text",

    transform: (output) => output.trim(),

    cacheKey: (content) => `excerpt:${content.slug}`,

    promptVars: (content) => ({
      content: JSON.stringify( content, null, 2 ),
    }),

    result: (content) => ({
      slug: content.slug,
      title: content.title,
    }),

  };

}

export const generateExcerpt = createGenerateFunction(ExcerptGenerator);

export default ExcerptGenerator;
