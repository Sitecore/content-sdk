---
name: content-sdk-editing-safe-rendering
description: Preview/editing for Pages Router via context.preview and context.previewData in [[...path]].tsx.
---

# Editing-safe rendering (Pages Router)

**Detail:** [AGENTS-router-specifics.md#routing-and-data-fetching](../../docs/AGENTS-router-specifics.md#routing-and-data-fetching)

## When

- Editing or preview broken
- Component must work in Page Editor or design library

## Rules

- Use `context.preview` / `context.previewData` in getStaticProps/getServerSideProps
- When preview: `client.getPreview(context.previewData)` or `getDesignLibraryData(context.previewData)`

## Stop

- Stop if changing preview flow would break editing API routes

Docs: [Content SDK](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html).
