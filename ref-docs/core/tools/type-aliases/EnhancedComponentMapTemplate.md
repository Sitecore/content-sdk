[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / EnhancedComponentMapTemplate

# Type Alias: EnhancedComponentMapTemplate()

> **EnhancedComponentMapTemplate** = (`components`, `componentImports`, `ctx`) => `string`

Defined in: [packages/core/src/tools/templating/components.ts:42](https://github.com/Sitecore/content-sdk/blob/33c723218db508a661afdd4878be30490d492d87/packages/core/src/tools/templating/components.ts#L42)

**`Internal`**

## Parameters

| Parameter | Type |
| ------ | ------ |
| `components` | ([`ComponentFile`](../interfaces/ComponentFile.md) \| [`ComponentFileWithType`](../interfaces/ComponentFileWithType.md))[] |
| `componentImports` | [`ComponentImport`](../interfaces/ComponentImport.md)[] \| `undefined` |
| `ctx` | \{ `entries`: [`ComponentMapEntry`](ComponentMapEntry.md)[]; `includeVariants`: `boolean`; `isClientMap`: `boolean`; \} |
| `ctx.entries` | [`ComponentMapEntry`](ComponentMapEntry.md)[] |
| `ctx.includeVariants` | `boolean` |
| `ctx.isClientMap` | `boolean` |

## Returns

`string`
