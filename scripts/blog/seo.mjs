import { SEO } from "../shared/constants.mjs";

function truncate(text, maxLength) {
  if (text.length <= maxLength) return text;

  return text.slice(0, maxLength - 3).trimEnd() + "...";
}

export function generateTitle(keyword, city = "Houston") {
  const fullTitle = `${keyword} in ${city}, TX | PipeResque Referral Information`;
  if (fullTitle.length <= SEO.TITLE_MAX) {
    return fullTitle;
  }
  const compactTitle = `${keyword} in ${city}, TX | PipeResque Referral`;
  return truncate(compactTitle, SEO.TITLE_MAX);
}

export function generateDescription(keyword, city = "Houston") {
  const description =
    `Need ${keyword.toLowerCase()} in ${city}? ` +
    `Connect with independent licensed plumbing contractors through PipeResque for prompt referral service.`;

  return truncate(description, SEO.DESCRIPTION_MAX);
}

export default {
  generateTitle,
  generateDescription,
};