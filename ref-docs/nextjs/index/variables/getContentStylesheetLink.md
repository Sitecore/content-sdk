[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / getContentStylesheetLink

# Variable: getContentStylesheetLink()

> `const` **getContentStylesheetLink**: (`layoutData`, `sitecoreEdgeContextId`, `sitecoreEdgeUrl?`) => [`HTMLLink`](../type-aliases/HTMLLink.md) \| `null`

Defined in: content/types/layout/content-styles.d.ts:14

Get the content styles link to be loaded from the Sitecore Edge Platform

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `layoutData` | [`LayoutServiceData`](../interfaces/LayoutServiceData.md) | Layout service data |
| `sitecoreEdgeContextId` | `string` | Sitecore Edge Context ID |
| `sitecoreEdgeUrl?` | `string` | Sitecore Edge Platform URL (resolved at config level). Defaults to platform URL. |

## Returns

[`HTMLLink`](../type-aliases/HTMLLink.md) \| `null`

content styles link, null if no styles are used in layout
