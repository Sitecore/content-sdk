[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [layout](../README.md) / getThemingStylesheetLinks

# Function: getThemingStylesheetLinks()

> **getThemingStylesheetLinks**(`options`): [`HTMLLink`](../../index/type-aliases/HTMLLink.md)[]

Defined in: [content/src/layout/theming.ts:78](https://github.com/Sitecore/content-sdk/blob/bd4d0720071b7055a086bf071f7474f03927a82d/packages/content/src/layout/theming.ts#L78)

Returns `<link>` elements for Sitecore design-token theming.
Independent from Design Library stylesheets (`getDesignLibraryStylesheetLinks`).
Emits the site-level stylesheet when mode is `site` and `siteName` plus `clientContextId` are provided.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`ThemingStylesheetLinksOptions`](../type-aliases/ThemingStylesheetLinksOptions.md) | Theming options |

## Returns

[`HTMLLink`](../../index/type-aliases/HTMLLink.md)[]

Theme stylesheet links
