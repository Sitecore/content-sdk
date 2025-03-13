[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [utils](../README.md) / handleEditorFastRefresh

# Function: handleEditorFastRefresh()

> **handleEditorFastRefresh**(`forceReload`?): `void`

Defined in: [nextjs/src/utils/utils.ts:10](https://github.com/Sitecore/xmc-jss-dev/blob/171a564b4cd6bd5a7eef15aa45c0e2689d16cb88/packages/nextjs/src/utils/utils.ts#L10)

Since Sitecore editors do not support Fast Refresh:
1. Subscribe on events provided by webpack.
2. Reset editor chromes when build is finished

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `forceReload`? | `boolean` | `false` | force page reload instead of reset chromes |

## Returns

`void`
