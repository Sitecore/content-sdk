[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [layout](../README.md) / getContentStylesheetLink

# Function: getContentStylesheetLink()

> **getContentStylesheetLink**(`layoutData`, `sitecoreEdgeContextId`, `sitecoreEdgeUrl?`): `null` \| [`HTMLLink`](../../index/type-aliases/HTMLLink.md)

Defined in: [packages/core/src/layout/content-styles.ts:20](https://github.com/Sitecore/content-sdk/blob/af8b412b06b078731c4e0c34b094b68cd0919267/packages/core/src/layout/content-styles.ts#L20)

Get the content styles link to be loaded from the Sitecore Edge Platform

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `layoutData` | [`LayoutServiceData`](../interfaces/LayoutServiceData.md) | `undefined` | Layout service data |
| `sitecoreEdgeContextId` | `string` | `undefined` | Sitecore Edge Context ID |
| `sitecoreEdgeUrl?` | `string` | `SITECORE_EDGE_URL_DEFAULT` | Sitecore Edge Platform URL. Default is https://edge-platform.sitecorecloud.io |

## Returns

`null` \| [`HTMLLink`](../../index/type-aliases/HTMLLink.md)

content styles link, null if no styles are used in layout
