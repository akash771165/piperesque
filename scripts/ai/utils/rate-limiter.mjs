import pLimit from "p-limit";

import logger from "../../shared/logger.mjs";

export class RateLimiter {

  constructor(options = {}) {

    this.options = {

      requestsPerMinute:

        options.requestsPerMinute ??

        60,

      maxConcurrent:

        options.maxConcurrent ??

        5,

      maxRetries:

        options.maxRetries ??

        5,

      baseDelay:

        options.baseDelay ??

        1000,

      maxDelay:

        options.maxDelay ??

        30000,

      jitter:

        options.jitter ??

        true,

      retryStatusCodes:

        options.retryStatusCodes ??

        [

          408,

          409,

          429,

          500,

          502,

          503,

          504,

        ],

      ...options,

    };

    this.limit =

      pLimit(

        this.options.maxConcurrent

      );

    this.requests = [];

  }

  async sleep(milliseconds) {

    return new Promise(

      resolve =>

        setTimeout(

          resolve,

          milliseconds

        )

    );

  }

  cleanup() {

    const now =

      Date.now();

    this.requests =

      this.requests.filter(

        timestamp =>

          now - timestamp <

          60000

      );

  }

  async waitForSlot() {

    this.cleanup();

    if (

      this.requests.length <

      this.options.requestsPerMinute

    ) {

      this.requests.push(

        Date.now()

      );

      return;

    }

    const oldest =

      this.requests[0];

    const waitTime =

      60000 -

      (Date.now() - oldest);

    if (

      waitTime > 0

    ) {

      logger.info(

        `Rate limit reached. Waiting ${waitTime} ms...`

      );

      await this.sleep(

        waitTime

      );

    }

    this.cleanup();

    this.requests.push(

      Date.now()

    );

  }

  shouldRetry(error) {

    if (

      !error

    ) {

      return false;

    }

    const status =

      error.status ??

      error.statusCode ??

      error.code;

    return this.options.retryStatusCodes.includes(

      Number(status)

    );

  }

  delay(attempt) {

    const exponential =

      Math.min(

        this.options.baseDelay *

        (2 ** attempt),

        this.options.maxDelay

      );

    if (

      !this.options.jitter

    ) {

      return exponential;

    }

    return Math.floor(

      exponential *

      (0.5 + Math.random())

    );

  }

  async execute(task) {

    return this.limit(

      async () => {

        await this.waitForSlot();

        return this.retry(

          task

        );

      }

    );

  }

  async retry(task) {

    let lastError;

    for (

      let attempt = 0;

      attempt <=

      this.options.maxRetries;

      attempt++

    ) {

      try {

        return await task();

      } catch (error) {

        lastError = error;
        if (

          attempt ===

          this.options.maxRetries ||

          !this.shouldRetry(

            error

          )

        ) {

          break;

        }

        const wait =

          this.delay(

            attempt

          );

        logger.warning(

          `Retry ${attempt + 1}/${this.options.maxRetries} in ${wait} ms`

        );

        await this.sleep(

          wait

        );

      }

    }

    throw lastError;

  }

  async batch(tasks = []) {

    const results =

      await Promise.all(

        tasks.map(

          task =>

            this.execute(

              task

            )

        )

      );

    return results;

  }

  async queue(tasks = []) {

    const results = [];

    for (

      const task of tasks

    ) {

      results.push(

        await this.execute(

          task

        )

      );

    }

    return results;

  }

  statistics() {

    return {

      requestsLastMinute:

        this.requests.length,

      requestsPerMinute:

        this.options.requestsPerMinute,

      maxConcurrent:

        this.options.maxConcurrent,

      maxRetries:

        this.options.maxRetries,

      baseDelay:

        this.options.baseDelay,

      maxDelay:

        this.options.maxDelay,

    };

  }

  reset() {

    this.requests = [];

    logger.info(

      "Rate limiter reset."

    );

  }

}

export default RateLimiter;