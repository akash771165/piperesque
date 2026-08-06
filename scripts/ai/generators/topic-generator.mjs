import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

export class TopicGenerator extends BaseGenerator {

  static config = {

    namespace: "topic-generator",

    label: "Topics",

    defaultPrompt: "topic-generator",

    outputKey: "topics",

    emptyOutput: "{}",

    cacheKey: (input) => `topic:${input.keyword ?? input.topic ?? "default"}`,

    promptVars: (input) => ({
      input: JSON.stringify( input, null, 2 ),
    }),

    result: (input) => ({
      keyword: input.keyword ?? null,
      topic: input.topic ?? null,
    }),

  };

}

export const generateTopics = createGenerateFunction(TopicGenerator);

export default TopicGenerator;
