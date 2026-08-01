import logger from "../../shared/logger.mjs";

import SearchService from "./search-service.mjs";
import WebCrawler from "./web-crawler.mjs";
import ContentExtractor from "./content-extractor.mjs";

import {
  analyzeSERP,
} from "./serp-analysis.mjs";

import {
  analyzeCompetitors,
} from "./competitor-analysis.mjs";

export class ResearchEngine {

  constructor(options = {}) {

    this.search =

      options.search ??

      new SearchService(options);

    this.crawler =

      options.crawler ??

      new WebCrawler(options);

    this.extractor =

      options.extractor ??

      new ContentExtractor(options);

    this.options = {

      crawlPages:

        options.crawlPages ??

        5,

      analyzeSERP:

        options.analyzeSERP ??

        true,

      analyzeCompetitors:

        options.analyzeCompetitors ??

        true,

      extractContent:

        options.extractContent ??

        true,

      ...options,

    };

  }

  async research(

    keyword,

    options = {}

  ) {

    logger.info(

      `Research started: ${keyword}`

    );

    const search =

      await this.search.search(

        keyword,

        options

      );

    const pages =

      [];

    const limit =

      Math.min(

        this.options.crawlPages,

        search.results.length

      );

    for (

      let i = 0;

      i < limit;

      i++

    ) {

      const result =

        search.results[i];

      const page =

        await this.crawler.crawl(

          result.url

        );

      pages.push({

        ...result,

        ...page,

      });

    }
        const extracted = [];

    if (

      this.options.extractContent

    ) {

      for (

        const page of pages

      ) {

        extracted.push({

          url:

            page.url,

          title:

            page.title,

          extracted:

            this.extractor.extract(

              page.html

            ),

        });

      }

    }

    let serp =

      null;

    if (

      this.options.analyzeSERP

    ) {

      serp =

        await analyzeSERP(

          search.results,

          options

        );

    }

    let competitors =

      null;

    if (

      this.options.analyzeCompetitors

    ) {

      competitors =

        await analyzeCompetitors(

          extracted,

          options

        );

    }

    return {

      keyword,

      search,

      crawledPages:

        pages,

      extracted,

      serp,

      competitors,

      generatedAt:

        new Date().toISOString(),

    };

  }
    async researchMany(

    keywords = [],

    options = {}

  ) {

    const results = [];

    for (

      const keyword of keywords

    ) {

      try {

        const result =

          await this.research(

            keyword,

            options

          );

        results.push(

          result

        );

      } catch (

        error

      ) {

        logger.error(

          `Research failed for "${keyword}": ${error.message}`

        );

        results.push({

          keyword,

          success: false,

          error:

            error.message,

        });

      }

    }

    return results;

  }

  summary(result) {

    return {

      keyword:

        result.keyword,

      searchResults:

        result.search?.results?.length ?? 0,

      crawledPages:

        result.crawledPages?.length ?? 0,

      extractedPages:

        result.extracted?.length ?? 0,

      serpAnalysis:

        Boolean(result.serp),

      competitorAnalysis:

        Boolean(result.competitors),

      generatedAt:

        result.generatedAt,

    };

  }

}

export async function performResearch(

  keyword,

  options = {}

) {

  const engine =

    new ResearchEngine(

      options

    );

  return engine.research(

    keyword,

    options

  );

}

export default ResearchEngine;