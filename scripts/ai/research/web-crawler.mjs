import { setTimeout as sleep } from "node:timers/promises";

import logger from "../../shared/logger.mjs";

import { formatError } from "../../shared/errors.mjs";

import RateLimiter from "../utils/rate-limiter.mjs";

export class WebCrawler {

  constructor(options = {}) {

    this.options = {

      userAgent:

        options.userAgent ??

        "PipeResqueBot/1.0 (+https://www.piperesque.com)",

      timeout:

        options.timeout ??

        30000,

      retries:

        options.retries ??

        3,

      followRedirects:

        options.followRedirects ??

        true,

      respectRobots:

        options.respectRobots ??

        true,

      retryDelay:

        options.retryDelay ??

        2000,

      ...options,

    };

    this.rateLimiter =

      options.rateLimiter ??

      new RateLimiter();

  }

  async fetch(

    url

  ) {

    return this.rateLimiter.execute(

      async () => {

        logger.info(

          `Fetching ${url}`

        );

        let attempt = 0;

        while (

          attempt <=

          this.options.retries

        ) {

          try {

            const response =

              await fetch(

                url,

                {

                  headers: {

                    "User-Agent":

                      this.options.userAgent,

                    Accept:

                      "text/html",

                  },

                  redirect:

                    this.options.followRedirects

                      ? "follow"

                      : "manual",

                  signal:

                    AbortSignal.timeout(

                      this.options.timeout

                    ),

                }

              );

            if (

              !response.ok

            ) {

              throw new Error(

                `HTTP ${response.status}`

              );

            }

            const html =

              await response.text();

            return {

              url,

              status:

                response.status,

              headers:

                Object.fromEntries(

                  response.headers

                ),

              html,

            };

          } catch (

            error

          ) {

            attempt++;

            if (

              attempt >

              this.options.retries

            ) {

              logger.error(

                `Failed to fetch ${url}`,

                error

              );

              throw error;

            }

            logger.warning(

              `Retry ${attempt}/${this.options.retries}: ${error.message}`

            );

            await sleep(

              this.options.retryDelay *

              attempt

            );

          }

        }

        throw new Error(

          `Fetch aborted without a response: ${url}`

        );

      }

    );

  }

  async crawl(url) {

    const page =

      await this.fetch(

        url

      );

    return {

      success: true,

      url,

      status:

        page.status,

      headers:

        page.headers,

      html:

        page.html,

      fetchedAt:

        new Date().toISOString(),

    };

  }

  async crawlMany(

    urls = []

  ) {

    const results = [];

    for (

      const url of urls

    ) {

      try {

        results.push(

          await this.crawl(

            url

          )

        );

      } catch (

        error

      ) {

        logger.warning(

          `Crawl failed: ${url}`,

          error

        );

        results.push({

          success: false,

          url,

          error:

            formatError(error),

        });

      }

    }

    return results;

  }

  async head(url) {

    const response =

      await fetch(

        url,

        {

          method: "HEAD",

          headers: {

            "User-Agent":

              this.options.userAgent,

          },

          signal:

            AbortSignal.timeout(

              this.options.timeout

            ),

        }

      );

    return {

      url,

      status:

        response.status,

      headers:

        Object.fromEntries(

          response.headers

        ),

    };

  }
    async checkRobots(url) {

    if (

      !this.options.respectRobots

    ) {

      return true;

    }

    try {

      const robots =

        new URL(

          "/robots.txt",

          url

        ).toString();

      const response =

        await fetch(

          robots,

          {

            headers: {

              "User-Agent":

                this.options.userAgent,

            },

            signal:

              AbortSignal.timeout(

                this.options.timeout

              ),

          }

        );

      return response.ok;

    } catch (error) {

      /*
        robots.txt could not be reached, so crawling is not proven
        to be allowed. Stay conservative, but say why.
      */

      logger.warning(

        `robots.txt check failed for ${url}, treating as disallowed`,

        error

      );

      return false;

    }

  }

  async ping(url) {

    try {

      await this.head(

        url

      );

      return true;

    } catch (error) {

      logger.info(

        `Ping failed for ${url}: ${formatError(error)}`

      );

      return false;

    }

  }

  async download(url) {

    const page =

      await this.fetch(

        url

      );

    return page.html;

  }

  statistics() {

    return {

      userAgent:

        this.options.userAgent,

      timeout:

        this.options.timeout,

      retries:

        this.options.retries,

      followRedirects:

        this.options.followRedirects,

      respectRobots:

        this.options.respectRobots,

      retryDelay:

        this.options.retryDelay,

    };

  }

}

export default WebCrawler;