[**@sitecore-content-sdk/core**](../../../README.md)

***

[@sitecore-content-sdk/core](../../../README.md) / [tools/index-node](../README.md) / isMissingAppModuleSubpath

# Function: isMissingAppModuleSubpath()

> **isMissingAppModuleSubpath**(`error`, `specifier`, `appPath?`): `boolean`

Defined in: [packages/core/src/tools/framework-packages.ts:87](https://github.com/Sitecore/content-sdk/blob/8fa5fac9f3a10278127871abd6e608e014e74155/packages/core/src/tools/framework-packages.ts#L87)

Reports whether an error means an optional package subpath is absent.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `error` | `unknown` | resolution error |
| `specifier` | `string` | requested package subpath |
| `appPath?` | `string` | application root |

## Returns

`boolean`

true when the package exists but the subpath does not
