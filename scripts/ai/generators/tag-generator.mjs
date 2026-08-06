import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

export class TagGenerator extends BaseGenerator {

  static config = {

    namespace: "tags",

    label: "Tags",

    defaultPrompt: "tags",

    outputKey: "tags",

    emptyOutput: "[]",

    cacheKey: (content) => `tags:${content.slug ?? content.title}`,

    promptVars: (content) => ({
      content: JSON.stringify( content, null, 2 ),
    }),

    result: (content) => ({
      slug: content.slug ?? null,
      title: content.title ?? "",
    }),

  };

}

export const generateTags = createGenerateFunction(TagGenerator);

export default TagGenerator;
