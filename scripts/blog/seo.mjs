import { SEO } from "../shared/constants.mjs";

function truncate(text, maxLength) {
  if (text.length <= maxLength) return text;

  return text.slice(0, maxLength - 3).trimEnd() + "...";
}

export function generateTitle(keyword, city = "Houston") {
  const title = `${keyword} | 24/7 Plumbing Services in ${city}`;

  return truncate(title, SEO.TITLE_MAX);
}

export function generateDescription(keyword, city = "Houston") {
  const description =
    `Need ${keyword.toLowerCase()} in ${city}? ` +
    `PipeResque provides fast, licensed, and reliable plumbing services with 24/7 emergency support.`;

  return truncate(description, SEO.DESCRIPTION_MAX);
}

export default {
  generateTitle,
  generateDescription,
};