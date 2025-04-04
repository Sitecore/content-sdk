[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / getDesignLibraryStylesheetLinks

# Function: getDesignLibraryStylesheetLinks()

> **getDesignLibraryStylesheetLinks**(`layoutData`, `sitecoreEdgeContextId`, `sitecoreEdgeUrl`?): `HTMLLink`[]

Defined in: packages/core/types/layout/themes.d.ts:10

Walks through rendering tree and returns list of links of all FEAAS, BYOC or SXA Design Library Stylesheets that are used

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `layoutData` | [`LayoutServiceData`](../interfaces/LayoutServiceData.md) | Layout service data |
| `sitecoreEdgeContextId` | `string` | Sitecore Edge Context ID |
| `sitecoreEdgeUrl`? | `string` | Sitecore Edge Platform URL. Default is https://edge-platform.sitecorecloud.io |

## Returns

`HTMLLink`[]

library stylesheet links
