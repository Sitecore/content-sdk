import { defineConfig } from 'vitest/config';

/**
 * Base Vitest config, loaded by the `@angular/build:unit-test` builder via `runnerConfig: true` in
 * angular.json.
 *
 * The builder defaults to `isolate: false`, so all spec files in a worker share one module registry
 * and one Angular runtime. That shared state makes the suite order-dependent, which is why it passes
 * locally (single worker, one file order) but fails on CI (multiple workers distribute files into
 * different per-worker orders). Two failure modes surface under an adversarial order:
 *  - registry pollution: a spec that loads a real workspace module (e.g. redirects-middleware.spec
 *    loading real `@sitecore-content-sdk/core`) before a sibling spec registers its `vi.mock`
 *    silently defeats that mock (personalize-middleware's real `initContentSdk` runs on CI).
 *  - global runtime state: `sitecore-analytics.spec` calls `enableProdMode()`, which only sticks if
 *    it runs before any other Angular bootstrap; otherwise `isDevMode()` stays true and analytics
 *    short-circuits.
 *
 * `isolate: true` gives each spec file a fresh module registry and Angular runtime, removing the
 * order dependence entirely so both failure modes disappear. Verified against a single-worker,
 * fixed-adversarial-order repro: the suite fails under `isolate: false` and passes under
 * `isolate: true`, regardless of file order. Cheaper alternatives were rejected — `vi.resetModules`
 * introduces new failures (breaks TestBed/decorator identity), and mock resets have no effect
 * (the leak is module/runtime state, not spies).
 */
export default defineConfig({
  test: {
    isolate: true,
  },
});
