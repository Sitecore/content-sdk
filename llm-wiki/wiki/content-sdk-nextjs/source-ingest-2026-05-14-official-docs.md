# Official doc ingest — 2026-05-14

**Initial batch:** nine SitecoreAI Content SDK **2.x** URLs. **Follow-up:** editor integration (metadata); example env files; next-intl (App Router) + i18n wiki merge.

| # | Topic | Raw snapshot | Wiki synthesis |
|---|--------|----------------|-----------------|
| 1 | Content SDK for SitecoreAI | `raw/2026-05-14-sitecore-content-sdk-for-sitecoreai.md` | `content-sdk-nextjs/overview-content-sdk.md` |
| 2 | Sitecore configuration file | `raw/2026-05-14-the-sitecore-configuration-file.md` | `content-sdk-nextjs/doc-sitecore-config.md` |
| 3 | Architecture overview | `raw/2026-05-14-architecture-overview.md` | `content-sdk-nextjs/doc-architecture-edge-graphql.md` |
| 4 | Page composition | `raw/2026-05-14-page-composition-sitecoreai-data.md` | `content-sdk-nextjs/doc-page-composition-placeholders.md` |
| 5 | Route handling & data fetching | `raw/2026-05-14-route-handling-data-fetching.md` | `content-sdk-nextjs/doc-route-handling-data-fetching.md` |
| 6 | Multilingual | `raw/2026-05-14-supporting-multilingual-applications.md` | `content-sdk-nextjs/doc-i18n-multilingual.md` |
| 7 | Services and APIs | `raw/2026-05-14-content-sdk-services-and-apis.md` | `content-sdk-nextjs/doc-sitecore-client-apis.md` |
| 8 | Plugins | `raw/2026-05-14-plugins.md` | `content-sdk-nextjs/doc-plugins-and-adapters.md` |
| 9 | Adapters | `raw/2026-05-14-adapters.md` | `content-sdk-nextjs/doc-plugins-and-adapters.md` |
| 10 | Editor integration using metadata | `raw/2026-05-14-editor-integration-using-metadata.md` | `content-sdk-nextjs/doc-editor-integration-metadata.md` |
| 11 | Example environment variable files | `raw/2026-05-14-example-environment-variable-files.md` | `content-sdk-nextjs/doc-example-environment-variable-files.md` |
| 12 | Internationalization using next-intl | `raw/2026-05-14-internationalization-using-next-intl.md` | `content-sdk-nextjs/doc-i18n-multilingual.md` (merged with Pages Router code) |

**Code-truth supplements:** `doc-sitecore-config.md` (Next `defineConfig` pipeline; full **`SitecoreConfigInput`** / env / GraphQL in **`../common/`**), `doc-graphql-client-and-edge-urls.md` (Next hub → **`../common/doc-sitecore-client-and-graphql.md`**), `doc-sitecore-client-apis.md` (Next `SitecoreNextjsClient`; base client in **common**), architecture + editor pages (template vs doc deltas).

**Catalog:** [content-sdk-nextjs/index.md](index.md)
