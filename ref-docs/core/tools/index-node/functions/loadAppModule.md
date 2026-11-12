[**@sitecore-content-sdk/core**](../../../README.md)

***

[@sitecore-content-sdk/core](../../../README.md) / [tools/index-node](../README.md) / loadAppModule

# Function: loadAppModule()

> **loadAppModule**\<`T`\>(`specifier`, `appPath?`): `T`

Defined in: [packages/core/src/tools/framework-packages.ts:55](https://github.com/Sitecore/content-sdk/blob/d7a3c5aad0610817ec39a8d7adbdbdc09d785aad/packages/core/src/tools/framework-packages.ts#L55)

Lazily loads a module installed in the app, resolving it from the app's `node_modules`
rather than from the CLI location (the CLI may be installed globally).

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `specifier` | `string` | Module specifier to load, e.g. `@sitecore-content-sdk/nextjs/experimental`. |
| `appPath?` | `string` | Root directory of the Content SDK app. Defaults to the current working directory. |

## Returns

`T`

The loaded module.

## Throws

Will throw when the module is not installed or cannot be resolved.
