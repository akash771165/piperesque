import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./"),
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.{ts,mts,mjs}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "lcov"],
      include: ["lib/**", "scripts/**"],
      // Static content and prompt text carry no logic to cover.
      exclude: [
        "lib/data/**",
        "lib/config/**",
        "scripts/ai/architecture/**",
        "scripts/ai/prompts/**",
      ],
    },
  },
});
