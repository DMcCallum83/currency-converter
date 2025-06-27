import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
    globals: true,
    coverage: {
      provider: "istanbul",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/**",
        "src/test-setup.ts",
        "src/mocks/**",
        "**/*.test.ts",
        "**/*.test.tsx",
        "**/*.spec.ts",
        "**/*.spec.tsx",
        "**/*.config.ts",
        "**/*.config.js",
        "coverage/**",
        "dist/**",
        "build/**",
        "public/**",
        "index.html",
        "vite.config.ts",
        "vitest.config.ts",
        "tsconfig*.json",
        "package.json",
        "package-lock.json",
        "README.md",
        "PLAN.md",
        "PLAN_PROGRESS.md",
        "TDS JS Task README.md",
      ],
    },
    css: true,
  },
});
