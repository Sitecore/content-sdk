[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [utils](../README.md) / handleEditorFastRefresh

# Function: handleEditorFastRefresh()

> **handleEditorFastRefresh**(`forceReload?`): `void`

Defined in: [nextjs/src/utils/utils.ts:11](https://github.com/Sitecore/content-sdk/blob/b906e58a3d48beb6325e7fca193b7efa4653e6e5/packages/nextjs/src/utils/utils.ts#L11)

Since Sitecore editors do not support Fast Refresh:
1. Subscribe on events provided by webpack.
2. Reset editor chromes when build is finished

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `forceReload?` | `boolean` | `false` | force page reload instead of reset chromes |

## Returns

`void`
