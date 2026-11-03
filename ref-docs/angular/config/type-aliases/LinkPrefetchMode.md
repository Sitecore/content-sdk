[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [config](../README.md) / LinkPrefetchMode

# Type Alias: LinkPrefetchMode

> **LinkPrefetchMode** = `"eager"` \| `"hover"` \| `"off"`

Defined in: [packages/angular/src/config/define-config.ts:13](https://github.com/Sitecore/content-sdk/blob/e2bacaf0f5c83b2db3fd8f4245136fda44d91dad/packages/angular/src/config/define-config.ts#L13)

Link-prefetch strategy for `scRouterLink`/`scRichText` links:
- `'eager'` (default) — prefetch as soon as the link renders.
- `'hover'` — prefetch only once the pointer dwells on the link (see `delayMs`); starts
  disabled and is enabled the moment the user shows intent.
- `'off'` — never prefetch.
