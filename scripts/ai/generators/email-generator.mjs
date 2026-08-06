import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

export class EmailGenerator extends BaseGenerator {

  static config = {

    namespace: "emails",

    label: "Email",

    defaultPrompt: "email",

    outputKey: "email",

    format: "text",

    cacheKey: (context) => `email:${context.id ?? context.slug}`,

    promptVars: (context) => ({
      context: JSON.stringify( context, null, 2 ),
    }),

    result: (context) => ({
      id: context.id ?? context.slug ?? null,
      subject: context.subject ?? "",
    }),

  };

}

export const generateEmail = createGenerateFunction(EmailGenerator);

export default EmailGenerator;
