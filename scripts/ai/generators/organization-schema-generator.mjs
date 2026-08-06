import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

import {
  validateSchema,
} from "../validators/schema-validator.mjs";

export class OrganizationSchemaGenerator extends BaseGenerator {

  static config = {

    namespace: "organization-schema",

    label: "Organization schema",

    defaultPrompt: "organization-schema",

    outputKey: "schema",

    emptyOutput: "{}",

    validator: validateSchema,

    cacheKey: (organization) => `organization:${organization.slug ?? organization.name}`,

    promptVars: (organization) => ({
      organization: JSON.stringify( organization, null, 2 ),
    }),

    result: (organization) => ({
      slug: organization.slug ?? null,
      name: organization.name ?? "",
    }),

  };

}

export const generateOrganizationSchema = createGenerateFunction(OrganizationSchemaGenerator);

export default OrganizationSchemaGenerator;
