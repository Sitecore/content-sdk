[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / CapabilityFilterContext

# Type Alias: CapabilityFilterContext

> **CapabilityFilterContext** = `object`

Defined in: [packages/core/src/capabilities.ts:25](https://github.com/Sitecore/content-sdk/blob/85bfea16a8a93e2d5b0410a454a1d882cebba54b/packages/core/src/capabilities.ts#L25)

Filesystem access exposed to capability filters at application build time.

## Properties

### appRoot

> **appRoot**: `string`

Defined in: [packages/core/src/capabilities.ts:27](https://github.com/Sitecore/content-sdk/blob/85bfea16a8a93e2d5b0410a454a1d882cebba54b/packages/core/src/capabilities.ts#L27)

Absolute path to the application root.

***

### fileContains

> **fileContains**: (`relativePaths`, `pattern`) => `boolean`

Defined in: [packages/core/src/capabilities.ts:35](https://github.com/Sitecore/content-sdk/blob/85bfea16a8a93e2d5b0410a454a1d882cebba54b/packages/core/src/capabilities.ts#L35)

Tests whether one of the supplied files contains a string or regular expression.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `relativePaths` | `string`[] |
| `pattern` | `string` \| `RegExp` |

#### Returns

`boolean`

***

### fileExists

> **fileExists**: (`relativePath`) => `boolean`

Defined in: [packages/core/src/capabilities.ts:31](https://github.com/Sitecore/content-sdk/blob/85bfea16a8a93e2d5b0410a454a1d882cebba54b/packages/core/src/capabilities.ts#L31)

Tests whether a path relative to the application root exists.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `relativePath` | `string` |

#### Returns

`boolean`

***

### readFile

> **readFile**: (`relativePath`) => `string` \| `undefined`

Defined in: [packages/core/src/capabilities.ts:33](https://github.com/Sitecore/content-sdk/blob/85bfea16a8a93e2d5b0410a454a1d882cebba54b/packages/core/src/capabilities.ts#L33)

Reads a UTF-8 file relative to the application root, or returns undefined.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `relativePath` | `string` |

#### Returns

`string` \| `undefined`

***

### sitecoreConfig?

> `optional` **sitecoreConfig?**: [`CapabilitySitecoreConfig`](CapabilitySitecoreConfig.md)

Defined in: [packages/core/src/capabilities.ts:29](https://github.com/Sitecore/content-sdk/blob/85bfea16a8a93e2d5b0410a454a1d882cebba54b/packages/core/src/capabilities.ts#L29)

Resolved Sitecore configuration supplied to the metadata build command.
