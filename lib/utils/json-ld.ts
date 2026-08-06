/**
 * Serializes a value for embedding inside a <script type="application/ld+json">
 * tag. Characters that could terminate the script element or break the
 * surrounding HTML are escaped as unicode sequences.
 */
export function jsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
