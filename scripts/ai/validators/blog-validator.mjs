import logger from "../../shared/logger.mjs";
import { SEO } from "../../shared/constants.mjs";

export class BlogValidator {

  constructor(options = {}) {

    this.options = {

      minWords:

        options.minWords ??

        SEO.MIN_WORDS,

      maxWords:

        options.maxWords ??

        SEO.MAX_WORDS,

      titleMax:

        options.titleMax ??

        SEO.TITLE_MAX,

      descriptionMax:

        options.descriptionMax ??

        SEO.DESCRIPTION_MAX,

      requiredFields:

        options.requiredFields ??

        [

          "slug",

          "title",

          "description",

          "keyword",

          "content",

          "headings",

          "faq",

        ],

      ...options,

    };

  }

  validate(blog) {

    const errors = [];

    const warnings = [];

    this.validateRequired(

      blog,

      errors

    );

    this.validateSlug(

      blog,

      errors

    );

    this.validateTitle(

      blog,

      errors,

      warnings

    );

    this.validateDescription(

      blog,

      errors,

      warnings

    );

    this.validateContent(

      blog,

      errors,

      warnings

    );

    this.validateHeadings(

      blog,

      errors,

      warnings

    );

    this.validateFAQ(

      blog,

      errors,

      warnings

    );

    return {

      valid:

        errors.length === 0,

      errors,

      warnings,

      score:

        this.score(

          errors,

          warnings

        ),

    };

  }

  validateRequired(

    blog,

    errors

  ) {

    for (

      const field of

      this.options.requiredFields

    ) {

      if (

        blog[field] ===

          undefined ||

        blog[field] ===

          null ||

        blog[field] ===

          ""

      ) {

        errors.push(

          `Missing field: ${field}`

        );

      }

    }

  }

  validateSlug(

    blog,

    errors

  ) {

    if (

      !blog.slug

    ) {

      return;

    }

    if (

      !/^[a-z0-9-]+$/.test(

        blog.slug

      )

    ) {

      errors.push(

        "Slug contains invalid characters."

      );

    }

  }

  validateTitle(

    blog,

    errors,

    warnings

  ) {

    if (

      !blog.title

    ) {

      return;

    }

    if (

      blog.title.length >

      this.options.titleMax

    ) {

      errors.push(

        `Title exceeds ${this.options.titleMax} characters.`

      );

    }

    if (

      blog.title.length <

      25

    ) {

      warnings.push(

        "Title is too short."

      );

    }

  }

  validateDescription(

    blog,

    errors,

    warnings

  ) {

    if (

      !blog.description

    ) {

      return;

    }

    if (

      blog.description.length >

      this.options.descriptionMax

    ) {

      errors.push(

        `Description exceeds ${this.options.descriptionMax} characters.`

      );

    }

    if (

      blog.description.length <

      110

    ) {

      warnings.push(

        "Meta description is short."

      );

    }

  }
    validateContent(

    blog,

    errors,

    warnings

  ) {

    if (

      !blog.content

    ) {

      return;

    }

    const words =

      blog.content

        .trim()

        .split(/\s+/)

        .length;

    if (

      words <

      this.options.minWords

    ) {

      errors.push(

        `Content must contain at least ${this.options.minWords} words.`

      );

    }

    if (

      words >

      this.options.maxWords

    ) {

      warnings.push(

        `Content exceeds ${this.options.maxWords} words.`

      );

    }

  }

  validateHeadings(

    blog,

    errors,

    warnings

  ) {

    if (

      !Array.isArray(

        blog.headings

      )

    ) {

      errors.push(

        "Headings must be an array."

      );

      return;

    }

    if (

      blog.headings.length <

      5

    ) {

      warnings.push(

        "Too few headings."

      );

    }

    for (

      const heading of

      blog.headings

    ) {

      if (

        typeof heading !==

        "string"

      ) {

        errors.push(

          "Invalid heading."

        );

      }

    }

  }

  validateFAQ(

    blog,

    errors,

    warnings

  ) {

    if (

      !Array.isArray(

        blog.faq

      )

    ) {

      errors.push(

        "FAQ must be an array."

      );

      return;

    }

    if (

      blog.faq.length <

      3

    ) {

      warnings.push(

        "Too few FAQs."

      );

    }

    for (

      const item of

      blog.faq

    ) {

      if (

        !item.question ||

        !item.answer

      ) {

        errors.push(

          "Invalid FAQ item."

        );

      }

    }

  }

  score(

    errors,

    warnings

  ) {

    let score = 100;

    score -=

      errors.length * 15;

    score -=

      warnings.length * 3;

    return Math.max(

      score,

      0

    );

  }
    log(result) {

    if (

      result.valid

    ) {

      logger.success(

        `Validation passed (Score: ${result.score})`

      );

    } else {

      logger.error(

        `Validation failed (${result.errors.length} errors)`

      );

    }

    if (

      result.warnings.length

    ) {

      logger.warning(

        `${result.warnings.length} warning(s) found.`

      );

    }

  }

  assert(blog) {

    const result =

      this.validate(

        blog

      );

    this.log(

      result

    );

    if (

      !result.valid

    ) {

      throw new Error(

        result.errors.join("\n")

      );

    }

    return result;

  }

}

export function validateBlog(

  blog,

  options = {}

) {

  const validator =

    new BlogValidator(

      options

    );

  return validator.validate(

    blog

  );

}

export function assertValidBlog(

  blog,

  options = {}

) {

  const validator =

    new BlogValidator(

      options

    );

  return validator.assert(

    blog

  );

}

export default BlogValidator;