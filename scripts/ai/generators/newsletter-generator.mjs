import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

export class NewsletterGenerator extends BaseGenerator {

  static config = {

    namespace: "newsletter",

    label: "Newsletter",

    defaultPrompt: "newsletter",

    outputKey: "content",

    emptyOutput: "{}",

    cacheKey: (newsletter) => `newsletter:${newsletter.id ?? newsletter.title ?? newsletter.audience}`,

    promptVars: (newsletter) => ({
      newsletter: JSON.stringify( newsletter, null, 2 ),
    }),

    result: (newsletter) => ({
      id: newsletter.id ?? null,
      title: newsletter.title ?? "",
      audience: newsletter.audience ?? null,
    }),

  };

}

export const generateNewsletter = createGenerateFunction(NewsletterGenerator);

export default NewsletterGenerator;
