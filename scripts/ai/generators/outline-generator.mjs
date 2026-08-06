import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

export class OutlineGenerator extends BaseGenerator {

  static config = {

    namespace: "outlines",

    label: "Outline",

    defaultPrompt: "outline",

    outputKey: "outline",

    emptyOutput: "[]",

    cacheKey: (content) => `outline:${content.slug ?? content.title}`,

    promptVars: (content) => ({
      content: JSON.stringify( content, null, 2 ),
    }),

    result: (content) => ({
      slug: content.slug ?? null,
      title: content.title ?? "",
    }),

  };

}

export const generateOutline = createGenerateFunction(OutlineGenerator);

export default OutlineGenerator;
