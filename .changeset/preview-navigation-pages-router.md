---
'@sitecore-content-sdk/content': patch
'@sitecore-content-sdk/nextjs': patch
'create-content-sdk-app': minor
---

[Preview] Preserve preview context across client-side navigation in the Pages Router

Sitecore Preview can now be a session rather than a one-off render, so an author keeps preview context while following links. **Opt-in and off by default** — upgrading the packages alone changes no behaviour.

Enable it on the editing render route, and pass the route being rendered to `getPreview()`:

```ts
// pages/api/editing/render.ts
new EditingRenderMiddleware({ previewSession: { enabled: true } }).getHandler();

// pages/[[...path]].tsx
page = context.preview
  ? await client.getPreview(context.previewData, undefined, { path })
  : await client.getPage(path, { locale: context.locale });
```

Both changes are required together: enabling the session without passing `path` makes every navigation re-render the page the session started on. The SDK warns once at runtime if it detects that combination. New apps scaffolded from the Pages Router template get both.

With the session enabled, the Next.js preview cookies persist for its lifetime (`previewSession.maxAge`, default one hour) instead of three seconds, so `getStaticProps` keeps receiving `context.preview` and the session-scoped preview parameters. Because the editing query is item based, `getPreview()` resolves the destination item from its route path on each navigation via the new `PreviewRouteService`. Route-scoped parameters (`sc_itemid`, `sc_version`, `sc_variant`) are re-resolved per route rather than carried, and the variant falls back to the default on navigation. Editing and Design Library renders are unchanged.
