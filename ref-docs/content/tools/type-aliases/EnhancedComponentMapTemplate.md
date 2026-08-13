[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [tools](../README.md) / EnhancedComponentMapTemplate

# Type Alias: EnhancedComponentMapTemplate

> **EnhancedComponentMapTemplate** = (`components`, `componentImports`, `ctx`) => `string`

Defined in: [content/src/tools/templating/components.ts:42](https://github.com/Sitecore/content-sdk/blob/08b5216f27c90a395a5ac8aa21cca1fd107676c6/packages/content/src/tools/templating/components.ts#L42)

**`Internal`**

## Parameters

| Parameter | Type |
| ------ | ------ |
| `components` | ([`ComponentFile`](../interfaces/ComponentFile.md) \| [`ComponentFileWithType`](../interfaces/ComponentFileWithType.md))[] |
| `componentImports` | [`ComponentImport`](../interfaces/ComponentImport.md)[] \| `undefined` |
| `ctx` | \{ `entries`: [`ComponentMapEntry`](ComponentMapEntry.md)[]; `includeVariants?`: `boolean`; `isClientMap?`: `boolean`; \} |
| `ctx.entries` | [`ComponentMapEntry`](ComponentMapEntry.md)[] |
| `ctx.includeVariants?` | `boolean` |
| `ctx.isClientMap?` | `boolean` |

## Returns

`string`
