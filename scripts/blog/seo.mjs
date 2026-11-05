import { SEO } from "../shared/constants.mjs";

function truncate(text, maxLength) {
  if (text.length <= maxLength) return text;

  return text.slice(0, maxLength - 3).trimEnd() + "...";
}

export function generateTitle(keyword, city = "Houston") {
  const title = `${keyword} in ${city}, TX | PipeResque Referral Information`;

  return truncate(title, SEO.TITLE_MAX);
}

export function generateDescription(keyword, city = "Houston") {
  const description =
    `Need ${keyword.toLowerCase()} in ${city}? ` +
    `PipeResque shares plumbing information and helps homeowners contact independent plumbing service providers in ${city}, TX. Call (877) 364-0861 to discuss referral options.`;

  return truncate(description, SEO.DESCRIPTION_MAX);
}

export default {
  generateTitle,
  generateDescription,
};