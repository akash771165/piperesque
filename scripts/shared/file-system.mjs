import fs from "node:fs";
import path from "node:path";

export function ensureDirectory(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function exists(filePath) {
  return fs.existsSync(filePath);
}

export function fileExists(filePath) {
  return exists(filePath);
}

export function readJson(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  return JSON.parse(content);
}

export function writeJson(filePath, data) {
  ensureDirectory(path.dirname(filePath));

  fs.writeFileSync(
    filePath,
    JSON.stringify(data, null, 2),
    "utf8"
  );
}

export function writeJsonSafe(filePath, data) {
  ensureDirectory(path.dirname(filePath));

  if (fileExists(filePath)) {
    throw new Error(`File already exists: ${filePath}`);
  }

  fs.writeFileSync(
    filePath,
    JSON.stringify(data, null, 2),
    "utf8"
  );
}

export function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

export function writeText(filePath, content) {
  ensureDirectory(path.dirname(filePath));

  fs.writeFileSync(filePath, content, "utf8");
}

export function listFiles(directory, extension = null) {
  if (!exists(directory)) return [];

  return fs
    .readdirSync(directory)
    .filter(file =>
      extension ? file.endsWith(extension) : true
    );
}

export default {
  ensureDirectory,
  exists,
  fileExists,
  readJson,
  writeJson,
  writeJsonSafe,
  readText,
  writeText,
  listFiles,
};