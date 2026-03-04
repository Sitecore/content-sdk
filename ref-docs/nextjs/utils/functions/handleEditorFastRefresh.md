[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [utils](../README.md) / handleEditorFastRefresh

# Function: handleEditorFastRefresh()

> **handleEditorFastRefresh**(`forceReload?`): `void`

Defined in: [nextjs/src/utils/utils.ts:12](https://github.com/Sitecore/content-sdk/blob/3746e90462f2207927cf04da92b0c6dc4ff879fc/packages/nextjs/src/utils/utils.ts#L12)

Since Sitecore editors do not support Fast Refresh:
1. Subscribe on events provided by webpack.
2. Reset editor chromes when build is finished

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `forceReload?` | `boolean` | `false` | force page reload instead of reset chromes |

## Returns

`void`
