[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [layout](../README.md) / getDefaultMediaUrlTransformer

# Function: getDefaultMediaUrlTransformer()

> **getDefaultMediaUrlTransformer**(`edgeUrl`): (`value`) => `string`

Defined in: [content/src/layout/rewrite-edge-host.ts:129](https://github.com/Sitecore/content-sdk/blob/0ba09b9a5fb85cb3112ce168d8e0ff92da4b4633/packages/content/src/layout/rewrite-edge-host.ts#L129)

**`Internal`**

Returns the default media URL transformer: rewrites Experience Edge hostnames when custom hostname is configured.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `edgeUrl` | `string` | Experience Edge URL to rewrite to (e.g. from resolveExperienceEdgeUrl()). |

## Returns

Transformer function; returns string unchanged when no custom hostname

> (`value`): `string`

### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

### Returns

`string`
