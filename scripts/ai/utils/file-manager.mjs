import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

import logger from "../../shared/logger.mjs";

import {
  isMissingFileError,
  wrapError,
} from "../../shared/errors.mjs";

export class FileManager {

  constructor(options = {}) {

    this.options = {

      root:

        options.root ??

        process.cwd(),

      encoding:

        options.encoding ??

        "utf8",

      prettyJson:

        options.prettyJson ??

        true,

      ...options,

    };

  }

  resolve(...segments) {

    return path.resolve(

      this.options.root,

      ...segments

    );

  }

  async exists(file) {

    try {

      await fs.access(file);

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

  async ensureDirectory(directory) {

    await fs.mkdir(

      directory,

      {

        recursive: true,

      }

    );

    return directory;

  }

  async ensureParent(file) {

    return this.ensureDirectory(

      path.dirname(file)

    );

  }

  async readText(file) {

    return fs.readFile(

      file,

      this.options.encoding

    );

  }

  async writeText(

    file,

    content

  ) {

    await this.ensureParent(

      file

    );

    await fs.writeFile(

      file,

      content,

      this.options.encoding

    );

    logger.success(

      `Saved: ${path.basename(file)}`

    );

    return file;

  }

  async appendText(

    file,

    content

  ) {

    await this.ensureParent(

      file

    );

    await fs.appendFile(

      file,

      content,

      this.options.encoding

    );

    return file;

  }

  async readJSON(file) {

    const content =

      await this.readText(

        file

      );

    try {

      return JSON.parse(

        content

      );

    } catch (error) {

      throw wrapError(

        `Invalid JSON file: ${file}`,

        error

      );

    }

  }

  async writeJSON(

    file,

    data

  ) {

    const json =

      JSON.stringify(

        data,

        null,

        this.options.prettyJson

          ? 2

          : 0

      );

    return this.writeText(

      file,

      json

    );

  }

  async copy(

    source,

    destination

  ) {

    await this.ensureParent(

      destination

    );

    await fs.copyFile(

      source,

      destination

    );

    return destination;

  }

  async move(

    source,

    destination

  ) {

    await this.ensureParent(

      destination

    );

    await fs.rename(

      source,

      destination

    );

    return destination;

  }

  async remove(file) {

    if (

      !(await this.exists(file))

    ) {

      return false;

    }

    await fs.rm(

      file,

      {

        recursive: true,

        force: true,

      }

    );

    return true;

  }

  async list(

    directory,

    recursive = false

  ) {

    const entries =

      await fs.readdir(

        directory,

        {

          withFileTypes: true,

        }

      );

    const files = [];

    for (

      const entry of entries

    ) {

      const fullPath =

        path.join(

          directory,

          entry.name

        );

      if (

        entry.isDirectory()

      ) {

        if (recursive) {

          files.push(

            ...(await this.list(

              fullPath,

              true

            ))

          );

        }

        continue;

      }

      files.push(

        fullPath

      );

    }

    return files;

  }

  checksum(content) {

    return crypto

      .createHash("sha256")

      .update(content)

      .digest("hex");

  }

  async checksumFile(file) {

    const content =

      await this.readText(

        file

      );

    return this.checksum(

      content

    );

  }

  async stats(file) {

    const stats =

      await fs.stat(file);

    return {

      path: file,

      name:

        path.basename(file),

      extension:

        path.extname(file),

      size:

        stats.size,

      created:

        stats.birthtime,

      modified:

        stats.mtime,

      isDirectory:

        stats.isDirectory(),

      isFile:

        stats.isFile(),

    };

  }

}

export default FileManager;