[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [client](../README.md) / getEdgeProxyFormsUrl

# Function: getEdgeProxyFormsUrl()

> **getEdgeProxyFormsUrl**(`sitecoreEdgeContextId`, `formId`, `sitecoreEdgeUrl?`): `string`

Defined in: [content/src/client/edge-proxy.ts:23](https://github.com/Sitecore/content-sdk/blob/a268b42996e15dfe7c883c983d1b99c91b97a726/packages/content/src/client/edge-proxy.ts#L23)

**`Internal`**

Generates a URL for accessing Sitecore Edge Platform Forms using the provided form ID and context ID.

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `sitecoreEdgeContextId` | `string` | `undefined` | The unique context id. |
| `formId` | `string` | `undefined` | The unique form id. |
| `sitecoreEdgeUrl?` | `string` | `SITECORE_EDGE_URL_DEFAULT` | The base endpoint URL for the Edge Platform. Default is https://edge-platform.sitecorecloud.io |

## Returns

`string`

The complete URL for accessing forms through the Edge Platform.
