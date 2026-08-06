import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

export class TitleGenerator extends BaseGenerator {

  static config = {

    namespace: "titles",

    label: "Title",

    defaultPrompt: "title",

    outputKey: "generatedTitle",

    format: "text",

    transform: (output) => output.trim(),

    cacheKey: (content) => `title:${content.slug}`,

    promptVars: (content) => ({
      content: JSON.stringify( content, null, 2 ),
    }),

    result: (content) => ({
      slug: content.slug,
      originalTitle: content.title ?? "",
    }),

  };

}

export const generateTitle = createGenerateFunction(TitleGenerator);

export default TitleGenerator;
