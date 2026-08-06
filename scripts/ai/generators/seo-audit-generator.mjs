import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

import {
  validateSEO,
} from "../validators/seo-validator.mjs";

export class SEOAuditGenerator extends BaseGenerator {

  static config = {

    namespace: "seo-audit",

    label: "SEO audit",

    defaultPrompt: "seo-audit",

    outputKey: "audit",

    emptyOutput: "{}",

    validator: validateSEO,

    cacheKey: (website) => `seo-audit:${website.url ?? website.domain}`,

    promptVars: (website) => ({
      website: JSON.stringify( website, null, 2 ),
    }),

    result: (website) => ({
      url: website.url ?? null,
      domain: website.domain ?? "",
    }),

  };

}

export const generateSEOAudit = createGenerateFunction(SEOAuditGenerator);

export default SEOAuditGenerator;
