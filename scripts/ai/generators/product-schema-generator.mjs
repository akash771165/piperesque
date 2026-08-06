import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

import {
  validateSchema,
} from "../validators/schema-validator.mjs";

export class ProductSchemaGenerator extends BaseGenerator {

  static config = {

    namespace: "product-schema",

    label: "Product schema",

    defaultPrompt: "product-schema",

    outputKey: "schema",

    emptyOutput: "{}",

    validator: validateSchema,

    cacheKey: (product) => `product-schema:${product.slug ?? product.name}`,

    promptVars: (product) => ({
      product: JSON.stringify( product, null, 2 ),
    }),

    result: (product) => ({
      slug: product.slug ?? null,
      name: product.name ?? "",
    }),

  };

}

export const generateProductSchema = createGenerateFunction(ProductSchemaGenerator);

export default ProductSchemaGenerator;
