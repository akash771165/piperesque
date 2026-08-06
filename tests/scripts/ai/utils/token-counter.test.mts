import crypto from "node:crypto";

import { afterEach, describe, expect, it, vi } from "vitest";

import { TokenCounter } from "../../../../scripts/ai/utils/token-counter.mjs";

const counter = new TokenCounter();

afterEach(() => {
  vi.restoreAllMocks();
});

describe("normalize", () => {
  it("collapses whitespace and trims", () => {
    expect(counter.normalize("  a\r\n\tb   c  ")).toBe("a b c");
  });

  it("stringifies non string input", () => {
    expect(counter.normalize(42 as never)).toBe("42");
    expect(counter.normalize()).toBe("");
  });
});

describe("text metrics", () => {
  it("counts normalized characters", () => {
    expect(counter.characters("  ab   cd ")).toBe(5);
  });

  it("counts words", () => {
    expect(counter.words(" one   two\nthree ")).toBe(3);
    expect(counter.words("")).toBe(0);
  });

  it("counts non blank lines", () => {
    expect(counter.lines("a\n\n  \nb")).toBe(2);
  });

  it("counts paragraphs separated by blank lines", () => {
    expect(counter.paragraphs("a\nb\n\nc\n\n\nd")).toBe(3);
  });
});

describe("estimate", () => {
  it("rounds up using the characters per token ratio", () => {
    expect(counter.estimate("abcde")).toBe(2);
    expect(counter.estimate("abcd")).toBe(1);
    expect(counter.estimate("")).toBe(0);
  });

  it("honours a custom ratio", () => {
    expect(new TokenCounter({ averageCharactersPerToken: 2 }).estimate("abcd")).toBe(
      2
    );
  });

  it("shares the estimate for input and output", () => {
    expect(counter.estimateInput("abcde")).toBe(2);
    expect(counter.estimateOutput("abcde")).toBe(2);
  });
});

describe("context accounting", () => {
  it("subtracts reserves from the context window", () => {
    expect(counter.availableContext(1000)).toBe(128000 - 1000 - 4000 - 500);
  });

  it("never returns a negative amount", () => {
    expect(counter.availableContext(500000)).toBe(0);
  });

  it("checks whether a prompt plus output fits", () => {
    const small = new TokenCounter({ contextWindow: 100 });

    expect(small.fits("a".repeat(40), 10)).toBe(true);
    expect(small.fits("a".repeat(400), 10)).toBe(false);
  });

  it("summarises a prompt budget", () => {
    const small = new TokenCounter({
      contextWindow: 1000,
      outputReserve: 100,
      inputReserve: 50,
    });

    expect(small.budget("a".repeat(40), 200)).toEqual({
      inputTokens: 10,
      expectedOutput: 200,
      availableTokens: 840,
      fits: true,
    });
  });
});

describe("truncate", () => {
  it("returns short text untouched", () => {
    expect(counter.truncate("abcd", 10)).toBe("abcd");
  });

  it("cuts text down to the token budget", () => {
    expect(counter.truncate("a".repeat(100), 5)).toBe("a".repeat(20));
  });
});

describe("split", () => {
  it("returns a single chunk when the text fits", () => {
    expect(counter.split("abcd", 10)).toEqual(["abcd"]);
  });

  it("splits normalized text into token sized chunks", () => {
    const chunks = counter.split("a".repeat(30), 2);

    expect(chunks).toEqual(["aaaaaaaa", "aaaaaaaa", "aaaaaaaa", "aaaaaa"]);
  });

  it("returns nothing for empty text", () => {
    expect(counter.split("", 10)).toEqual([]);
  });
});

describe("checksum and analyze", () => {
  it("hashes with sha256", () => {
    const expected = crypto.createHash("sha256").update("abc").digest("hex");

    expect(counter.checksum("abc")).toBe(expected);
  });

  it("reports every metric at once", () => {
    expect(counter.analyze("one two\n\nthree")).toEqual({
      characters: 13,
      words: 3,
      lines: 2,
      paragraphs: 2,
      estimatedTokens: 4,
      checksum: counter.checksum("one two\n\nthree"),
    });
  });
});

describe("estimateCost", () => {
  it("prices input and output tokens", () => {
    expect(counter.estimateCost(1_000_000, 500_000)).toEqual({
      inputTokens: 1_000_000,
      outputTokens: 500_000,
      inputCost: 1.25,
      outputCost: 5,
      totalCost: 6.25,
    });
  });

  it("defaults to zero cost", () => {
    expect(counter.estimateCost()).toMatchObject({ totalCost: 0 });
  });

  it("honours a custom cost table", () => {
    const custom = new TokenCounter({
      costTable: { inputPerMillion: 2, outputPerMillion: 4 },
    });

    expect(custom.estimateCost(1_000_000, 1_000_000).totalCost).toBe(6);
  });
});

describe("compare and largest", () => {
  it("indexes each analyzed text", () => {
    const [first, second] = counter.compare("abcd", "abcdefgh");

    expect(first).toMatchObject({ index: 0, estimatedTokens: 1 });
    expect(second).toMatchObject({ index: 1, estimatedTokens: 2 });
  });

  it("finds the largest text", () => {
    expect(counter.largest(["a", "abcdefgh", "abcd"])).toBe("abcdefgh");
  });

  it("returns null for an empty list", () => {
    expect(counter.largest([])).toBeNull();
    expect(counter.largest()).toBeNull();
  });
});
