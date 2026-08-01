import path from "node:path";
import crypto from "node:crypto";

import FileManager from "./file-manager.mjs";

export class JSONManager {

  constructor(options = {}) {

    this.fileManager =

      options.fileManager ??

      new FileManager(options);

    this.options = {

      pretty:

        options.pretty ??

        true,

      backup:

        options.backup ??

        true,

      versioning:

        options.versioning ??

        true,

      atomicWrite:

        options.atomicWrite ??

        true,

      ...options,

    };

  }

  parse(json) {

    try {

      return JSON.parse(json);

    } catch (error) {

      throw new Error(

        `Invalid JSON: ${error.message}`

      );

    }

  }

  stringify(data) {

    return JSON.stringify(

      data,

      null,

      this.options.pretty

        ? 2

        : 0

    );

  }

  async load(file) {

    const content =

      await this.fileManager.readText(

        file

      );

    return this.parse(

      content

    );

  }

  async save(

    file,

    data

  ) {

    if (

      this.options.atomicWrite

    ) {

      return this.atomicSave(

        file,

        data

      );

    }

    return this.fileManager.writeJSON(

      file,

      data

    );

  }

  async atomicSave(

    file,

    data

  ) {

    const temp =

`${file}.tmp`;

    await this.fileManager.writeJSON(

      temp,

      data

    );

    await this.fileManager.move(

      temp,

      file

    );

    return file;

  }

  async backup(file) {

    if (

      !this.options.backup

    ) {

      return null;

    }

    if (

      !(await this.fileManager.exists(file))

    ) {

      return null;

    }

    const backupFile =

`${file}.${Date.now()}.bak`;

    await this.fileManager.copy(

      file,

      backupFile

    );

    return backupFile;

  }

  async restore(

    backup,

    destination

  ) {

    await this.fileManager.copy(

      backup,

      destination

    );

    return destination;

  }

  async merge(

    file,

    object

  ) {

    const current =

      await this.load(file);

    const merged = {

      ...current,

      ...object,

    };

    await this.save(

      file,

      merged

    );

    return merged;

  }

  deepMerge(

    target,

    source

  ) {

    const output =

      structuredClone(

        target

      );

    for (

      const key of Object.keys(

        source

      )

    ) {

      if (

        source[key] &&

        typeof source[key] ===

          "object" &&

        !Array.isArray(

          source[key]

        )

      ) {

        output[key] =

          this.deepMerge(

            output[key] ?? {},

            source[key]

          );

      } else {

        output[key] =

          source[key];

      }

    }

    return output;

  }

  async deepMergeFile(

    file,

    object

  ) {

    const current =

      await this.load(file);

    const merged =

      this.deepMerge(

        current,

        object

      );

    await this.save(

      file,

      merged

    );

    return merged;

  }

  validate(value) {

    if (

      value === null ||

      value === undefined

    ) {

      throw new Error(

        "JSON cannot be null."

      );

    }

    if (

      typeof value !==

      "object"

    ) {

      throw new Error(

        "JSON root must be an object."

      );

    }

    return true;

  }

  hash(data) {

    return crypto

      .createHash("sha256")

      .update(

        this.stringify(data)

      )

      .digest("hex");

  }

  versionFile(file) {

    return path.join(

      path.dirname(file),

      ".versions",

      path.basename(file)

    );

  }
  async saveVersion(
    file,
    data
  ) {

    if (
      !this.options.versioning
    ) {

      return null;

    }

    const versionDirectory =
      this.versionFile(
        file
      );

    await this.fileManager.ensureDirectory(
      versionDirectory
    );

    const versionName =
`${Date.now()}.json`;

    const versionPath =
      path.join(
        versionDirectory,
        versionName
      );

    await this.fileManager.writeJSON(
      versionPath,
      data
    );

    return versionPath;

  }

  async diff(
    firstFile,
    secondFile
  ) {

    const first =
      await this.load(
        firstFile
      );

    const second =
      await this.load(
        secondFile
      );

    const added = {};

    const removed = {};

    const changed = {};

    for (const key of Object.keys(second)) {

      if (!(key in first)) {

        added[key] =
          second[key];

      } else if (

        JSON.stringify(
          first[key]
        ) !==
        JSON.stringify(
          second[key]
        )

      ) {

        changed[key] = {

          old:
            first[key],

          new:
            second[key],

        };

      }

    }

    for (const key of Object.keys(first)) {

      if (!(key in second)) {

        removed[key] =
          first[key];

      }

    }

    return {

      added,

      removed,

      changed,

    };

  }

  async clone(
    source,
    destination
  ) {

    const data =
      await this.load(
        source
      );

    await this.save(
      destination,
      data
    );

    return destination;

  }

  async create(
    file,
    initialData = {}
  ) {

    this.validate(
      initialData
    );

    if (
      await this.fileManager.exists(file)
    ) {

      throw new Error(
        `File already exists: ${file}`
      );

    }

    await this.save(
      file,
      initialData
    );

    return file;

  }

  async delete(file) {

    return this.fileManager.remove(
      file
    );

  }

  async exists(file) {

    return this.fileManager.exists(
      file
    );

  }

  async checksum(file) {

    const data =
      await this.load(
        file
      );

    return this.hash(
      data
    );

  }

}

export default JSONManager;