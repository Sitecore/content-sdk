# JSS-9247 — Accuracy pass report

**Date:** 2026-07-07  
**Branch:** `feature/JSS-9247-reduce-llm-context-bloat`  
**Method:** Compare slimmed `.agents/docs/`, `AGENTS.md`, and `SKILL.md` cards against `dev` branch `AGENTS.md` **and** template source (`src/proxy.ts`, `page.tsx`, `not-found.tsx`, etc.).

---

## Summary

| Template | High-risk areas checked | Regressions found | Fixed |
|----------|-------------------------|-------------------|-------|
| `nextjs-app-router` | SSG, preview, proxy, setRequestLocale, component-map, not-found | 4 (3 inherited from `dev`) | ✅ |
| `nextjs-app-router-cache-components` | BUILD_VALIDATION_SITE, cache helpers, revalidate, proxy | 0 | — |
| `nextjs` (Pages Router) | getStaticPaths, proxy, component-map, preview | 1 (inherited from `dev`) | ✅ |

**Cache-components template:** Slimmed docs match `dev` and source for all high-risk items. No changes required.

---

## Findings and fixes

### 1. App Router preview data source (fixed)

**Issue:** Docs said preview uses `searchParams`; actual `page.tsx` uses:

```typescript
const headers = await nextHeaders();
const previewData = client.getPreviewData(headers);
```

**Impact:** Agents could implement preview incorrectly.  
**Source of error:** Present on `dev` `AGENTS.md` too.  
**Fixed in:** `AGENTS-key-concepts.md`, `AGENTS-router-specifics.md`, `AGENTS.md`, skills (`content-sdk-graphql-data-fetching`, `content-sdk-editing-safe-rendering`, `content-sdk-troubleshoot-editing`), `Skills.md`, `generate-slim-skills.ts`.

**Note:** Cache-components template correctly uses `searchParams` — different `page.tsx` implementation.

### 2. App Router proxy chain incomplete (fixed)

**Issue:** Docs listed `LocaleProxy → AppRouterMultisiteProxy → RedirectsProxy → PersonalizeProxy` only.  
**Source:** `src/proxy.ts` runs `defineProxy(preview, botTracking, locale, multisite, redirects, personalize)`.

**Impact:** Agents might omit or reorder PreviewProxy/BotTrackingProxy.  
**Source of error:** Incomplete on `dev` for app-router (cache-components `dev` AGENTS was correct).  
**Fixed in:** `AGENTS-key-concepts.md`, `AGENTS-router-specifics.md`, `AGENTS.md`, multisite skill, `Skills.md`, generator.

### 3. App Router segment not-found guidance (fixed)

**Issue:** Slim `AGENTS.md` DO/DON'T and best practices referenced `parseRewriteHeader(headers())` for not-found.  
**Source:** Segment `not-found.tsx` uses `getCachedPageParams()`; segment `layout.tsx` calls `setCachedPageParams({ site, locale })`.

**Impact:** Agents could call `headers()` in not-found and break SSG.  
**Source of error:** `dev` quick-checks line was wrong; `dev` router-specifics not-found section was correct.  
**Fixed in:** `AGENTS.md`, `AGENTS-router-specifics.md`, `AGENTS-key-concepts.md`, troubleshoot skill.

### 4. Component map auto-generation detail (restored)

**Issue:** Slim docs shortened to "auto-generated from `src/components/`" without watch/build and Server/Client split.  
**Fixed in:** `AGENTS.md` (app-router + pages), `AGENTS-key-concepts.md`, `AGENTS-router-specifics.md`.

### 5. Pages Router proxy chain incomplete (fixed)

**Issue:** Docs listed `MultisiteProxy → RedirectsProxy → PersonalizeProxy` only.  
**Source:** `src/proxy.ts` runs `defineProxy(preview, botTracking, multisite, redirects, personalize)`.

**Fixed in:** `AGENTS-key-concepts.md`, `AGENTS-router-specifics.md`, `AGENTS.md`, pages multisite skill, generator.

---

## Verified correct (no changes)

### SSG — `nextjs-app-router`

- `generateStaticParams`: `getAppRouterStaticParams` when `NODE_ENV !== 'development'` && `scConfig.generateStaticPaths`; else `return []`.
- Matches `page.tsx` and `dev` AGENTS.

### SSG — `nextjs-app-router-cache-components`

- When `generateStaticPaths` false: `BUILD_VALIDATION_SITE` (`_DEFAULT_`) placeholder — never `return []`.
- Page calls `isBuildValidationSite(site)`, seeds `setCachedPageParams`, skips Edge.
- Documented in `AGENTS-router-specifics.md`, `AGENTS-key-concepts.md`, cache skill.

### setRequestLocale

- All templates: `setRequestLocale(\`${site}_{locale}\`)` at top of page; `request.ts` parses `requestLocale`.
- Preserved in slim `AGENTS.md` and layered docs.

### Cache-components specifics

- Cache helpers (`getSitecorePage`, `getSitecoreDictionary`, `getSitecoreErrorPage`) for non-preview reads.
- Preview via `client.*` directly (not cache helpers).
- `POST /api/revalidate`, `SITECORE_REVALIDATE_SECRET`, dictionary cache disabled in `sitecore.config.ts`.
- Segment layout + `setCachedPageParams` / `getCachedPageParams` flow documented.

### Pages Router SSG/SSR

- `getStaticPaths` / `getPagePaths`, `extractPath(context)`, `context.locale`, `getComponentData` — preserved in `.agents/docs/`.

---

## Quality note

Several inaccuracies were **inherited from `dev`** (preview via searchParams, incomplete proxy chains, parseRewriteHeader in quick-checks). The accuracy pass corrected them against **source code**, improving guidance beyond a pure `dev` parity check.

---

## Post-fix validation

- `npx tsx ./scripts/llm-context/measure-llm-context.ts --check` — all targets within budget after fixes.
- Next: functional regression matrix (scaffold test + agent task scenarios).
