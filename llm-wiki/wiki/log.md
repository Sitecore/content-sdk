# Wiki log (append-only)

Chronological record of ingests, major queries, and lint passes. New entries at the **top** (after this paragraph) or bottom — pick one convention and keep it; default here is **newest first** after the title block.

Prefix suggestion for parseability: `## [YYYY-MM-DD] ingest | <short title>` / `query |` / `lint |`

---

## [2026-05-14] wiki | Common wiki — config, env, SitecoreClient + GraphQL

Extracted framework-agnostic material from **Next.js** wiki into **`common/doc-sitecore-config-input.md`**, **`common/doc-config-environment-variables.md`**, **`common/doc-sitecore-client-and-graphql.md`**. Trimmed **`content-sdk-nextjs/doc-sitecore-config.md`**, **`doc-graphql-client-and-edge-urls.md`**, **`doc-sitecore-client-apis.md`** to Next-specific deltas; pointed **`doc-architecture-edge-graphql`**, **`doc-route-handling-data-fetching`**, **`overview-content-sdk`**, root **`index.md`** at **common**. Expanded **Angular** env + `sitecore.config` pages and **`doc-example-environment-variable-files`** (Angular **`CSDK_PUBLIC_*`**).

## [2026-05-14] wiki | Angular design PDF — split wiki + binary in repo

Copied **`JSS-Angular-Live-Design-Doc-140526-211917.pdf`** to **`llm-wiki/raw/design/`**. Split architecture into subsection pages under **`content-sdk-angular/`**; **`doc-architecture-loaders-and-ssr.md`** is now an index hub. Raw extract frontmatter **`pdf_in_repo`** updated. **`content-sdk-angular/index.md`** and **`log.md`** updated.

## [2026-05-14] ingest | JSS-Angular Live Design PDF (architecture)

Extracted *JSS-Angular Live Design Doc-140526-211917.pdf* → `raw/2026-05-14-jss-angular-live-design-architecture.md`. Added `content-sdk-angular/doc-architecture-loaders-and-ssr.md` and updated `content-sdk-angular/index.md` (catalog + sources).

## [2026-05-14] ingest + wiki | Example env files + next-intl / Pages Router i18n

Ingested `example-environment-variable-files.html` and `internationalization-using-next-intl.html` → `raw/2026-05-14-example-environment-variable-files.md`, `raw/2026-05-14-internationalization-using-next-intl.md`. Added `content-sdk-nextjs/doc-example-environment-variable-files.md`. Expanded `doc-i18n-multilingual.md` with App Router (`next-intl`) summary from raw + **Pages Router** code: `next.config.js` i18n, `extractPath`, `[[...path]].tsx` locale/dictionary, `_app.tsx` `next-localization`, error pages. Updated `index.md`, `overview-content-sdk.md`, `source-ingest`, `doc-sitecore-config` cross-link.

## [2026-05-14] wiki | Restore `content-sdk-nextjs/` (wiki not in git)

Previous **`llm-wiki/wiki/**`** markdown was **lost** (untracked + accidental delete). Recreated **13 pages** under **`wiki/content-sdk-nextjs/`** from `llm-wiki/raw/*` + monorepo source (config, GraphQL factory, `SitecoreClient`, route/editor topics). Hub **`wiki/index.md`** now points to **`content-sdk-nextjs/`** (removed duplicate **`nextjs/`** folder). Updated **`AGENTS.md`**, **`llm-wiki/README.md`**, raw wiki-alignment paths, **`common/`** and **`content-sdk-angular/`** cross-links.

## [2026-05-14] wiki | doc-sitecore-config — full TypeScript reference

Documented every **`SitecoreConfigInput`** key from `packages/content/src/config/models.ts` (types + purpose): `api.*`, `retries`, `layout`, `dictionary`, `multisite`, `personalize`, `redirects`, **`rewriteMediaUrls`**, **`disableCodeGeneration`**. Added Next-only **`generateStaticPaths`** / **`sitecoreInternalEditingHostUrl`**, and **`SitecoreCliConfigInput`** + **`GenerateMapArgs`** / **`ScaffoldTemplate`**. Clarified multisite **`useCookieResolution`** default via `getNextFallbackConfig`. Index summary updated.

## [2026-05-14] wiki | Code-truth: config pipeline, GraphQL factory, SitecoreClient wiring

Added **`doc-graphql-client-and-edge-urls.md`** (`createGraphQLClientFactory`, Edge URL path, server/browser rules). Expanded **`doc-sitecore-config.md`** (Next `getNextFallbackConfig` → content `defineConfig`, `buildFallbackConfig` env table, `deepMerge` / CLI validation). Expanded **`doc-sitecore-client-apis.md`** (constructor services, `LayoutService` path under `packages/content`, `SitecoreNextjsClient` overrides). Linked architecture wiki; FEaaS row in editor wiki; **`index.md`**, **`overview-content-sdk.md`**, **`source-ingest-2026-05-14-official-docs.md`** updated.

## [2026-05-14] wiki | layout data = GraphQL JSON (no CMS XML framing)

Removed incorrect “layout stored as XML / head avoids XML” wording from `doc-architecture-edge-graphql.md`, `doc-page-composition-placeholders.md`, and `index.md`; aligned `raw/2026-05-14-page-composition-sitecoreai-data.md`. Route-handling wiki bullet rephrased URL rules without implying layout XML. `doc-sitecore-client-apis` “Sitemap XML” kept (sitemap format).

## [2026-05-14] wiki | doc-architecture-edge-graphql corrections

Clarified runtime GraphQL endpoint resolution via `sitecore.config` + env (cross-ref `doc-sitecore-config`, `doc-sitecore-client-apis`); separated Next.js head fetch path from `@sitecore-content-sdk/react`; noted layout service runs through `SitecoreClient`. `package.json` `graphQLEndpointPath` framed as Pages template / doc artifact. Raw `2026-05-14-architecture-overview.md` annotated. Index summary updated.

## [2026-05-14] ingest | The Sitecore configuration file (full)

Re-ingested official topic; replaced `raw/2026-05-14-the-sitecore-configuration-file.md` with full markdown tables. Expanded `wiki/doc-sitecore-config.md` with base/api/services/middleware summaries and code-truth pointers.

## [2026-05-14] ingest | Editor integration using metadata (SAI doc)

Added `raw/2026-05-14-editor-integration-using-metadata.md` (HTML via curl → distilled markdown) and `wiki/doc-editor-integration-metadata.md`. Updated `index.md`, `overview-content-sdk.md` topic map, `source-ingest-2026-05-14-official-docs.md`; cross-link from `doc-route-handling-data-fetching.md`.

## [2026-05-14] ingest | Re-fetch plugins + route-handling (raw)

Automated fetch succeeded for `plugins.html` and `route-handling-and-data-fetching-in-content-sdk-apps.html`. Replaced `raw/2026-05-14-plugins.md` and `raw/2026-05-14-route-handling-data-fetching.md` stubs with snapshots. Updated `doc-plugins-and-adapters.md`, `doc-route-handling-data-fetching.md`, `source-ingest-2026-05-14-official-docs.md`. Noted official doc’s incorrect `LayoutService` GitHub path vs `packages/content/src/layout/`.

## [2026-05-14] wiki | Platform terminology (SAI / XMC / XM Cloud)

Added `doc-terminology-platform-names.md`; linked from `overview-content-sdk`, `index`, `doc-sitecore-config`, and **AGENTS.md** LLM Wiki conventions. Clarifies doc URLs and comments that mix **Sitecore AI**, **SAI**, **XMC**, and **XM Cloud** are equivalent naming for this wiki’s scope.

## [2026-05-14] ingest | Official SAI Content SDK 2.x docs (9 URLs)

Fetched 7 pages successfully; **route handling** and **plugins** URLs returned Cloudflare challenge (snapshots are stubs in `raw/`). Wiki pages added: `doc-sitecore-config`, `doc-architecture-edge-graphql`, `doc-page-composition-placeholders`, `doc-route-handling-data-fetching`, `doc-i18n-multilingual`, `doc-sitecore-client-apis`, `doc-plugins-and-adapters`, `source-ingest-2026-05-14-official-docs`; `overview-content-sdk` updated. Raw snapshots under `llm-wiki/raw/2026-05-14-*.md`.

## [2026-05-14] init | LLM Wiki scaffold

Initial `llm-wiki/` layout and AGENTS.md schema section added. No sources ingested yet.
