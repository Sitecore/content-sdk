# Route handling and data fetching

Official: [Route handling and data fetching](https://doc.sitecore.com/sai/en/developers/content-sdk/20/route-handling-and-data-fetching-in-content-sdk-apps.html). Raw: `llm-wiki/raw/2026-05-14-route-handling-data-fetching.md`.

## Model

1. **Content tree → URLs** — hierarchy drives URLs; multisite hostnames; Sitecore URL rules need front-end coordination.
2. **Route resolution** — Next catch-all / App Router dynamic segments; path → Sitecore route.
3. **Data fetch** — **`SitecoreClient`** + GraphQL ([../common/doc-sitecore-client-and-graphql.md](../common/doc-sitecore-client-and-graphql.md)); config from **`sitecore.config`** / **`defineConfig`**.
4. **Rendering** — JSON → **Placeholders** / components; **`getComponentData`** for props.

### Documentation note (LayoutService path)

Official doc may link **`packages/core/.../layout-service.ts`**. In **this repo**, layout GraphQL is **`packages/content/src/layout/layout-service.ts`**, consumed by **`SitecoreClient`** (`packages/content/src/client/sitecore-client.ts`).

## Templates (Next)

- **Pages Router:** `src/pages/[[...path]].tsx` — `extractPath`, `context.preview` → `getPreview` / `getDesignLibraryData` / `getPage`, `getDictionary`, `getComponentData`.
- **App Router:** `src/app/[site]/[locale]/[[...path]]/page.tsx` — **`draftMode()`**, **`getPreviewData(headers)`**, same client branches.

## Related

- [doc-sitecore-client-apis.md](doc-sitecore-client-apis.md)
- [../common/doc-sitecore-client-and-graphql.md](../common/doc-sitecore-client-and-graphql.md)
- [doc-editor-integration-metadata.md](doc-editor-integration-metadata.md)
- [doc-graphql-client-and-edge-urls.md](doc-graphql-client-and-edge-urls.md) — Next dev proxy pointer
