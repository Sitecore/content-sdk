[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / getContentStylesheetLink

# Function: getContentStylesheetLink()

> **getContentStylesheetLink**(`layoutData`, `sitecoreEdgeContextId`, `sitecoreEdgeUrl`?): `HTMLLink`

Defined in: packages/core/types/layout/content-styles.d.ts:13

Get the content styles link to be loaded from the Sitecore Edge Platform

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `layoutData` | [`LayoutServiceData`](../interfaces/LayoutServiceData.md) | Layout service data |
| `sitecoreEdgeContextId` | `string` | Sitecore Edge Context ID |
| `sitecoreEdgeUrl`? | `string` | Sitecore Edge Platform URL. Default is https://edge-platform.sitecorecloud.io |

## Returns

`HTMLLink`

content styles link, null if no styles are used in layout
