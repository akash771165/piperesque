import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

export class ContentBriefGenerator extends BaseGenerator {

  static config = {

    namespace: "content-briefs",

    label: "Content brief",

    defaultPrompt: "content-brief",

    outputKey: "brief",

    emptyOutput: "{}",

    cacheKey: (topic) => `content-brief:${topic.id ?? topic.keyword ?? topic.title}`,

    promptVars: (topic) => ({
      topic: JSON.stringify( topic, null, 2 ),
    }),

    result: (topic) => ({
      keyword: topic.keyword ?? null,
      title: topic.title ?? "",
    }),

  };

}

export const generateContentBrief = createGenerateFunction(ContentBriefGenerator);

export default ContentBriefGenerator;
