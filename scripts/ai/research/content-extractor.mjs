import * as cheerio from "cheerio";

import logger from "../../shared/logger.mjs";

export class ContentExtractor {

  constructor(options = {}) {

    this.options = {

      removeScripts:

        options.removeScripts ??

        true,

      removeStyles:

        options.removeStyles ??

        true,

      removeNavigation:

        options.removeNavigation ??

        true,

      removeFooter:

        options.removeFooter ??

        true,

      removeHeader:

        options.removeHeader ??

        false,

      minimumLength:

        options.minimumLength ??

        300,

      ...options,

    };

  }

  extract(html) {

    const $ = cheerio.load(html);

    if (

      this.options.removeScripts

    ) {

      $("script").remove();

    }

    if (

      this.options.removeStyles

    ) {

      $("style").remove();

    }

    if (

      this.options.removeNavigation

    ) {

      $("nav,aside").remove();

    }

    if (

      this.options.removeFooter

    ) {

      $("footer").remove();

    }

    if (

      this.options.removeHeader

    ) {

      $("header").remove();

    }

    const title =

      $("title")

        .first()

        .text()

        .trim();

    const metaDescription =

      $('meta[name="description"]')

        .attr("content") ??

      "";

    const headings =

      $("h1,h2,h3")

        .map(

          (_, element) =>

            $(element)

              .text()

              .trim()

        )

        .get()

        .filter(Boolean);

    const paragraphs =

      $("p")

        .map(

          (_, element) =>

            $(element)

              .text()

              .trim()

        )

        .get()

        .filter(

          paragraph =>

            paragraph.length >=

            this.options.minimumLength / 10

        );

    const content =

      paragraphs.join(

        "\n\n"

      );

    logger.info(

      `Extracted ${paragraphs.length} paragraphs.`

    );

    return {

      title,

      description:

        metaDescription,

      headings,

      paragraphs,

      content,

      words:

        content

          .split(/\s+/)

          .filter(Boolean)

          .length,

    };

  }

  extractText(html) {

    return this.extract(

      html

    ).content;

  }

  extractHeadings(html) {

    return this.extract(

      html

    ).headings;

  }
    extractLinks(html) {

    const $ = cheerio.load(html);

    return $("a")

      .map(

        (_, element) => ({

          text:

            $(element)

              .text()

              .trim(),

          href:

            $(element)

              .attr("href") ??

              "",

        })

      )

      .get()

      .filter(

        link =>

          link.href.length > 0

      );

  }

  extractImages(html) {

    const $ = cheerio.load(html);

    return $("img")

      .map(

        (_, element) => ({

          src:

            $(element)

              .attr("src") ??

              "",

          alt:

            $(element)

              .attr("alt") ??

              "",

        })

      )

      .get()

      .filter(

        image =>

          image.src.length > 0

      );

  }

  extractMetadata(html) {

    const $ = cheerio.load(html);

    return {

      title:

        $("title")

          .text()

          .trim(),

      description:

        $('meta[name="description"]')

          .attr("content") ??

          "",

      keywords:

        $('meta[name="keywords"]')

          .attr("content") ??

          "",

      canonical:

        $('link[rel="canonical"]')

          .attr("href") ??

          "",

      language:

        $("html")

          .attr("lang") ??

          "",

    };

  }

  summarize(html) {

    const data =

      this.extract(

        html

      );

    return {

      title:

        data.title,

      words:

        data.words,

      headings:

        data.headings.length,

      paragraphs:

        data.paragraphs.length,

      preview:

        data.content.slice(

          0,

          300

        ),

    };

  }

}

export default ContentExtractor;