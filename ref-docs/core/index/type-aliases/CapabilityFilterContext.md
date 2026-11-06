[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / CapabilityFilterContext

# Type Alias: CapabilityFilterContext

> **CapabilityFilterContext** = `object`

Defined in: [packages/core/src/capabilities.ts:33](https://github.com/Sitecore/content-sdk/blob/8fa5fac9f3a10278127871abd6e608e014e74155/packages/core/src/capabilities.ts#L33)

Filesystem access exposed to capability filters at application build time.

## Properties

### appInputs?

> `optional` **appInputs?**: `Record`\<`string`, `unknown`\>

Defined in: [packages/core/src/capabilities.ts:45](https://github.com/Sitecore/content-sdk/blob/8fa5fac9f3a10278127871abd6e608e014e74155/packages/core/src/capabilities.ts#L45)

Custom inputs for capability resolution that otherwise cannot be computed within filter context.

***

### appRoot

> **appRoot**: `string`

Defined in: [packages/core/src/capabilities.ts:35](https://github.com/Sitecore/content-sdk/blob/8fa5fac9f3a10278127871abd6e608e014e74155/packages/core/src/capabilities.ts#L35)

Absolute path to the application root.

***

### fileContains

> **fileContains**: (`relativePaths`, `pattern`) => `boolean`

Defined in: [packages/core/src/capabilities.ts:43](https://github.com/Sitecore/content-sdk/blob/8fa5fac9f3a10278127871abd6e608e014e74155/packages/core/src/capabilities.ts#L43)

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

Defined in: [packages/core/src/capabilities.ts:39](https://github.com/Sitecore/content-sdk/blob/8fa5fac9f3a10278127871abd6e608e014e74155/packages/core/src/capabilities.ts#L39)

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

Defined in: [packages/core/src/capabilities.ts:41](https://github.com/Sitecore/content-sdk/blob/8fa5fac9f3a10278127871abd6e608e014e74155/packages/core/src/capabilities.ts#L41)

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

Defined in: [packages/core/src/capabilities.ts:37](https://github.com/Sitecore/content-sdk/blob/8fa5fac9f3a10278127871abd6e608e014e74155/packages/core/src/capabilities.ts#L37)

Resolved Sitecore configuration supplied to the metadata build command.
