/*
  Error helpers shared by the automation scripts.

  The scripts run unattended, so every failure has to keep its original
  message, cause chain and stack instead of being reduced to a string.
*/

export function toError(value) {
  if (value instanceof Error) {
    return value;
  }

  return new Error(
    typeof value === "string"
      ? value
      : `Non-error thrown: ${JSON.stringify(value)}`
  );
}

export function wrapError(message, cause) {
  return new Error(message, { cause: toError(cause) });
}

export function formatError(value) {
  const error = toError(value);

  const parts = [];

  let current = error;
  const seen = new Set();

  while (current && !seen.has(current)) {
    seen.add(current);

    const code = current.code ? ` (${current.code})` : "";

    parts.push(`${current.message}${code}`);

    current = current.cause instanceof Error ? current.cause : null;
  }

  return parts.join(" <- ");
}

export function isMissingFileError(value) {
  const code = toError(value).code;

  return code === "ENOENT" || code === "ENOTDIR";
}

/*
  Combines partial failures of a batch into a single error so that callers
  and CLI exit codes reflect that not everything succeeded.
*/
export function aggregateFailures(failures, message) {
  return new AggregateError(
    failures.map(failure => toError(failure.error)),
    message
  );
}

const errors = {
  toError,
  wrapError,
  formatError,
  isMissingFileError,
  aggregateFailures,
};

export default errors;
