import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

export class ChatbotResponseGenerator extends BaseGenerator {

  static config = {

    namespace: "chatbot-response",

    label: "Chatbot response",

    defaultPrompt: "chatbot-response",

    outputKey: "response",

    emptyOutput: "{}",

    cacheKey: (conversation) => `chatbot-response:${conversation.id ?? conversation.sessionId ?? conversation.message}`,

    promptVars: (conversation) => ({
      conversation: JSON.stringify( conversation, null, 2 ),
    }),

    result: (conversation) => ({
      id: conversation.id ?? null,
      sessionId: conversation.sessionId ?? null,
      message: conversation.message ?? "",
    }),

  };

}

export const generateChatbotResponse = createGenerateFunction(ChatbotResponseGenerator);

export default ChatbotResponseGenerator;
