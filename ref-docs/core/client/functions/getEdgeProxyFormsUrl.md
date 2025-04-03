[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [client](../README.md) / getEdgeProxyFormsUrl

# Function: getEdgeProxyFormsUrl()

> **getEdgeProxyFormsUrl**(`sitecoreEdgeContextId`, `formId`, `sitecoreEdgeUrl`?): `string`

Defined in: [packages/core/src/client/graphql-edge-proxy.ts:24](https://github.com/Sitecore/content-sdk/blob/8b95896c4f9d2f6a2c452ee63406a9f69e9ab407/packages/core/src/client/graphql-edge-proxy.ts#L24)

Generates a URL for accessing Sitecore Edge Platform Forms using the provided form ID and context ID.

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `sitecoreEdgeContextId` | `string` | `undefined` | The unique context id. |
| `formId` | `string` | `undefined` | The unique form id. |
| `sitecoreEdgeUrl`? | `string` | `SITECORE_EDGE_URL_DEFAULT` | The base endpoint URL for the Edge Platform. Default is https://edge-platform.sitecorecloud.io |

## Returns

`string`

The complete URL for accessing forms through the Edge Platform.
