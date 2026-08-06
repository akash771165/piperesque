import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

export class HomepageGenerator extends BaseGenerator {

  static config = {

    namespace: "homepage",

    label: "Homepage",

    defaultPrompt: "homepage",

    outputKey: "homepage",

    emptyOutput: "{}",

    cacheKey: (website) => `homepage:${website.id ?? website.domain ?? website.name}`,

    promptVars: (website) => ({
      website: JSON.stringify( website, null, 2 ),
    }),

    result: (website) => ({
      id: website.id ?? null,
      domain: website.domain ?? null,
      name: website.name ?? "",
    }),

  };

}

export const generateHomepage = createGenerateFunction(HomepageGenerator);

export default HomepageGenerator;
