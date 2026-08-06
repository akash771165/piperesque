import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

export class CustomerReviewGenerator extends BaseGenerator {

  static config = {

    namespace: "customer-review",

    label: "Customer reviews",

    defaultPrompt: "customer-review",

    outputKey: "reviews",

    emptyOutput: "{}",

    cacheKey: (business) => `customer-review:${business.id ?? business.name ?? business.service}`,

    promptVars: (business) => ({
      business: JSON.stringify( business, null, 2 ),
    }),

    result: (business) => ({
      id: business.id ?? null,
      name: business.name ?? "",
      service: business.service ?? null,
    }),

  };

}

export const generateCustomerReviews = createGenerateFunction(CustomerReviewGenerator);

export default CustomerReviewGenerator;
