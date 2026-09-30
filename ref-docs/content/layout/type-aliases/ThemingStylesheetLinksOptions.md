[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [layout](../README.md) / ThemingStylesheetLinksOptions

# Type Alias: ThemingStylesheetLinksOptions

> **ThemingStylesheetLinksOptions** = `object`

Defined in: [content/src/layout/theming.ts:49](https://github.com/Sitecore/content-sdk/blob/d8ef09ee24ff4e01fb1e538a88aebba13f3fe89b/packages/content/src/layout/theming.ts#L49)

Options for [getThemingStylesheetLinks](../functions/getThemingStylesheetLinks.md).

## Properties

### clientContextId?

> `optional` **clientContextId?**: `string`

Defined in: [content/src/layout/theming.ts:63](https://github.com/Sitecore/content-sdk/blob/d8ef09ee24ff4e01fb1e538a88aebba13f3fe89b/packages/content/src/layout/theming.ts#L63)

Client Edge context ID used as `contextID` on the theme URL.
No site link is emitted without it.

***

### mode

> **mode**: [`ThemingMode`](../../config/type-aliases/ThemingMode.md)

Defined in: [content/src/layout/theming.ts:53](https://github.com/Sitecore/content-sdk/blob/d8ef09ee24ff4e01fb1e538a88aebba13f3fe89b/packages/content/src/layout/theming.ts#L53)

Theming mode from `sitecore.config` `theming.mode`.

***

### sitecoreEdgeUrl?

> `optional` **sitecoreEdgeUrl?**: `string`

Defined in: [content/src/layout/theming.ts:67](https://github.com/Sitecore/content-sdk/blob/d8ef09ee24ff4e01fb1e538a88aebba13f3fe89b/packages/content/src/layout/theming.ts#L67)

Sitecore Edge Platform URL used as the theme host.

***

### siteName?

> `optional` **siteName?**: `string`

Defined in: [content/src/layout/theming.ts:58](https://github.com/Sitecore/content-sdk/blob/d8ef09ee24ff4e01fb1e538a88aebba13f3fe89b/packages/content/src/layout/theming.ts#L58)

Site name from the layout response (`context.site.name`).
No site link is emitted without it.
