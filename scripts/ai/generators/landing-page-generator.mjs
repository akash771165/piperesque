import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

export class LandingPageGenerator extends BaseGenerator {

  static config = {

    namespace: "landing-page",

    label: "Landing page",

    defaultPrompt: "landing-page",

    outputKey: "landingPage",

    emptyOutput: "{}",

    cacheKey: (page) => `landing-page:${page.id ?? page.slug ?? page.title}`,

    promptVars: (page) => ({
      page: JSON.stringify( page, null, 2 ),
    }),

    result: (page) => ({
      id: page.id ?? null,
      slug: page.slug ?? null,
      title: page.title ?? "",
    }),

  };

}

export const generateLandingPage = createGenerateFunction(LandingPageGenerator);

export default LandingPageGenerator;
