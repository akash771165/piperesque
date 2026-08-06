import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

export class CustomerSupportGenerator extends BaseGenerator {

  static config = {

    namespace: "customer-support",

    label: "Customer support response",

    defaultPrompt: "customer-support",

    outputKey: "response",

    emptyOutput: "{}",

    cacheKey: (ticket) => `customer-support:${ticket.id ?? ticket.subject ?? ticket.customer}`,

    promptVars: (ticket) => ({
      ticket: JSON.stringify( ticket, null, 2 ),
    }),

    result: (ticket) => ({
      id: ticket.id ?? null,
      customer: ticket.customer ?? null,
      subject: ticket.subject ?? "",
    }),

  };

}

export const generateCustomerSupport = createGenerateFunction(CustomerSupportGenerator);

export default CustomerSupportGenerator;
