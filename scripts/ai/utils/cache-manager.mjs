import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

import logger from "../../shared/logger.mjs";

import {
  formatError,
  isMissingFileError,
} from "../../shared/errors.mjs";

export class CacheManager {

  constructor(options = {}) {

    this.options = {

      cacheDirectory:

        options.cacheDirectory ??

        path.join(
          process.cwd(),
          ".cache"
        ),

      ttl:

        options.ttl ??

        1000 * 60 * 60 * 24,

      pretty:

        options.pretty ??

        true,

      enabled:

        options.enabled ??

        true,

      namespace:

        options.namespace ??

        "default",

      ...options,

    };

  }

  async ensureDirectory() {

    await fs.mkdir(

      this.options.cacheDirectory,

      {

        recursive: true,

      }

    );

  }

  normalize(key) {

    return key

      .trim()

      .toLowerCase();

  }

  hash(key) {

    return crypto

      .createHash("sha256")

      .update(

        this.normalize(key)

      )

      .digest("hex");

  }

  file(key) {

    return path.join(

      this.options.cacheDirectory,

      this.options.namespace,

      `${this.hash(key)}.json`

    );

  }

  async exists(key) {

    try {

      await fs.access(

        this.file(key)

      );

      return true;

    } catch (error) {

      if (
        !isMissingFileError(error)
      ) {

        throw error;

      }

      return false;

    }

  }

  async read(key) {

    if (

      !this.options.enabled

    ) {

      return null;

    }

    if (

      !(await this.exists(key))

    ) {

      return null;

    }

    const content =

      await fs.readFile(

        this.file(key),

        "utf8"

      );

    let cache;

    try {

      cache =

        JSON.parse(content);

    } catch (error) {

      /*
        A damaged cache entry must not abort the run: report it,
        drop it and treat the key as a miss.
      */

      logger.warning(

        `Discarding corrupted cache entry "${key}": ${formatError(error)}`

      );

      await this.delete(key);

      return null;

    }

    if (

      this.isExpired(cache)

    ) {

      await this.delete(key);

      return null;

    }

    logger.info(

      `Cache Hit: ${key}`

    );

    return cache.data;

  }

  async write(

    key,

    data

  ) {

    if (

      !this.options.enabled

    ) {

      return data;

    }

    await this.ensureDirectory();

    const file =

      this.file(key);

    await fs.mkdir(

      path.dirname(file),

      {

        recursive: true,

      }

    );

    const payload = {

      key,

      namespace:

        this.options.namespace,

      createdAt:

        Date.now(),

      expiresAt:

        Date.now() +

        this.options.ttl,

      checksum:

        crypto

          .createHash("md5")

          .update(

            JSON.stringify(data)

          )

          .digest("hex"),

      data,

    };

    await fs.writeFile(

      file,

      JSON.stringify(

        payload,

        null,

        this.options.pretty

          ? 2

          : 0

      ),

      "utf8"

    );

    logger.success(

      `Cache Saved: ${key}`

    );

    return data;

  }

  async remember(

    key,

    callback

  ) {

    const cached =

      await this.read(key);

    if (

      cached !== null

    ) {

      return cached;

    }

    const value =

      await callback();

    await this.write(

      key,

      value

    );

    return value;

  }

  isExpired(cache) {

    return (

      Date.now() >

      cache.expiresAt

    );

  }

  async delete(key) {

    if (

      !(await this.exists(key))

    ) {

      return false;

    }

    await fs.rm(

      this.file(key),

      {

        force: true,

      }

    );

    return true;

  }

  async clearNamespace() {

    await fs.rm(

      path.join(

        this.options.cacheDirectory,

        this.options.namespace

      ),

      {

        recursive: true,

        force: true,

      }

    );

    await this.ensureDirectory();

  }
  async clearAll() {

    await fs.rm(

      this.options.cacheDirectory,

      {

        recursive: true,

        force: true,

      }

    );

    await this.ensureDirectory();

    logger.success(
      "Entire cache cleared."
    );

  }

  async statistics() {

    await this.ensureDirectory();

    const namespaceDirectory =
      path.join(

        this.options.cacheDirectory,

        this.options.namespace

      );

    try {

      const files =
        await fs.readdir(
          namespaceDirectory
        );

      return {

        namespace:
          this.options.namespace,

        cacheDirectory:
          namespaceDirectory,

        totalFiles:
          files.length,

        ttl:
          this.options.ttl,

        enabled:
          this.options.enabled,

      };

    } catch (error) {

      if (
        !isMissingFileError(error)
      ) {

        throw error;

      }

      return {

        namespace:
          this.options.namespace,

        cacheDirectory:
          namespaceDirectory,

        totalFiles: 0,

        ttl:
          this.options.ttl,

        enabled:
          this.options.enabled,

      };

    }

  }

  async keys() {

    const namespaceDirectory =
      path.join(

        this.options.cacheDirectory,

        this.options.namespace

      );

    try {

      return await fs.readdir(
        namespaceDirectory
      );

    } catch (error) {

      if (
        !isMissingFileError(error)
      ) {

        throw error;

      }

      return [];

    }

  }

  async has(key) {

    return this.exists(
      key
    );

  }

  async touch(key) {

    const data =
      await this.read(
        key
      );

    if (data === null) {

      return false;

    }

    await this.write(
      key,
      data
    );

    return true;

  }

  async getOrSet(
    key,
    callback
  ) {

    return this.remember(
      key,
      callback
    );

  }

}

export default CacheManager;