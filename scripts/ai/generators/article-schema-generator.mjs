import {
  BaseGenerator,
  createGenerateFunction,
} from "../core/base-generator.mjs";

import {
  validateSchema,
} from "../validators/schema-validator.mjs";

export class ArticleSchemaGenerator extends BaseGenerator {

  static config = {

    namespace: "article-schema",

    label: "Article schema",

    defaultPrompt: "article-schema",

    outputKey: "schema",

    emptyOutput: "{}",

    validator: validateSchema,

    cacheKey: (article) => `article-schema:${article.slug ?? article.title}`,

    promptVars: (article) => ({
      article: JSON.stringify( article, null, 2 ),
    }),

    result: (article) => ({
      slug: article.slug ?? null,
      title: article.title ?? "",
    }),

  };

}

export const generateArticleSchema = createGenerateFunction(ArticleSchemaGenerator);

export default ArticleSchemaGenerator;
