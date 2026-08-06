import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

export class InternalLinksGenerator extends BaseGenerator {

  static config = {

    namespace: "internal-links",

    label: "Internal links",

    defaultPrompt: "internal-links",

    arity: 2,

    outputKey: "links",

    emptyOutput: "[]",

    cacheKey: (page, sitemap) => `links:${page.slug}`,

    promptVars: (page, sitemap) => ({
      page: JSON.stringify( page, null, 2 ),
      sitemap: JSON.stringify( sitemap, null, 2 ),
    }),

    result: (page, sitemap) => ({
      slug: page.slug,
      title: page.title,
    }),

  };

}

export const generateInternalLinks = createGenerateFunction(InternalLinksGenerator);

export default InternalLinksGenerator;
