import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

export class FAQAnswerGenerator extends BaseGenerator {

  static config = {

    namespace: "faq-answer",

    label: "FAQ answer",

    defaultPrompt: "faq-answer",

    outputKey: "answer",

    emptyOutput: "{}",

    cacheKey: (faq) => `faq-answer:${faq.id ?? faq.question}`,

    promptVars: (faq) => ({
      faq: JSON.stringify( faq, null, 2 ),
    }),

    result: (faq) => ({
      id: faq.id ?? null,
      question: faq.question ?? "",
    }),

  };

}

export const generateFAQAnswer = createGenerateFunction(FAQAnswerGenerator);

export default FAQAnswerGenerator;
