import logger from "../../shared/logger.mjs";

export class SearchProvider {

  constructor(options = {}) {

    this.options = {

      provider:

        options.provider ??

        "mock",

      apiKey:

        options.apiKey ??

        null,

      endpoint:

        options.endpoint ??

        null,

      timeout:

        options.timeout ??

        30000,

      language:

        options.language ??

        "en",

      country:

        options.country ??

        "US",

      results:

        options.results ??

        10,

      safeSearch:

        options.safeSearch ??

        true,

      cache:

        options.cache ??

        true,

      retry:

        options.retry ??

        true,

      ...options,

    };

  }

  provider() {

    return this.options.provider;

  }

  async search(

    keyword,

    options = {}

  ) {

    logger.info(

      `Search Provider: ${this.provider()}`

    );

    switch (

      this.provider()

    ) {

      case "mock":

        return this.mock(

          keyword,

          options

        );

      case "serper":

        return this.serper(

          keyword,

          options

        );

      case "tavily":

        return this.tavily(

          keyword,

          options

        );

      case "brave":

        return this.brave(

          keyword,

          options

        );

      case "bing":

        return this.bing(

          keyword,

          options

        );

      case "google":

        return this.google(

          keyword,

          options

        );

      default:

        throw new Error(

          `Unsupported provider: ${this.provider()}`

        );

    }

  }

  async mock(

    keyword

  ) {

    return {

      provider:

        "mock",

      keyword,

      totalResults: 3,

      results: [

        {

          title:

            `${keyword} Guide`,

          url:

            "https://example.com/guide",

          snippet:

            "Mock search result.",

        },

        {

          title:

            `${keyword} Tips`,

          url:

            "https://example.com/tips",

          snippet:

            "Mock search result.",

        },

        {

          title:

            `${keyword} FAQ`,

          url:

            "https://example.com/faq",

          snippet:

            "Mock search result.",

        },

      ],

    };

  }

  async google(

    keyword,

    options

  ) {

    throw new Error(

      "Google provider not configured."

    );

  }

  async bing(

    keyword,

    options

  ) {

    throw new Error(

      "Bing provider not configured."

    );

  }

  async brave(

    keyword,

    options

  ) {

    throw new Error(

      "Brave provider not configured."

    );

  }
    async serper(

    keyword,

    options

  ) {

    throw new Error(

      "Serper provider not configured."

    );

  }

  async tavily(

    keyword,

    options

  ) {

    throw new Error(

      "Tavily provider not configured."

    );

  }

  normalize(result = {}) {

    return {

      title:

        result.title ??

        "",

      url:

        result.url ??

        result.link ??

        "",

      snippet:

        result.snippet ??

        result.description ??

        "",

      position:

        result.position ??

        0,

      source:

        this.provider(),

    };

  }

  normalizeResults(results = []) {

    return results.map(

      result =>

        this.normalize(

          result

        )

    );

  }

  filter(results = []) {

    return results.filter(

      result =>

        result.title &&

        result.url

    );

  }

  sort(results = []) {

    return [...results].sort(

      (a, b) =>

        (a.position ?? 999) -

        (b.position ?? 999)

    );

  }

  summary(results = []) {

    return {

      provider:

        this.provider(),

      total:

        results.length,

      generatedAt:

        new Date().toISOString(),

    };

  }

  async run(

    keyword,

    options = {}

  ) {

    const response =

      await this.search(

        keyword,

        options

      );

    const normalized =

      this.normalizeResults(

        response.results ??

        []

      );

    const filtered =

      this.filter(

        normalized

      );

    const sorted =

      this.sort(

        filtered

      );

    return {

      keyword,

      provider:

        this.provider(),

      results:

        sorted,

      summary:

        this.summary(

          sorted

        ),

    };

  }

}

export default SearchProvider;