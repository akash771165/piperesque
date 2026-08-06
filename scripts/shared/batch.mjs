/*
  Batch execution helpers.

  Batch runs used to log a failure and drop it, which made a run where every
  item failed look identical to a fully successful one. These helpers keep the
  successful results, record each failure with its cause chain, and give the
  caller something it has to act on.
*/

import logger from "./logger.mjs";
import {
  aggregateFailures,
  formatError,
  toError,
} from "./errors.mjs";

function defaultDescribe(item, index) {
  if (typeof item === "string") {
    return item;
  }

  if (item && typeof item === "object") {
    return item.slug ?? item.keyword ?? item.title ?? `item #${index + 1}`;
  }

  return String(item);
}

export async function runBatch(
  items,
  task,
  {
    label = "Batch item",
    describe = defaultDescribe,
    stopOnError = false,
  } = {}
) {
  if (!Array.isArray(items)) {
    throw new TypeError(`${label}: a batch requires an array of items.`);
  }

  const results = [];
  const failures = [];

  for (const [index, item] of items.entries()) {
    const name = describe(item, index);

    try {
      results.push(await task(item));
    } catch (cause) {
      const error = toError(cause);

      failures.push({ item: name, error });

      logger.error(`${label} failed: ${name}`, error);

      if (stopOnError) {
        throw aggregateFailures(
          failures,
          `${label} failed: ${name} (${formatError(error)})`
        );
      }
    }
  }

  return { results, failures };
}

/*
  Serialisable failure list for exported reports.
*/
export function describeFailures(failures = []) {
  return failures.map(({ item, error }) => ({
    item,
    error: formatError(error),
  }));
}

export function throwIfFailed(failures = [], total = 0, label = "Batch") {
  if (failures.length === 0) {
    return;
  }

  throw aggregateFailures(
    failures,
    `${label}: ${failures.length} of ${total} items failed (${failures
      .map(failure => failure.item)
      .join(", ")})`
  );
}

const batch = {
  runBatch,
  describeFailures,
  throwIfFailed,
};

export default batch;
