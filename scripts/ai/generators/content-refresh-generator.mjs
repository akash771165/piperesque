import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

export class ContentRefreshGenerator extends BaseGenerator {

  static config = {

    namespace: "content-refresh",

    label: "Content refresh plan",

    defaultPrompt: "content-refresh",

    outputKey: "refreshPlan",

    emptyOutput: "{}",

    cacheKey: (content) => `content-refresh:${content.id ?? content.slug ?? content.title}`,

    promptVars: (content) => ({
      content: JSON.stringify( content, null, 2 ),
    }),

    result: (content) => ({
      id: content.id ?? null,
      slug: content.slug ?? null,
      title: content.title ?? "",
    }),

  };

}

export const generateContentRefresh = createGenerateFunction(ContentRefreshGenerator);

export default ContentRefreshGenerator;
