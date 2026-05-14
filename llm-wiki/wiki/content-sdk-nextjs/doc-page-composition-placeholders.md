# Page composition and placeholders

From [Page composition in Content SDK apps using SitecoreAI data](https://doc.sitecore.com/sai/en/developers/content-sdk/20/page-composition-in-content-sdk-apps-using-sitecoreai-data.html) plus templates in `packages/create-content-sdk-app/src/templates/nextjs*`.

## Authoring vs runtime

1. **SitecoreAI** — authors compose pages in WYSIWYG; **placeholders** nest **renderings** (components).
2. **App** — root **`Layout`** with a **root placeholder** whose name matches SitecoreAI.
3. **Runtime** — layout arrives as **JSON** from **GraphQL** (Edge or local) via **`SitecoreClient`** / layout service.

## Developer constraints

- Placeholder keys must match authoring.
- Rendering names map to **registered** front-end components (`.sitecore/component-map.ts`).
- **Dynamic placeholders** — supported per product doc; keep names in sync.

## Code anchors

- `packages/react` — `Placeholder`, field components.
- `packages/nextjs` — editing, `getComponentData`, App Router helpers.
- Templates — `Layout.tsx`, `[[...path]].tsx` / App Router `[[...path]]/page.tsx`.

## Related

- [doc-editor-integration-metadata.md](doc-editor-integration-metadata.md)
- [doc-route-handling-data-fetching.md](doc-route-handling-data-fetching.md)

## Raw

- `llm-wiki/raw/2026-05-14-page-composition-sitecoreai-data.md`
