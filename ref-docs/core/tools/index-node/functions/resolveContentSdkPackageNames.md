[**@sitecore-content-sdk/core**](../../../README.md)

***

[@sitecore-content-sdk/core](../../../README.md) / [tools/index-node](../README.md) / resolveContentSdkPackageNames

# Function: resolveContentSdkPackageNames()

> **resolveContentSdkPackageNames**(`appPath?`): `string`[] \| `undefined`

Defined in: [packages/core/src/tools/framework-packages.ts:21](https://github.com/Sitecore/content-sdk/blob/d7a3c5aad0610817ec39a8d7adbdbdc09d785aad/packages/core/src/tools/framework-packages.ts#L21)

Reads the Content SDK packages an app depends on.
Every direct `@sitecore-content-sdk/*` dependency is included, so a new product
package is picked up without updating a curated framework list.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `appPath?` | `string` | Root directory of the Content SDK app. Defaults to the current working directory. |

## Returns

`string`[] \| `undefined`

Sorted package names, an empty list when the app has none, or
`undefined` when the directory has no readable `package.json`.
