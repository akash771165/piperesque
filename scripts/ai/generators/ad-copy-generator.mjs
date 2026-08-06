import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

export class AdCopyGenerator extends BaseGenerator {

  static config = {

    namespace: "ad-copy",

    label: "Ad copy",

    defaultPrompt: "ad-copy",

    outputKey: "adCopy",

    emptyOutput: "{}",

    cacheKey: (campaign) => `ad-copy:${campaign.id ?? campaign.name ?? campaign.product}`,

    promptVars: (campaign) => ({
      campaign: JSON.stringify( campaign, null, 2 ),
    }),

    result: (campaign) => ({
      id: campaign.id ?? null,
      name: campaign.name ?? "",
      product: campaign.product ?? null,
    }),

  };

}

export const generateAdCopy = createGenerateFunction(AdCopyGenerator);

export default AdCopyGenerator;
