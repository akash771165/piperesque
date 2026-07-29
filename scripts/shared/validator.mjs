import { SEO } from "./constants.mjs";

export function isString(value) {
  return typeof value === "string";
}

export function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function isArray(value) {
  return Array.isArray(value);
}

export function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function validateSlug(slug) {
  return /^[a-z0-9-]+$/.test(slug);
}

export function validateTitle(title) {
  return (
    isNonEmptyString(title) &&
    title.length <= SEO.TITLE_MAX
  );
}

export function validateDescription(description) {
  return (
    isNonEmptyString(description) &&
    description.length <= SEO.DESCRIPTION_MAX
  );
}

export function validateBlog(blog) {
  const errors = [];

  if (!isObject(blog)) {
    errors.push("Blog must be an object.");
    return errors;
  }

  if (!validateSlug(blog.slug ?? "")) {
    errors.push("Invalid slug.");
  }

  if (!validateTitle(blog.title ?? "")) {
    errors.push("Invalid SEO title.");
  }

  if (!validateDescription(blog.description ?? "")) {
    errors.push("Invalid meta description.");
  }

  // Drafts may have empty content.
  if (!isString(blog.content)) {
    errors.push("Content must be a string.");
  }

  // Only published blogs require content.
  if (blog.published === true && !isNonEmptyString(blog.content)) {
    errors.push("Published blog must contain content.");
  }

  if (!isArray(blog.headings ?? [])) {
    errors.push("Headings must be an array.");
  }

  if (!isArray(blog.faq ?? [])) {
    errors.push("FAQ must be an array.");
  }

  return errors;
}

export default {
  validateSlug,
  validateTitle,
  validateDescription,
  validateBlog,
};