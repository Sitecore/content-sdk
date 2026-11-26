[**@sitecore-content-sdk/core**](../../../README.md)

***

[@sitecore-content-sdk/core](../../../README.md) / [tools/index-node](../README.md) / isMissingAppModuleSubpath

# Function: isMissingAppModuleSubpath()

> **isMissingAppModuleSubpath**(`error`, `specifier`, `appPath?`): `boolean`

Defined in: [packages/core/src/tools/framework-packages.ts:87](https://github.com/Sitecore/content-sdk/blob/3966c04d9148447d9abcf751cdefb214d74a9fb3/packages/core/src/tools/framework-packages.ts#L87)

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
