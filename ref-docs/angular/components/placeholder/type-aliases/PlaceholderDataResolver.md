[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [components/placeholder](../README.md) / PlaceholderDataResolver

# Type Alias: PlaceholderDataResolver

> **PlaceholderDataResolver** = (`renderings`, `context`) => `ComponentRendering`[]

Defined in: [packages/angular/src/components/placeholder/placeholder-tokens.ts:31](https://github.com/Sitecore/content-sdk/blob/a45363382ef21e6ca947808e5b980aa4f1721e36/packages/angular/src/components/placeholder/placeholder-tokens.ts#L31)

Synchronous enrichment pass applied after the guard and before instantiation.
Use to decorate `fields` / `params` on renderings (e.g. personalization metadata).
Must remain synchronous; fetch async data in a loader and feed results here.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `renderings` | `ComponentRendering`[] |
| `context` | [`PlaceholderResolverContext`](../interfaces/PlaceholderResolverContext.md) |

## Returns

`ComponentRendering`[]
