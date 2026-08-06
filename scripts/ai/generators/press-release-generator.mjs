import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

export class PressReleaseGenerator extends BaseGenerator {

  static config = {

    namespace: "press-release",

    label: "Press release",

    defaultPrompt: "press-release",

    outputKey: "release",

    emptyOutput: "{}",

    cacheKey: (announcement) => `press-release:${announcement.id ?? announcement.title ?? announcement.company}`,

    promptVars: (announcement) => ({
      announcement: JSON.stringify( announcement, null, 2 ),
    }),

    result: (announcement) => ({
      id: announcement.id ?? null,
      title: announcement.title ?? "",
      company: announcement.company ?? null,
    }),

  };

}

export const generatePressRelease = createGenerateFunction(PressReleaseGenerator);

export default PressReleaseGenerator;
