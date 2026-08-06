import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

export class ProposalGenerator extends BaseGenerator {

  static config = {

    namespace: "proposal-generator",

    label: "Proposal",

    defaultPrompt: "proposal-generator",

    outputKey: "proposal",

    emptyOutput: "{}",

    cacheKey: (proposalData) => `proposal-generator:${proposalData.id ?? proposalData.client ?? proposalData.title}`,

    promptVars: (proposalData) => ({
      proposal: JSON.stringify( proposalData, null, 2 ),
    }),

    result: (proposalData) => ({
      id: proposalData.id ?? null,
      client: proposalData.client ?? "",
      title: proposalData.title ?? "",
    }),

  };

}

export const generateProposal = createGenerateFunction(ProposalGenerator);

export default ProposalGenerator;
