import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

export class BlogOptimizerGenerator extends BaseGenerator {

  static config = {

    namespace: "blog-optimizer",

    label: "Blog optimization",

    defaultPrompt: "blog-optimizer",

    outputKey: "optimization",

    emptyOutput: "{}",

    cacheKey: (blog) => `blog-optimizer:${blog.id ?? blog.slug ?? blog.title}`,

    promptVars: (blog) => ({
      blog: JSON.stringify( blog, null, 2 ),
    }),

    result: (blog) => ({
      id: blog.id ?? null,
      slug: blog.slug ?? null,
      title: blog.title ?? "",
    }),

  };

}

export const generateBlogOptimization = createGenerateFunction(BlogOptimizerGenerator);

export default BlogOptimizerGenerator;
