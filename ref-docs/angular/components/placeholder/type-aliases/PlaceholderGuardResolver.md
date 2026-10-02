[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [components/placeholder](../README.md) / PlaceholderGuardResolver

# Type Alias: PlaceholderGuardResolver

> **PlaceholderGuardResolver** = (`renderings`, `context`) => `ComponentRendering`[]

Defined in: [packages/angular/src/components/placeholder/placeholder-tokens.ts:20](https://github.com/Sitecore/content-sdk/blob/e1d01567743ba659061230b4c463eb068f9fd3da/packages/angular/src/components/placeholder/placeholder-tokens.ts#L20)

Synchronous filter applied after layout renderings are fetched and before components
are instantiated. Return the renderings that should mount — omit entries to block them.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `renderings` | `ComponentRendering`[] |
| `context` | [`PlaceholderResolverContext`](../interfaces/PlaceholderResolverContext.md) |

## Returns

`ComponentRendering`[]
