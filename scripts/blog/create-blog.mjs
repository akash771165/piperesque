import path from "node:path";
import { createBlogTemplate } from "./template.mjs";
import { validateBlog } from "../shared/validator.mjs";
import {
  fileExists,
  writeJsonSafe,
} from "../shared/file-system.mjs";
import { BLOGS_DIR } from "../shared/paths.mjs";
import { info, success, error } from "../shared/logger.mjs";

const keyword = process.argv[2];
const city = process.argv[3] ?? "Houston";

if (!keyword) {
  console.log("Usage:");
  console.log('node scripts/blog/create-blog.mjs "Emergency Drain Cleaning" "Houston"');
  process.exit(1);
}

try {
  info(`Generating blog for "${keyword}"`);

  const blog = createBlogTemplate({
    keyword,
    city,
  });

  const errors = validateBlog(blog);

  if (errors.length > 0) {
    error(errors.join(", "));
    process.exit(1);
  }

  const filePath = path.join(BLOGS_DIR, `${blog.slug}.json`);

  if (fileExists(filePath)) {
    error(`Blog already exists: ${filePath}`);
    process.exit(1);
  }

  writeJsonSafe(filePath, blog);

  success("Blog created successfully.");
  console.log(filePath);
} catch (err) {
  error(err.message);
  console.error(err);
  process.exit(1);
}