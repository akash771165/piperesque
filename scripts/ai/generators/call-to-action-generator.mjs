import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

export class CallToActionGenerator extends BaseGenerator {

  static config = {

    namespace: "call-to-actions",

    label: "CTA",

    defaultPrompt: "call-to-action",

    outputKey: "callToAction",

    format: "text",

    transform: (output) => output.trim(),

    cacheKey: (content) => `cta:${content.slug ?? content.title}`,

    promptVars: (content) => ({
      content: JSON.stringify( content, null, 2 ),
    }),

    result: (content) => ({
      slug: content.slug ?? null,
      title: content.title ?? "",
    }),

  };

}

export const generateCallToAction = createGenerateFunction(CallToActionGenerator);

export default CallToActionGenerator;
