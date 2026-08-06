import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

import {
  validateSchema,
} from "../validators/schema-validator.mjs";

export class BreadcrumbGenerator extends BaseGenerator {

  static config = {

    namespace: "breadcrumbs",

    label: "Breadcrumb",

    defaultPrompt: "breadcrumb",

    outputKey: "breadcrumb",

    emptyOutput: "{}",

    validator: validateSchema,

    cacheKey: (page) => `breadcrumb:${page.slug ?? page.title}`,

    promptVars: (page) => ({
      page: JSON.stringify( page, null, 2 ),
    }),

    result: (page) => ({
      slug: page.slug ?? null,
      title: page.title ?? "",
    }),

  };

}

export const generateBreadcrumb = createGenerateFunction(BreadcrumbGenerator);

export default BreadcrumbGenerator;
