# JSS-9247 — Validation results

**Date:** 2026-07-07  
**Command:** `npx tsx ./scripts/llm-context/validate-llm-context.ts` (also `yarn validate-llm-context` after install)

**Prerequisite:** Rebuild templates before scaffold test:

```bash
cd packages/create-content-sdk-app && npm run build
```

The initializer copies from `dist/templates/` (not `src/templates/`). Without rebuild, scaffold ships stale monolithic guidance.

---

## Gate 1: Budget check ✅

`measure-llm-context:check` — all targets within budget:

| Target | S0 | Total |
|--------|-----|-------|
| `nextjs` | 8.9 KB | 40.4 KB |
| `nextjs-app-router` | 10.3 KB | 44.7 KB |
| `nextjs-app-router-cache-components` | 12.0 KB | 57.6 KB |
| `monorepo-root` | 6.5 KB | 38.2 KB |

---

## Gate 2: Scaffold test ✅

Generated all 3 templates to `.tmp/llm-context-scaffold-test/` with `noInstall: true`.

Verified per scaffolded app:

- Required slim corpus files ship (`.agents/docs/`, skills, cursor rules, thin S3 pointers)
- Exactly **one** `alwaysApply: true` cursor rule
- `copilot-instructions.md` and `.windsurfrules` are thin pointers (< 3 KB)
- Slim `AGENTS.md` sizes: **7.4 KB**, **8.8 KB**, **10.4 KB** (was ~17–31 KB monolithic)

---

## Gate 3: Functional regression matrix ✅

Guidance corpus (template source + scaffolded copy) contains required patterns for agent tasks:

| Scenario | Templates |
|----------|-----------|
| Add component | all |
| Fix preview | pages / app-router / cache-components |
| Add API route | pages / app-router |
| i18n | pages / app-router |
| Multisite proxy | all |
| SSG | pages (`getPagePaths`) / app-router (`return []`) |
| Cache + OSR | cache-components (`BUILD_VALIDATION_SITE`, revalidate) |

---

## Not automated (manual)

- **Before/after Cursor session token comparison** — reproduce ticket scenario in IDE; S0 reduction is ~60%+ per measurement script.

---

## CI recommendation

Add to pipeline (after `create-content-sdk-app` build):

```bash
yarn validate-llm-context
```
