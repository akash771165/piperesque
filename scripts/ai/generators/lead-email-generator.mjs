import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

export class LeadEmailGenerator extends BaseGenerator {

  static config = {

    namespace: "lead-email",

    label: "Lead email",

    defaultPrompt: "lead-email",

    outputKey: "emailContent",

    emptyOutput: "{}",

    cacheKey: (lead) => `lead-email:${lead.id ?? lead.email ?? lead.name}`,

    promptVars: (lead) => ({
      lead: JSON.stringify( lead, null, 2 ),
    }),

    result: (lead) => ({
      id: lead.id ?? null,
      name: lead.name ?? "",
      email: lead.email ?? null,
    }),

  };

}

export const generateLeadEmail = createGenerateFunction(LeadEmailGenerator);

export default LeadEmailGenerator;
