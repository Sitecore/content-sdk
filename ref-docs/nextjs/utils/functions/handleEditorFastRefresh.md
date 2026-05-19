[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [utils](../README.md) / handleEditorFastRefresh

# Function: handleEditorFastRefresh()

> **handleEditorFastRefresh**(`forceReload?`): `void`

Defined in: [nextjs/src/utils/utils.ts:12](https://github.com/Sitecore/content-sdk/blob/2204da329c1296334b71f674795af93d93d50ee9/packages/nextjs/src/utils/utils.ts#L12)

Since Sitecore editors do not support Fast Refresh:
1. Subscribe on events provided by webpack.
2. Reset editor chromes when build is finished

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `forceReload?` | `boolean` | `false` | force page reload instead of reset chromes |

## Returns

`void`
