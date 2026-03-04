[**@sitecore-content-sdk/analytics-core**](../../README.md)

***

[@sitecore-content-sdk/analytics-core](../../README.md) / [internal](../README.md) / getEnabledPackageServer

# Function: getEnabledPackageServer()

> **getEnabledPackageServer**(`packageName`): [`PackageInitializerServer`](../classes/PackageInitializerServer.md) \| `undefined`

Defined in: [src/initializer/server/initializer.ts:219](https://github.com/Sitecore/content-sdk/blob/da3af374c12a806fb6f8807e6b8d4e5bb6a4d421/packages/analytics-core/src/initializer/server/initializer.ts#L219)

Gets an enabled package by name.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `packageName` | `string` | The name of the package to retrieve. |

## Returns

[`PackageInitializerServer`](../classes/PackageInitializerServer.md) \| `undefined`

The package initializer or undefined if not found.
