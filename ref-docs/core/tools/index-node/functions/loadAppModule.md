[**@sitecore-content-sdk/core**](../../../README.md)

***

[@sitecore-content-sdk/core](../../../README.md) / [tools/index-node](../README.md) / loadAppModule

# Function: loadAppModule()

> **loadAppModule**\<`T`\>(`specifier`, `appPath?`): `T`

Defined in: [packages/core/src/tools/framework-packages.ts:55](https://github.com/Sitecore/content-sdk/blob/8fa5fac9f3a10278127871abd6e608e014e74155/packages/core/src/tools/framework-packages.ts#L55)

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
