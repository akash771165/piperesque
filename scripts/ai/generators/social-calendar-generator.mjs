import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

export class SocialCalendarGenerator extends BaseGenerator {

  static config = {

    namespace: "social-calendar",

    label: "Social calendar",

    defaultPrompt: "social-calendar",

    outputKey: "calendar",

    emptyOutput: "{}",

    cacheKey: (brand) => `social-calendar:${brand.id ?? brand.name ?? brand.topic}`,

    promptVars: (brand) => ({
      brand: JSON.stringify( brand, null, 2 ),
    }),

    result: (brand) => ({
      id: brand.id ?? null,
      name: brand.name ?? "",
      topic: brand.topic ?? null,
    }),

  };

}

export const generateSocialCalendar = createGenerateFunction(SocialCalendarGenerator);

export default SocialCalendarGenerator;
