import fs from "node:fs";
import path from "node:path";
import { LOGS_DIR } from "./paths.mjs";

if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

const LOG_FILE = path.join(LOGS_DIR, "automation.log");

function timestamp() {
  return new Date().toISOString();
}

function write(level, message) {
  const line = `[${timestamp()}] [${level}] ${message}`;

  console.log(line);

  fs.appendFileSync(LOG_FILE, line + "\n", "utf8");
}

export function info(message) {
  write("INFO", message);
}

export function success(message) {
  write("SUCCESS", message);
}

export function warning(message) {
  write("WARNING", message);
}

export function error(message) {
  write("ERROR", message);
}

export default {
  info,
  success,
  warning,
  error,
};