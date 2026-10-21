[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [components/placeholder](../README.md) / PlaceholderDataResolver

# Type Alias: PlaceholderDataResolver

> **PlaceholderDataResolver** = (`renderings`, `context`) => `ComponentRendering`[]

Defined in: [packages/angular/src/components/placeholder/placeholder-tokens.ts:31](https://github.com/Sitecore/content-sdk/blob/ee7d15fb7ff51ecf52f6c48a5dd927ab6855f385/packages/angular/src/components/placeholder/placeholder-tokens.ts#L31)

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
