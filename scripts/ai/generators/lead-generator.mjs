import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

export class LeadGenerator extends BaseGenerator {

  static config = {

    namespace: "lead-generator",

    label: "Lead",

    defaultPrompt: "lead-generator",

    outputKey: "leads",

    emptyOutput: "{}",

    cacheKey: (leadData) => `lead-generator:${leadData.id ?? leadData.name ?? leadData.company}`,

    promptVars: (leadData) => ({
      lead: JSON.stringify( leadData, null, 2 ),
    }),

    result: (leadData) => ({
      id: leadData.id ?? null,
      name: leadData.name ?? "",
      company: leadData.company ?? null,
    }),

  };

}

export const generateLead = createGenerateFunction(LeadGenerator);

export default LeadGenerator;
