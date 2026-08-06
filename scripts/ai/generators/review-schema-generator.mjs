import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

import {
  validateSchema,
} from "../validators/schema-validator.mjs";

export class ReviewSchemaGenerator extends BaseGenerator {

  static config = {

    namespace: "review-schema",

    label: "Review schema",

    defaultPrompt: "review-schema",

    outputKey: "schema",

    emptyOutput: "{}",

    validator: validateSchema,

    cacheKey: (reviews) => `review-schema:${reviews.slug ?? reviews.name}`,

    promptVars: (reviews) => ({
      reviews: JSON.stringify( reviews, null, 2 ),
    }),

    result: (reviews) => ({
      slug: reviews.slug ?? null,
      name: reviews.name ?? "",
    }),

  };

}

export const generateReviewSchema = createGenerateFunction(ReviewSchemaGenerator);

export default ReviewSchemaGenerator;
