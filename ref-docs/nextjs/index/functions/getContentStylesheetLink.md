[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / getContentStylesheetLink

# Function: getContentStylesheetLink()

> **getContentStylesheetLink**(`layoutData`, `sitecoreEdgeContextId`, `sitecoreEdgeUrl`?): `null` \| [`HTMLLink`](../type-aliases/HTMLLink.md)

Defined in: core/types/layout/content-styles.d.ts:13

Get the content styles link to be loaded from the Sitecore Edge Platform

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `layoutData` | [`LayoutServiceData`](../interfaces/LayoutServiceData.md) | Layout service data |
| `sitecoreEdgeContextId` | `string` | Sitecore Edge Context ID |
| `sitecoreEdgeUrl`? | `string` | Sitecore Edge Platform URL. Default is https://edge-platform.sitecorecloud.io |

## Returns

`null` \| [`HTMLLink`](../type-aliases/HTMLLink.md)

content styles link, null if no styles are used in layout
