import { slugify } from "./slugify.mjs";
import { generateTitle, generateDescription } from "./seo.mjs";

function normalizeCity(city) {
  const value = city.trim().toLowerCase();

  if (value === "houston") return "Houston TX";
  if (value === "katy") return "Katy TX";
  if (value === "cypress") return "Cypress TX";
  if (value === "sugar land") return "Sugar Land TX";

  return city;
}

export function createBlogTemplate({
  keyword,
  city = "Houston",
  service = "Plumbing",
}) {
  const normalizedCity = normalizeCity(city);

  const slug = slugify(`${keyword} ${normalizedCity}`);

  return {
    slug,

    title: generateTitle(keyword, city),

    description: generateDescription(keyword, city),

    keyword,

    city,

    service,

    author: "PipeResque",

    published: false,

    headings: [],

    faq: [],

    content: "",

    createdAt: new Date().toISOString(),

    updatedAt: new Date().toISOString(),
  };
}

export default createBlogTemplate;