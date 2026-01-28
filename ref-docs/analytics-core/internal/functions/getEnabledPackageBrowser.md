[**@sitecore-content-sdk/analytics-core**](../../README.md)

***

[@sitecore-content-sdk/analytics-core](../../README.md) / [internal](../README.md) / getEnabledPackageBrowser

# Function: getEnabledPackageBrowser()

> **getEnabledPackageBrowser**(`packageName`): [`PackageInitializer`](../classes/PackageInitializer.md) \| `undefined`

Defined in: [src/initializer/browser/initializer.ts:173](https://github.com/Sitecore/content-sdk/blob/4c91e9096c4e7c0afcb0aa1545c8537310c5d3aa/packages/analytics-core/src/initializer/browser/initializer.ts#L173)

Gets an enabled package by name.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `packageName` | `string` | The name of the package to retrieve. |

## Returns

[`PackageInitializer`](../classes/PackageInitializer.md) \| `undefined`

The package initializer or undefined if not found.
