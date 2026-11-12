[**@sitecore-content-sdk/core**](../../../README.md)

***

[@sitecore-content-sdk/core](../../../README.md) / [tools/index-node](../README.md) / canResolveAppModule

# Function: canResolveAppModule()

> **canResolveAppModule**(`specifier`, `appPath?`): `boolean`

Defined in: [packages/core/src/tools/framework-packages.ts:68](https://github.com/Sitecore/content-sdk/blob/d7a3c5aad0610817ec39a8d7adbdbdc09d785aad/packages/core/src/tools/framework-packages.ts#L68)

Reports whether a module can be resolved from the app without loading it.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `specifier` | `string` | Module specifier to resolve, e.g. `@sitecore-content-sdk/cli`. |
| `appPath?` | `string` | Root directory of the Content SDK app. Defaults to the current working directory. |

## Returns

`boolean`

`true` when the module is installed in the app.
