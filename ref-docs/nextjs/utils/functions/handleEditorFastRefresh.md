[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [utils](../README.md) / handleEditorFastRefresh

# Function: handleEditorFastRefresh()

> **handleEditorFastRefresh**(`forceReload?`): `void`

Defined in: [nextjs/src/utils/utils.ts:12](https://github.com/Sitecore/content-sdk/blob/0374b3fd6f2473d61063fcd03064bbac0a2c6281/packages/nextjs/src/utils/utils.ts#L12)

Since Sitecore editors do not support Fast Refresh:
1. Subscribe on events provided by webpack.
2. Reset editor chromes when build is finished

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `forceReload?` | `boolean` | `false` | force page reload instead of reset chromes |

## Returns

`void`
