import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

export class ImageAltGenerator extends BaseGenerator {

  static config = {

    namespace: "image-alt",

    label: "Image alt",

    defaultPrompt: "image-alt",

    outputKey: "alt",

    format: "text",

    transform: (output) => output .trim(),

    cacheKey: (image) => `image-alt:${image.id ?? image.url}`,

    promptVars: (image) => ({
      image: JSON.stringify( image, null, 2 ),
    }),

    result: (image) => ({
      id: image.id ?? null,
      url: image.url ?? "",
    }),

  };

}

export const generateImageAlt = createGenerateFunction(ImageAltGenerator);

export default ImageAltGenerator;
