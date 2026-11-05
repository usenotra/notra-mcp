import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: ["build/**", "node_modules/**"],
    execArgv: ["--import", "zod/compile"],
    restoreMocks: true,
    unstubEnvs: true,
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: ["src/types/**"],
    },
  },
});
