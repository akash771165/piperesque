import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

export class CategoryGenerator extends BaseGenerator {

  static config = {

    namespace: "categories",

    label: "Category",

    defaultPrompt: "category",

    outputKey: "category",

    format: "text",

    transform: (output) => output.trim(),

    cacheKey: (content) => `category:${content.slug ?? content.title}`,

    promptVars: (content) => ({
      content: JSON.stringify( content, null, 2 ),
    }),

    result: (content) => ({
      slug: content.slug ?? null,
      title: content.title ?? "",
    }),

  };

}

export const generateCategory = createGenerateFunction(CategoryGenerator);

export default CategoryGenerator;
