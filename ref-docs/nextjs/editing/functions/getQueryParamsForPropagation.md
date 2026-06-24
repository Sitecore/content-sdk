[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [editing](../README.md) / getQueryParamsForPropagation

# Function: getQueryParamsForPropagation()

> **getQueryParamsForPropagation**(`query`): `object`

Defined in: [nextjs/src/editing/utils.ts:181](https://github.com/Sitecore/content-sdk/blob/c6c8dd642e4121eb4a68d30358fc75b7fc6cf641/packages/nextjs/src/editing/utils.ts#L181)

**`Internal`**

Gets query parameters that should be passed along to subsequent requests (e.g. for deployment protection bypass)

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `query` | `Partial`\<\{\[`key`: `string`\]: `string` \| `string`[]; \}\> | Object of query parameters from incoming URL |

## Returns

`object`

Object of approved query parameters
