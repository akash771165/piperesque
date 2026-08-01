import logger from "../../shared/logger.mjs";
import { SEO } from "../../shared/constants.mjs";

export class SEOValidator {

  constructor(options = {}) {

    this.options = {

      titleMax:

        options.titleMax ??

        SEO.TITLE_MAX,

      descriptionMax:

        options.descriptionMax ??

        SEO.DESCRIPTION_MAX,

      minKeywords:

        options.minKeywords ??

        3,

      maxKeywords:

        options.maxKeywords ??

        15,

      requireCanonical:

        options.requireCanonical ??

        true,

      requireOpenGraph:

        options.requireOpenGraph ??

        true,

      requireTwitter:

        options.requireTwitter ??

        true,

      requireSchema:

        options.requireSchema ??

        true,

      requireRobots:

        options.requireRobots ??

        true,

      ...options,

    };

  }

  validate(seo) {

    const errors = [];

    const warnings = [];

    this.validateTitle(

      seo,

      errors,

      warnings

    );

    this.validateDescription(

      seo,

      errors,

      warnings

    );

    this.validateCanonical(

      seo,

      errors

    );

    this.validateKeywords(

      seo,

      errors,

      warnings

    );

    this.validateOpenGraph(

      seo,

      errors

    );

    this.validateTwitter(

      seo,

      errors

    );

    return {

      valid:

        errors.length === 0,

      errors,

      warnings,

      score:

        this.calculateScore(

          errors,

          warnings

        ),

    };

  }

  validateTitle(

    seo,

    errors,

    warnings

  ) {

    const title =

      seo.title ??

      "";

    if (

      title.length === 0

    ) {

      errors.push(

        "SEO title missing."

      );

      return;

    }

    if (

      title.length >

      this.options.titleMax

    ) {

      errors.push(

        `Title exceeds ${this.options.titleMax} characters.`

      );

    }

    if (

      title.length <

      30

    ) {

      warnings.push(

        "SEO title is short."

      );

    }

  }

  validateDescription(

    seo,

    errors,

    warnings

  ) {

    const description =

      seo.description ??

      "";

    if (

      description.length === 0

    ) {

      errors.push(

        "Meta description missing."

      );

      return;

    }

    if (

      description.length >

      this.options.descriptionMax

    ) {

      errors.push(

        `Description exceeds ${this.options.descriptionMax} characters.`

      );

    }

    if (

      description.length <

      120

    ) {

      warnings.push(

        "Meta description is short."

      );

    }

  }
    validateCanonical(

    seo,

    errors

  ) {

    if (

      !this.options.requireCanonical

    ) {

      return;

    }

    if (

      !seo.canonical

    ) {

      errors.push(

        "Canonical URL missing."

      );

      return;

    }

    try {

      new URL(

        seo.canonical

      );

    } catch {

      errors.push(

        "Canonical URL is invalid."

      );

    }

  }

  validateKeywords(

    seo,

    errors,

    warnings

  ) {

    if (

      !Array.isArray(

        seo.keywords

      )

    ) {

      errors.push(

        "Keywords must be an array."

      );

      return;

    }

    if (

      seo.keywords.length <

      this.options.minKeywords

    ) {

      warnings.push(

        "Too few keywords."

      );

    }

    if (

      seo.keywords.length >

      this.options.maxKeywords

    ) {

      warnings.push(

        "Too many keywords."

      );

    }

  }

  validateOpenGraph(

    seo,

    errors

  ) {

    if (

      !this.options.requireOpenGraph

    ) {

      return;

    }

    if (

      !seo.openGraph

    ) {

      errors.push(

        "Open Graph data missing."

      );

      return;

    }

    if (

      !seo.openGraph.title

    ) {

      errors.push(

        "Open Graph title missing."

      );

    }

    if (

      !seo.openGraph.description

    ) {

      errors.push(

        "Open Graph description missing."

      );

    }

    if (

      !seo.openGraph.images ||

      seo.openGraph.images.length === 0

    ) {

      errors.push(

        "Open Graph image missing."

      );

    }

  }

  validateTwitter(

    seo,

    errors

  ) {

    if (

      !this.options.requireTwitter

    ) {

      return;

    }

    if (

      !seo.twitter

    ) {

      errors.push(

        "Twitter Card missing."

      );

      return;

    }

    if (

      !seo.twitter.card

    ) {

      errors.push(

        "Twitter card type missing."

      );

    }

    if (

      !seo.twitter.title

    ) {

      errors.push(

        "Twitter title missing."

      );

    }

    if (

      !seo.twitter.description

    ) {

      errors.push(

        "Twitter description missing."

      );

    }

  }
    calculateScore(

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

        `SEO validation passed (Score: ${result.score})`

      );

    } else {

      logger.error(

        `SEO validation failed (${result.errors.length} errors)`

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

  assert(seo) {

    const result =

      this.validate(

        seo

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

export function validateSEO(

  seo,

  options = {}

) {

  const validator =

    new SEOValidator(

      options

    );

  return validator.validate(

    seo

  );

}

export function assertValidSEO(

  seo,

  options = {}

) {

  const validator =

    new SEOValidator(

      options

    );

  return validator.assert(

    seo

  );

}

export default SEOValidator;