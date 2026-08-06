import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

export class SocialPostGenerator extends BaseGenerator {

  static config = {

    namespace: "social-posts",

    label: "Social posts",

    defaultPrompt: "social-post",

    outputKey: "posts",

    emptyOutput: "{}",

    cacheKey: (page) => `social:${page.slug}`,

    promptVars: (page) => ({
      page: JSON.stringify( page, null, 2 ),
    }),

    result: (page) => ({
      slug: page.slug,
      title: page.title,
    }),

  };

}

export const generateSocialPosts = createGenerateFunction(SocialPostGenerator);

export default SocialPostGenerator;
