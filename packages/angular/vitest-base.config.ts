import { defineConfig } from 'vitest/config';

/**
 * The Angular test builder defaults to `isolate: false`, so all spec files in a worker share one module registry
 * and one Angular runtime. That shared state makes the suite order-dependent, which may cause issues
 * with mocks and module replacements in unit tests
 * `isolate: true` gives each spec file a fresh module registry and Angular runtime, removing the
 * order dependence entirely.
 */
export default defineConfig({
  test: {
    isolate: true,
  },
});
