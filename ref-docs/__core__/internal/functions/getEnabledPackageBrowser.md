[**@sitecore-content-sdk/__core__**](../../README.md)

***

[@sitecore-content-sdk/__core__](../../README.md) / [internal](../README.md) / getEnabledPackageBrowser

# Function: getEnabledPackageBrowser()

> **getEnabledPackageBrowser**(`packageName`): [`PackageInitializer`](../classes/PackageInitializer.md) \| `undefined`

Defined in: [src/initializer/browser/initializer.ts:173](https://github.com/Sitecore/content-sdk/blob/55f235f39656ca4cac0c702c82119648ac304966/packages/__core__/src/initializer/browser/initializer.ts#L173)

Gets an enabled package by name.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `packageName` | `string` | The name of the package to retrieve. |

## Returns

[`PackageInitializer`](../classes/PackageInitializer.md) \| `undefined`

The package initializer or undefined if not found.
