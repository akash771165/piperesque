import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

export class TestimonialGenerator extends BaseGenerator {

  static config = {

    namespace: "testimonial",

    label: "Testimonial",

    defaultPrompt: "testimonial",

    outputKey: "testimonial",

    emptyOutput: "{}",

    cacheKey: (customer) => `testimonial:${customer.id ?? customer.name ?? customer.service}`,

    promptVars: (customer) => ({
      customer: JSON.stringify( customer, null, 2 ),
    }),

    result: (customer) => ({
      id: customer.id ?? null,
      name: customer.name ?? "",
      service: customer.service ?? null,
    }),

  };

}

export const generateTestimonial = createGenerateFunction(TestimonialGenerator);

export default TestimonialGenerator;
