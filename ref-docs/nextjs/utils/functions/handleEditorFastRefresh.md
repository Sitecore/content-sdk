[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [utils](../README.md) / handleEditorFastRefresh

# Function: handleEditorFastRefresh()

> **handleEditorFastRefresh**(`forceReload?`): `void`

Defined in: [nextjs/src/utils/utils.ts:13](https://github.com/Sitecore/content-sdk/blob/5f550df58daa0752bc0119549b277b24b2048b1f/packages/nextjs/src/utils/utils.ts#L13)

Since Sitecore editors do not support Fast Refresh:
1. Subscribe on events provided by webpack.
2. Reset editor chromes when build is finished

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `forceReload?` | `boolean` | `false` | force page reload instead of reset chromes |

## Returns

`void`
