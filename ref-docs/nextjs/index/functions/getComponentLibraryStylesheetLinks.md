[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / getComponentLibraryStylesheetLinks

# Function: getComponentLibraryStylesheetLinks()

> **getComponentLibraryStylesheetLinks**(`layoutData`, `sitecoreEdgeContextId`, `sitecoreEdgeUrl`?): [`HTMLLink`](../type-aliases/HTMLLink.md)[]

Defined in: core/types/layout/themes.d.ts:10

Walks through rendering tree and returns list of links of all FEAAS, BYOC or SXA Component Library Stylesheets that are used

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `layoutData` | [`LayoutServiceData`](../interfaces/LayoutServiceData.md) | Layout service data |
| `sitecoreEdgeContextId` | `string` | Sitecore Edge Context ID |
| `sitecoreEdgeUrl`? | `string` | Sitecore Edge Platform URL. Default is https://edge-platform.sitecorecloud.io |

## Returns

[`HTMLLink`](../type-aliases/HTMLLink.md)[]

library stylesheet links
