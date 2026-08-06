import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

import {
  validateSchema,
} from "../validators/schema-validator.mjs";

export class VideoSchemaGenerator extends BaseGenerator {

  static config = {

    namespace: "video-schema",

    label: "Video schema",

    defaultPrompt: "video-schema",

    outputKey: "schema",

    emptyOutput: "{}",

    validator: validateSchema,

    cacheKey: (video) => `video-schema:${video.slug ?? video.name}`,

    promptVars: (video) => ({
      video: JSON.stringify( video, null, 2 ),
    }),

    result: (video) => ({
      slug: video.slug ?? null,
      name: video.name ?? "",
    }),

  };

}

export const generateVideoSchema = createGenerateFunction(VideoSchemaGenerator);

export default VideoSchemaGenerator;
