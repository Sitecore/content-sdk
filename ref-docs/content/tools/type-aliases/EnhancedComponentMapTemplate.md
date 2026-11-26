[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [tools](../README.md) / EnhancedComponentMapTemplate

# Type Alias: EnhancedComponentMapTemplate

> **EnhancedComponentMapTemplate** = (`components`, `componentImports`, `ctx`) => `string`

Defined in: [content/src/tools/templating/component-builder.ts:22](https://github.com/Sitecore/content-sdk/blob/ec39303dfab1c8fa45958f31c508ba9a92e16847/packages/content/src/tools/templating/component-builder.ts#L22)

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
