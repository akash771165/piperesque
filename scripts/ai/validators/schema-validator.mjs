import logger from "../../shared/logger.mjs";

export class SchemaValidator {

  constructor(options = {}) {

    this.options = {

      requiredContext:

        options.requiredContext ??

        "https://schema.org",

      requiredTypes:

        options.requiredTypes ??

        [

          "Article",

          "FAQPage",

          "BreadcrumbList",

        ],

      requirePublisher:

        options.requirePublisher ??

        true,

      requireAuthor:

        options.requireAuthor ??

        true,

      requireHeadline:

        options.requireHeadline ??

        true,

      requireDescription:

        options.requireDescription ??

        true,

      requireImage:

        options.requireImage ??

        true,

      ...options,

    };

  }

  validate(schema) {

    const errors = [];

    const warnings = [];

    this.validateContext(

      schema,

      errors

    );

    this.validateType(

      schema,

      errors

    );

    this.validateHeadline(

      schema,

      errors

    );

    this.validateDescription(

      schema,

      errors,

      warnings

    );

    this.validateImage(

      schema,

      errors,

      warnings

    );

    this.validateAuthor(

      schema,

      errors

    );

    this.validatePublisher(

      schema,

      errors

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

  validateContext(

    schema,

    errors

  ) {

    if (

      schema["@context"] !==

      this.options.requiredContext

    ) {

      errors.push(

        "Invalid @context."

      );

    }

  }

  validateType(

    schema,

    errors

  ) {

    if (

      !schema["@type"]

    ) {

      errors.push(

        "@type missing."

      );

      return;

    }

    if (

      !this.options.requiredTypes.includes(

        schema["@type"]

      )

    ) {

      errors.push(

        `Unsupported schema type: ${schema["@type"]}`

      );

    }

  }

  validateHeadline(

    schema,

    errors

  ) {

    if (

      !this.options.requireHeadline

    ) {

      return;

    }

    if (

      !schema.headline

    ) {

      errors.push(

        "Headline missing."

      );

    }

  }

  validateDescription(

    schema,

    errors,

    warnings

  ) {

    if (

      !this.options.requireDescription

    ) {

      return;

    }

    if (

      !schema.description

    ) {

      errors.push(

        "Description missing."

      );

      return;

    }

    if (

      schema.description.length <

      80

    ) {

      warnings.push(

        "Description is short."

      );

    }

  }
    validateImage(

    schema,

    errors,

    warnings

  ) {

    if (

      !this.options.requireImage

    ) {

      return;

    }

    if (

      !schema.image

    ) {

      errors.push(

        "Image missing."

      );

      return;

    }

    if (

      Array.isArray(

        schema.image

      ) &&

      schema.image.length === 0

    ) {

      warnings.push(

        "Image array is empty."

      );

    }

  }

  validateAuthor(

    schema,

    errors

  ) {

    if (

      !this.options.requireAuthor

    ) {

      return;

    }

    if (

      !schema.author

    ) {

      errors.push(

        "Author missing."

      );

      return;

    }

    if (

      !schema.author.name

    ) {

      errors.push(

        "Author name missing."

      );

    }

  }

  validatePublisher(

    schema,

    errors

  ) {

    if (

      !this.options.requirePublisher

    ) {

      return;

    }

    if (

      !schema.publisher

    ) {

      errors.push(

        "Publisher missing."

      );

      return;

    }

    if (

      !schema.publisher.name

    ) {

      errors.push(

        "Publisher name missing."

      );

    }

    if (

      !schema.publisher.logo

    ) {

      errors.push(

        "Publisher logo missing."

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

        `Schema validation passed (Score: ${result.score})`

      );

    } else {

      logger.error(

        `Schema validation failed (${result.errors.length} errors)`

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

  assert(schema) {

    const result =

      this.validate(

        schema

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

export function validateSchema(

  schema,

  options = {}

) {

  const validator =

    new SchemaValidator(

      options

    );

  return validator.validate(

    schema

  );

}

export function assertValidSchema(

  schema,

  options = {}

) {

  const validator =

    new SchemaValidator(

      options

    );

  return validator.assert(

      schema

    );

}

export default SchemaValidator;