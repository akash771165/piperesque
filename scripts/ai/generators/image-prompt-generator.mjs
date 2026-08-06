import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

export class ImagePromptGenerator extends BaseGenerator {

  static config = {

    namespace: "image-prompts",

    label: "Image prompts",

    defaultPrompt: "image-prompt",

    outputKey: "prompts",

    emptyOutput: "{}",

    cacheKey: (page) => `image:${page.slug}`,

    promptVars: (page) => ({
      page: JSON.stringify( page, null, 2 ),
    }),

    result: (page) => ({
      slug: page.slug,
      title: page.title,
    }),

  };

}

export const generateImagePrompts = createGenerateFunction(ImagePromptGenerator);

export default ImagePromptGenerator;
