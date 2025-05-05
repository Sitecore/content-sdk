[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [client](../README.md) / getEdgeProxyContentUrl

# Function: getEdgeProxyContentUrl()

> **getEdgeProxyContentUrl**(`sitecoreEdgeContextId`, `sitecoreEdgeUrl`?): `string`

Defined in: [packages/core/src/client/graphql-edge-proxy.ts:9](https://github.com/Sitecore/content-sdk/blob/cd9c0186a1ca632e03848e7eccc9c082c9a03341/packages/core/src/client/graphql-edge-proxy.ts#L9)

Generates a URL for accessing Sitecore Edge Platform Content using the provided endpoint and context ID.

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `sitecoreEdgeContextId` | `string` | `undefined` | The unique context id. |
| `sitecoreEdgeUrl`? | `string` | `SITECORE_EDGE_URL_DEFAULT` | The base endpoint URL for the Edge Platform. Default is https://edge-platform.sitecorecloud.io |

## Returns

`string`

The complete URL for accessing content through the Edge Platform.
