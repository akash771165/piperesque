import logger from "../../shared/logger.mjs";

export class ResponseValidator {

  constructor(options = {}) {

    this.options = {

      minWords:

        options.minWords ??

        1200,

      requiredHeadings:

        options.requiredHeadings ??

        [

          "Introduction",

          "Conclusion",

        ],

      requireFAQ:

        options.requireFAQ ??

        true,

      requireMarkdown:

        options.requireMarkdown ??

        true,

      requireTables:

        options.requireTables ??

        false,

      maxTokenEstimate:

        options.maxTokenEstimate ??

        12000,

      ...options,

    };

  }

  validate(response) {

    const errors = [];

    const warnings = [];

    this.validateContent(

      response,

      errors

    );

    this.validateMarkdown(

      response,

      errors,

      warnings

    );

    this.validateHeadings(

      response,

      errors,

      warnings

    );

    this.validateFAQ(

      response,

      errors

    );

    this.validateLength(

      response,

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

  validateContent(

    response,

    errors

  ) {

    if (

      !response ||

      typeof response !==

      "string"

    ) {

      errors.push(

        "Response must be a string."

      );

      return;

    }

    if (

      response.trim().length === 0

    ) {

      errors.push(

        "Response is empty."

      );

    }

  }

  validateMarkdown(

    response,

    errors,

    warnings

  ) {

    if (

      !this.options.requireMarkdown

    ) {

      return;

    }

    const headings =

      (response.match(

        /^#{1,6}\s.+$/gm

      ) ?? []).length;

    if (

      headings === 0

    ) {

      warnings.push(

        "Markdown headings not found."

      );

    }

  }

  validateHeadings(

    response,

    errors,

    warnings

  ) {

    for (

      const heading of

      this.options.requiredHeadings

    ) {

      if (

        !response.includes(

          heading

        )

      ) {

        warnings.push(

          `Missing heading: ${heading}`

        );

      }

    }

  }

  validateFAQ(

    response,

    errors

  ) {

    if (

      !this.options.requireFAQ

    ) {

      return;

    }

    if (

      !response.includes(

        "FAQ"

      )

    ) {

      errors.push(

        "FAQ section missing."

      );

    }

  }

  validateLength(

    response,

    errors,

    warnings

  ) {

    const words =

      response

        .trim()

        .split(/\s+/)

        .length;

    if (

      words <

      this.options.minWords

    ) {

      errors.push(

        `Response contains only ${words} words.`

      );

    }

    const estimatedTokens =

      Math.ceil(

        response.length / 4

      );

    if (

      estimatedTokens >

      this.options.maxTokenEstimate

    ) {

      warnings.push(

        "Estimated token limit exceeded."

      );

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

        `Response validation passed (Score: ${result.score})`

      );

    } else {

      logger.error(

        `Response validation failed (${result.errors.length} errors)`

      );

    }

    if (

      result.warnings.length > 0

    ) {

      logger.warning(

        `${result.warnings.length} warning(s) detected.`

      );

    }

  }

  assert(response) {

    const result =

      this.validate(

        response

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
export function validateResponse(

  response,

  options = {}

) {

  const validator =

    new ResponseValidator(

      options

    );

  return validator.validate(

    response

  );

}

export function assertValidResponse(

  response,

  options = {}

) {

  const validator =

    new ResponseValidator(

      options

    );

  return validator.assert(

      response

    );

}

export default ResponseValidator;