import crypto from "node:crypto";

export class TokenCounter {

  constructor(options = {}) {

    this.options = {

      averageCharactersPerToken:

        options.averageCharactersPerToken ??

        4,

      contextWindow:

        options.contextWindow ??

        128000,

      outputReserve:

        options.outputReserve ??

        4000,

      inputReserve:

        options.inputReserve ??

        500,

      costTable:

        options.costTable ?? {

          inputPerMillion: 1.25,

          outputPerMillion: 10.00,

        },

      ...options,

    };

  }

  normalize(text = "") {

    return String(text)

      .replace(/\r\n/g, "\n")

      .replace(/\t/g, " ")

      .replace(/\s+/g, " ")

      .trim();

  }

  characters(text = "") {

    return this.normalize(

      text

    ).length;

  }

  words(text = "") {

    return this

      .normalize(text)

      .split(" ")

      .filter(Boolean)

      .length;

  }

  lines(text = "") {

    return text

      .split("\n")

      .filter(

        line =>

          line.trim()

      )

      .length;

  }

  paragraphs(text = "") {

    return text

      .split(/\n\s*\n/g)

      .filter(

        paragraph =>

          paragraph.trim()

      )

      .length;

  }

  estimate(text = "") {

    const chars =

      this.characters(

        text

      );

    return Math.ceil(

      chars /

      this.options.averageCharactersPerToken

    );

  }

  estimateInput(text = "") {

    return this.estimate(

      text

    );

  }

  estimateOutput(text = "") {

    return this.estimate(

      text

    );

  }

  availableContext(

    usedTokens = 0

  ) {

    return Math.max(

      this.options.contextWindow -

      usedTokens -

      this.options.outputReserve -

      this.options.inputReserve,

      0

    );

  }

  fits(

    prompt,

    expectedOutput = 1500

  ) {

    const input =

      this.estimate(

        prompt

      );

    return (

      input +

      expectedOutput <=

      this.options.contextWindow

    );

  }

  truncate(

    text,

    maxTokens

  ) {

    if (

      this.estimate(text) <=

      maxTokens

    ) {

      return text;

    }

    const limit =

      maxTokens *

      this.options.averageCharactersPerToken;

    return text.slice(

      0,

      limit

    );

  }

  checksum(text) {

    return crypto

      .createHash("sha256")

      .update(text)

      .digest("hex");

  }

  analyze(text = "") {

    return {

      characters:

        this.characters(

          text

        ),

      words:

        this.words(

          text

        ),

      lines:

        this.lines(

          text

        ),

      paragraphs:

        this.paragraphs(

          text

        ),

      estimatedTokens:

        this.estimate(

          text

        ),

      checksum:

        this.checksum(

          text

        ),

    };

  }
    estimateCost(
    inputTokens = 0,
    outputTokens = 0
  ) {

    const inputCost =

      (inputTokens / 1_000_000) *

      this.options.costTable.inputPerMillion;

    const outputCost =

      (outputTokens / 1_000_000) *

      this.options.costTable.outputPerMillion;

    return {

      inputTokens,

      outputTokens,

      inputCost:

        Number(

          inputCost.toFixed(6)

        ),

      outputCost:

        Number(

          outputCost.toFixed(6)

        ),

      totalCost:

        Number(

          (

            inputCost +

            outputCost

          ).toFixed(6)

        ),

    };

  }

  budget(
    prompt,
    expectedOutput = 2000
  ) {

    const input =

      this.estimateInput(
        prompt
      );

    const available =

      this.availableContext(
        input
      );

    return {

      inputTokens:

        input,

      expectedOutput,

      availableTokens:

        available,

      fits:

        this.fits(
          prompt,
          expectedOutput
        ),

    };

  }

  compare(...texts) {

    return texts.map(

      (text, index) => ({

        index,

        ...this.analyze(
          text
        ),

      })

    );

  }

  largest(texts = []) {

    if (

      texts.length === 0

    ) {

      return null;

    }

    return texts.reduce(

      (largest, current) =>

        this.estimate(
          current
        ) >

        this.estimate(
          largest
        )

          ? current

          : largest

    );

  }

  split(
    text,
    maxTokens = 6000
  ) {

    const chunks = [];

    let remaining =

      this.normalize(
        text
      );

    while (

      this.estimate(
        remaining
      ) >

      maxTokens

    ) {

      const size =

        maxTokens *

        this.options.averageCharactersPerToken;

      chunks.push(

        remaining.slice(
          0,
          size
        )

      );

      remaining =

        remaining.slice(
          size
        );

    }

    if (

      remaining.length > 0

    ) {

      chunks.push(
        remaining
      );

    }

    return chunks;

  }

}

export default TokenCounter;