[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [tools](../README.md) / EnhancedComponentMapTemplate

# Type Alias: EnhancedComponentMapTemplate

> **EnhancedComponentMapTemplate** = (`components`, `componentImports`, `ctx`) => `string`

Defined in: [content/src/tools/templating/components.ts:42](https://github.com/Sitecore/content-sdk/blob/e17d474f9d8e82d1d42d4d085f91ccae5ee8b662/packages/content/src/tools/templating/components.ts#L42)

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
