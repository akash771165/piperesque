import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

export class SalesScriptGenerator extends BaseGenerator {

  static config = {

    namespace: "sales-script",

    label: "Sales script",

    defaultPrompt: "sales-script",

    outputKey: "script",

    emptyOutput: "{}",

    cacheKey: (salesData) => `sales-script:${salesData.id ?? salesData.product ?? salesData.service}`,

    promptVars: (salesData) => ({
      sales: JSON.stringify( salesData, null, 2 ),
    }),

    result: (salesData) => ({
      id: salesData.id ?? null,
      product: salesData.product ?? null,
      service: salesData.service ?? null,
    }),

  };

}

export const generateSalesScript = createGenerateFunction(SalesScriptGenerator);

export default SalesScriptGenerator;
