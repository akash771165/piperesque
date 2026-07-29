import process from "node:process";
import { PROJECT, SEO, BUILD } from "./constants.mjs";

const config = {
  project: PROJECT,
  seo: SEO,
  build: BUILD,

  environment: process.env.NODE_ENV ?? "development",

  dryRun: process.argv.includes("--dry-run"),

  verbose: process.argv.includes("--verbose"),

  timestamp: new Date().toISOString(),
};

export default config;