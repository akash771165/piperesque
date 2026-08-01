import SearchProvider from "./search-provider.mjs";

import CacheManager from "../utils/cache-manager.mjs";

import logger from "../../shared/logger.mjs";

export class SearchService {

  constructor(options = {}) {

    this.provider =

      options.provider ??

      new SearchProvider(options);

    this.cache =

      options.cache ??

      new CacheManager({

        namespace:

          "search",

      });

    this.options = {

      useCache:

        options.useCache ??

        true,

      cacheTTL:

        options.cacheTTL ??

        1000 * 60 * 60 * 24,

      normalize:

        options.normalize ??

        true,

      ...options,

    };

  }

  cacheKey(

    keyword,

    options = {}

  ) {

    return JSON.stringify({

      keyword,

      provider:

        this.provider.provider(),

      language:

        options.language ??

        "en",

      country:

        options.country ??

        "US",

      results:

        options.results ??

        10,

    });

  }

  async search(

    keyword,

    options = {}

  ) {

    const key =

      this.cacheKey(

        keyword,

        options

      );

    if (

      this.options.useCache

    ) {

      const cached =

        await this.cache.read(

          key

        );

      if (

        cached

      ) {

        logger.info(

          `Cache Hit: ${keyword}`

        );

        return cached;

      }

    }

    logger.info(

      `Searching: ${keyword}`

    );

    const response =

      await this.provider.run(

        keyword,

        options

      );

    if (

      this.options.useCache

    ) {

      await this.cache.write(

        key,

        response

      );

    }

    return response;

  }

  async searchMany(

    keywords = [],

    options = {}

  ) {

    const results = [];

    for (

      const keyword of keywords

    ) {

      results.push(

        await this.search(

          keyword,

          options

        )

      );

    }

    return results;

  }
    async searchFirst(

    keyword,

    options = {}

  ) {

    const result =

      await this.search(

        keyword,

        options

      );

    return (

      result.results?.[0] ??

      null

    );

  }

  async exists(

    keyword,

    options = {}

  ) {

    const result =

      await this.search(

        keyword,

        options

      );

    return (

      result.results.length >

      0

    );

  }

  async clearCache() {

    await this.cache.clearNamespace();

    logger.success(

      "Search cache cleared."

    );

  }

  async refresh(

    keyword,

    options = {}

  ) {

    const key =

      this.cacheKey(

        keyword,

        options

      );

    await this.cache.delete(

      key

    );

    return this.search(

      keyword,

      options

    );

  }

  async statistics() {

    return {

      provider:

        this.provider.provider(),

      cache:

        await this.cache.statistics(),

      generatedAt:

        new Date().toISOString(),

    };

  }

}

export default SearchService;