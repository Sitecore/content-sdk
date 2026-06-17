# Critical Review: Middleware Matcher Refactor

**Scope reviewed:** the changes from the prior prompt — extracting `BaseMiddlewareOptions`, adding `MiddlewareMatcher` / `shouldProcessPath`, and rewiring `multisite-middleware.ts` and `personalize-middleware.ts`.

**Verdict:** The shape of the refactor is sound (shared options type + shared path matcher is the right direction and matches the request). However, the implementation introduces a **confirmed behavioral regression**, ships a **hand-rolled glob matcher that fails its own documented examples**, and was **never actually validated against the test suite**. Several of these are blocking.

Findings are ordered by severity with evidence. A "Suggested fixes" section follows.

---

## CRITICAL

### C1. Static-file exclusion was dropped — regression + spec failure
The original `personalize-middleware.ts` skipped static assets with `path.includes('.')`:

```ts
// before
if (path.startsWith('/api') || path.startsWith('/sitecore') || path.includes('.')) return next();
```

The refactor replaced this with `shouldProcessPath`, whose `DEFAULT_EXCLUDE_PATTERNS` is only:

```ts
const DEFAULT_EXCLUDE_PATTERNS = ['/api/**', '/sitecore/**'];
```

There is **no static-file rule**. Consequences:
- `personalize-middleware.spec.ts:231-240` explicitly asserts `/assets/logo.png` is skipped (`getPersonalizeInfo` not called). With this change the matcher returns `true` for that path, so the middleware runs and the test **fails**. Verified by reproducing the matcher logic.
- In production, `express.static` is mounted **after** these middlewares in `server.ts`, so every `.png`/`.css`/`.js`/`.ico`/`.woff` request now reaches the personalize path and fires a `getPersonalizeInfo` / Edge call. This is a correctness **and** performance regression (wasted CDP/Edge traffic on assets).
- The JSDoc on `shouldProcessPath` even claims it applies *"default exclusions (API, Sitecore, **static files**, editing/preview)"* — the implementation does not match its own contract.

**Severity:** Breaks an existing test and changes production behavior.

### C2. The hand-rolled glob matcher is incorrect (fails its own documented examples)
`matches()` is a bespoke string matcher. Empirically tested:

| path | pattern | expected | actual |
|---|---|---|---|
| `/foo/bar.json` | `/**/*.json` *(documented `excludePaths` example)* | match | **false** |
| `/data.json` | `/**/*.json` *(documented example)* | match | **false** |
| `/api-docs` | `/api/**` | no match | **true** (false positive) |

Root causes:
1. **Destructuring drops segments on multi-`**` patterns.** `pattern.split('/**')` on `/**/admin/**` yields 3 elements; `const [prefix, suffix] = ...` silently discards the third. The documented `shouldProcessPath` example `{ excludePaths: ['/**/admin/**'] }` is therefore unreliable.
2. **`**` uses a literal substring check.** `path.substring(prefix.length).includes(suffix)` is not glob matching. `/**/*.json` becomes "does the path contain the literal substring `/*.json`?" — which no real path does, so it matches nothing.
3. **Prefix matching is not segment-aware.** `path.startsWith('/api')` matches `/api-docs`, `/apiv2`, etc. (The original `startsWith('/api')` had the same flaw, but the new code is *presented* as a general glob engine and documents `**`/`*` semantics it doesn't honor.)

Re-implementing glob matching by hand is the wrong call when correct, vetted libraries (`minimatch`, `picomatch`) are already in the dependency tree transitively. At minimum, the matcher must pass the examples in its own JSDoc.

**Severity:** The public, load-bearing utility produces wrong answers for documented inputs.

---

## HIGH

### H1. The new shared utility has zero tests; multisite spec is stubs
`middleware-matcher.ts` — now the gatekeeper for two (soon three) middlewares — has **no spec file**. `multisite-middleware.spec.ts` is almost entirely empty `it('...', () => {})` stubs (only one real assertion). So the most reusable, highest-leverage piece of the refactor is completely uncovered, which is exactly how C1/C2 slipped through. A `middleware-matcher.spec.ts` table test would have caught both critical bugs immediately.

### H2. The refactor was never validated — build is red
`npm test` for the package fails to compile (unrelated `componentVariantIds` / `referrer` / `MiddlewareRequest` errors in files I did not touch — `utils.ts`, `*.spec.ts`, `loader-spec-helpers.ts`). Because Angular compiles the whole package, the middleware specs **never ran**. The earlier claim that the refactor "is compilation-ready / tests are pre-existing failures" is only half true: my files compile, but I could not demonstrate the refactor's own tests pass. Any refactor that can't be exercised by its tests is unverified by definition.

### H3. `enabled` default is documented backwards
```ts
/** @default true */
enabled?: boolean;
```
Both middlewares do `if (!options.enabled) return next()`. So omitting `enabled` yields `undefined` → disabled — the **opposite** of the documented `@default true`. Either default it explicitly (`options.enabled ?? true`) or fix the JSDoc. As written it's a trap.

---

## MEDIUM

### M1. `@internal` symbol exported on the public barrel
`isEditingPreview` is annotated `@internal` but is re-exported from `middleware/index.ts` (and thus the package surface). `@internal` + public export is contradictory and will confuse api-extractor. Pick one.

### M4. Default exclusions are non-overridable
`excludePaths` is evaluated **before** `includePaths`, and `DEFAULT_EXCLUDE_PATTERNS` always wins. A consumer who wants one `/api/*` route processed (e.g. `includePaths: ['/api/preview']`) cannot — the default `/api/**` exclusion silently shadows it. document this precedence loudly

### M5. Spec vs implementation drift left unreconciled
`personalize-middleware.spec.ts` tests bot handling (`skipForBot`, `BOT_DETECTION_COOKIE`, lines 253-266) that the middleware **does not implement**. Remove bot specs

---

## LOW / polish

- **L1. Residual duplication.** Both middlewares still repeat the `req.headers[SC_PARAMS_HEADER] = JSON.stringify(req.scParams)` write-back. A `writeScParams(req)` helper would DRY the part of the duplication that actually matters at runtime (the options-type overlap was addressed; this sibling duplication wasn't).
- **L2. Matcher gaps.** No handling of `?`, character classes, trailing slashes, query strings, or case sensitivity — all unspecified. If a real lib is adopted these come for free.
- **L3. Error handling.** `console.log('… failed:')` + `console.log(error)` (pre-existing) should move to the `debug` namespace for consistency; surfacing raw `console.log` in a library is noisy.
- **L4. Tree hygiene.** A stray `preview-render-middleware copy.ts` exists in the middleware folder (not from this refactor, but worth removing before PR).

---

## Suggested fixes (prioritized)

1. **Restore static-file exclusion (C1).** Add a default rule equivalent to "last path segment contains a dot", e.g. exclude when `/\.[^/]+$/.test(path)`, or a `*.{js,css,png,...}` pattern that the matcher actually supports. Re-run `personalize-middleware.spec.ts`.
2. **Replace the bespoke matcher (C2).** Prefer `picomatch`/`minimatch` (already transitively present) behind the same `shouldProcessPath` signature; or, if a dependency is unwanted, write a small **segment-aware** matcher and cover it with a table-driven spec that includes every example in the JSDoc. The acceptance bar: the matcher must pass its own documented examples.
3. **Add `middleware-matcher.spec.ts` (H1)** — table tests for includes/excludes/defaults/preview, plus the C2 cases as regression guards.
4. **Make the suite runnable (H2)** before claiming completion — either fix or isolate the unrelated compile errors and actually run the two middleware specs green.
5. **Fix the `enabled` default (H3)** — `const enabled = options.enabled ?? true;` and align the JSDoc.
6. **Resolve `@internal` vs export (M1)**, add a **changeset + api-extractor** pass (M2).
7. **Decouple preview gating from path matching (M3)** and document exclusion precedence / overridability (M4).
8. **Reconcile the bot-detection spec (M5)** — implement `skipForBot` on `BaseMiddlewareOptions` or remove the dead expectations.

---

## What was done well

- The **direction** is correct: a shared `BaseMiddlewareOptions` and a single matcher is exactly the right consolidation, and it sets up the future redirects middleware cleanly.
- The `{ includePaths, excludePaths }` shape matches the request and the Next.js `proxy.ts` mental model.
- Skip-precedence (`enabled` → path match → `skip` predicate) reads clearly in both middlewares, and the duplicated literal `/api` / `/sitecore` / preview checks were genuinely removed from the call sites.
- Type wiring (extending `BaseMiddlewareOptions`, exporting the option types) is clean and improves discoverability.

The bones are right; the matcher implementation and its test coverage are what need another pass before this is mergeable.
