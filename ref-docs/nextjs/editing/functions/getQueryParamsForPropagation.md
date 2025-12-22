[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [editing](../README.md) / getQueryParamsForPropagation

# Function: getQueryParamsForPropagation()

> **getQueryParamsForPropagation**(`query`): `object`

Defined in: [nextjs/src/editing/utils.ts:145](https://github.com/Sitecore/content-sdk/blob/d905c41e68457d1a6a8bb86464339100ff85d126/packages/nextjs/src/editing/utils.ts#L145)

**`Internal`**

Gets query parameters that should be passed along to subsequent requests (e.g. for deployment protection bypass)

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `query` | `Partial`\<\{\[`key`: `string`\]: `string` \| `string`[]; \}\> | Object of query parameters from incoming URL |

## Returns

`object`

Object of approved query parameters
