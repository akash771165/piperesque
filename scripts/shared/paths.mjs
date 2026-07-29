import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Project root
export const ROOT = path.resolve(__dirname, "../..");

// Content
export const CONTENT_DIR = path.join(ROOT, "content");
export const BLOGS_DIR = path.join(CONTENT_DIR, "blogs");
export const SERVICES_DIR = path.join(CONTENT_DIR, "services");
export const LOCATIONS_DIR = path.join(CONTENT_DIR, "locations");

// Data
export const DATA_DIR = path.join(ROOT, "data");
export const KEYWORDS_DIR = path.join(DATA_DIR, "keywords");
export const SERVICES_DATA_DIR = path.join(DATA_DIR, "services");
export const LOCATIONS_DATA_DIR = path.join(DATA_DIR, "locations");
export const TEMPLATES_DIR = path.join(DATA_DIR, "templates");

// Public
export const PUBLIC_DIR = path.join(ROOT, "public");

// Output
export const OUTPUT_DIR = path.join(ROOT, "output");

// Logs
export const LOGS_DIR = path.join(ROOT, "logs");

// Docs
export const DOCS_DIR = path.join(ROOT, "docs");

// Scripts
export const SCRIPTS_DIR = path.join(ROOT, "scripts");

export default {
  ROOT,
  CONTENT_DIR,
  BLOGS_DIR,
  SERVICES_DIR,
  LOCATIONS_DIR,
  DATA_DIR,
  KEYWORDS_DIR,
  SERVICES_DATA_DIR,
  LOCATIONS_DATA_DIR,
  TEMPLATES_DIR,
  PUBLIC_DIR,
  OUTPUT_DIR,
  LOGS_DIR,
  DOCS_DIR,
  SCRIPTS_DIR,
};