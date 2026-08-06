import fs from "node:fs";
import path from "node:path";
import { LOGS_DIR } from "./paths.mjs";
import { formatError, toError } from "./errors.mjs";

if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

const LOG_FILE = path.join(LOGS_DIR, "automation.log");

function timestamp() {
  return new Date().toISOString();
}

function write(level, message, detail) {
  let line = `[${timestamp()}] [${level}] ${message}`;

  if (detail !== undefined) {
    const cause = toError(detail);

    line += `\n${formatError(cause)}\n${cause.stack ?? ""}`;
  }

  console.log(line);

  fs.appendFileSync(LOG_FILE, line + "\n", "utf8");
}

export function info(message, detail) {
  write("INFO", message, detail);
}

export function success(message) {
  write("SUCCESS", message);
}

export function warning(message, detail) {
  write("WARNING", message, detail);
}

export function error(message, detail) {
  write("ERROR", message, detail);
}

export default {
  info,
  success,
  warning,
  error,
};