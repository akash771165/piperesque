import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

export class ContentCalendarGenerator extends BaseGenerator {

  static config = {

    namespace: "content-calendar",

    label: "Content calendar",

    defaultPrompt: "content-calendar",

    outputKey: "calendar",

    emptyOutput: "{}",

    cacheKey: (calendarInput) => `content-calendar:${calendarInput.id ?? calendarInput.month ?? calendarInput.topic}`,

    promptVars: (calendarInput) => ({
      calendar: JSON.stringify( calendarInput, null, 2 ),
    }),

    result: (calendarInput) => ({
      month: calendarInput.month ?? null,
      topic: calendarInput.topic ?? null,
    }),

  };

}

export const generateContentCalendar = createGenerateFunction(ContentCalendarGenerator);

export default ContentCalendarGenerator;
