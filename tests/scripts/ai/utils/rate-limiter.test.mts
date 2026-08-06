import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { RateLimiter } from "../../../../scripts/ai/utils/rate-limiter.mjs";

const { logger } = vi.hoisted(() => ({
  logger: {
    info: vi.fn(),
    success: vi.fn(),
    warning: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("../../../../scripts/shared/logger.mjs", () => ({
  default: logger,
  ...logger,
}));

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("options", () => {
  it("exposes defaults through statistics", () => {
    expect(new RateLimiter().statistics()).toEqual({
      requestsLastMinute: 0,
      requestsPerMinute: 60,
      maxConcurrent: 5,
      maxRetries: 5,
      baseDelay: 1000,
      maxDelay: 30000,
    });
  });

  it("accepts overrides", () => {
    expect(new RateLimiter({ requestsPerMinute: 10 }).statistics()).toMatchObject({
      requestsPerMinute: 10,
    });
  });
});

describe("cleanup", () => {
  it("drops timestamps older than a minute", () => {
    const limiter = new RateLimiter();
    const now = Date.now();

    limiter.requests = [now - 120000, now - 1000];
    limiter.cleanup();

    expect(limiter.requests).toEqual([now - 1000]);
  });
});

describe("waitForSlot", () => {
  it("records a request when under the limit", async () => {
    const limiter = new RateLimiter({ requestsPerMinute: 2 });

    await limiter.waitForSlot();

    expect(limiter.requests).toHaveLength(1);
  });

  it("waits for the oldest request to age out when saturated", async () => {
    const limiter = new RateLimiter({ requestsPerMinute: 1 });
    const sleep = vi.spyOn(limiter, "sleep").mockResolvedValue(undefined);

    limiter.requests = [Date.now() - 59000];

    await limiter.waitForSlot();

    expect(sleep).toHaveBeenCalledOnce();
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining("Rate limit reached")
    );
  });
});

describe("shouldRetry", () => {
  it("retries on retryable status codes", () => {
    const limiter = new RateLimiter();

    expect(limiter.shouldRetry({ status: 429 })).toBe(true);
    expect(limiter.shouldRetry({ statusCode: 503 })).toBe(true);
    expect(limiter.shouldRetry({ code: "500" })).toBe(true);
  });

  it("does not retry other errors", () => {
    const limiter = new RateLimiter();

    expect(limiter.shouldRetry({ status: 400 })).toBe(false);
    expect(limiter.shouldRetry(new Error("boom"))).toBe(false);
    expect(limiter.shouldRetry(null)).toBe(false);
  });

  it("honours a custom status code list", () => {
    const limiter = new RateLimiter({ retryStatusCodes: [418] });

    expect(limiter.shouldRetry({ status: 418 })).toBe(true);
    expect(limiter.shouldRetry({ status: 429 })).toBe(false);
  });
});

describe("delay", () => {
  it("grows exponentially and caps at maxDelay without jitter", () => {
    const limiter = new RateLimiter({ jitter: false, maxDelay: 5000 });

    expect(limiter.delay(0)).toBe(1000);
    expect(limiter.delay(2)).toBe(4000);
    expect(limiter.delay(10)).toBe(5000);
  });

  it("applies jitter between half and one and a half of the backoff", () => {
    const limiter = new RateLimiter();

    vi.spyOn(Math, "random").mockReturnValue(0);
    expect(limiter.delay(1)).toBe(1000);

    vi.spyOn(Math, "random").mockReturnValue(0.999);
    expect(limiter.delay(1)).toBe(2998);
  });
});

describe("retry", () => {
  it("returns the first successful result", async () => {
    const limiter = new RateLimiter({ jitter: false });
    const task = vi.fn().mockResolvedValue("ok");

    await expect(limiter.retry(task)).resolves.toBe("ok");
    expect(task).toHaveBeenCalledOnce();
  });

  it("retries retryable failures then succeeds", async () => {
    const limiter = new RateLimiter({ jitter: false, baseDelay: 0 });

    vi.spyOn(limiter, "sleep").mockResolvedValue(undefined);

    const task = vi
      .fn()
      .mockRejectedValueOnce({ status: 429 })
      .mockResolvedValue("ok");

    await expect(limiter.retry(task)).resolves.toBe("ok");
    expect(task).toHaveBeenCalledTimes(2);
    expect(logger.warning).toHaveBeenCalledWith(
      expect.stringContaining("Retry 1/5")
    );
  });

  it("gives up after maxRetries", async () => {
    const limiter = new RateLimiter({ maxRetries: 2, jitter: false });

    vi.spyOn(limiter, "sleep").mockResolvedValue(undefined);

    const task = vi.fn().mockRejectedValue({ status: 500 });

    await expect(limiter.retry(task)).rejects.toEqual({ status: 500 });
    expect(task).toHaveBeenCalledTimes(3);
  });

  it("does not retry non retryable errors", async () => {
    const limiter = new RateLimiter();
    const task = vi.fn().mockRejectedValue(new Error("bad request"));

    await expect(limiter.retry(task)).rejects.toThrow("bad request");
    expect(task).toHaveBeenCalledOnce();
  });
});

describe("execute, batch and queue", () => {
  it("executes a task through the concurrency limiter", async () => {
    const limiter = new RateLimiter();

    await expect(limiter.execute(async () => "value")).resolves.toBe("value");
    expect(limiter.requests).toHaveLength(1);
  });

  it("runs a batch and preserves order", async () => {
    const limiter = new RateLimiter();

    await expect(
      limiter.batch([async () => 1, async () => 2, async () => 3])
    ).resolves.toEqual([1, 2, 3]);
  });

  it("caps concurrency in a batch", async () => {
    const limiter = new RateLimiter({ maxConcurrent: 2 });

    let active = 0;
    let peak = 0;

    const task = async () => {
      active += 1;
      peak = Math.max(peak, active);
      await new Promise((resolve) => setTimeout(resolve, 5));
      active -= 1;
    };

    await limiter.batch([task, task, task, task, task]);

    expect(peak).toBeLessThanOrEqual(2);
  });

  it("runs a queue sequentially", async () => {
    const limiter = new RateLimiter();
    const order: number[] = [];

    await limiter.queue([
      async () => order.push(1),
      async () => order.push(2),
    ]);

    expect(order).toEqual([1, 2]);
  });

  it("returns empty results for empty inputs", async () => {
    const limiter = new RateLimiter();

    await expect(limiter.batch()).resolves.toEqual([]);
    await expect(limiter.queue()).resolves.toEqual([]);
  });
});

describe("reset", () => {
  it("clears recorded requests", async () => {
    const limiter = new RateLimiter();

    await limiter.waitForSlot();
    limiter.reset();

    expect(limiter.requests).toEqual([]);
    expect(logger.info).toHaveBeenCalledWith("Rate limiter reset.");
  });
});

describe("sleep", () => {
  it("resolves after the requested delay", async () => {
    const limiter = new RateLimiter();
    const started = Date.now();

    await limiter.sleep(10);

    expect(Date.now() - started).toBeGreaterThanOrEqual(5);
  });
});
