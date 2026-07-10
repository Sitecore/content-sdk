[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [components/placeholder](../README.md) / PlaceholderResolverContext

# Interface: PlaceholderResolverContext

Defined in: [packages/angular/src/components/placeholder/placeholder-tokens.ts:8](https://github.com/Sitecore/content-sdk/blob/081959dae5f50b36abd9af8b5e9d111d2d12fc2d/packages/angular/src/components/placeholder/placeholder-tokens.ts#L8)

Context passed to [PlaceholderGuardResolver](../type-aliases/PlaceholderGuardResolver.md) and [PlaceholderDataResolver](../type-aliases/PlaceholderDataResolver.md).

## Properties

### name

> **name**: `string`

Defined in: [packages/angular/src/components/placeholder/placeholder-tokens.ts:10](https://github.com/Sitecore/content-sdk/blob/081959dae5f50b36abd9af8b5e9d111d2d12fc2d/packages/angular/src/components/placeholder/placeholder-tokens.ts#L10)

Placeholder key being rendered (e.g. `headless-main`).

***

### rendering

> **rendering**: `RouteData`\<`Record`\<`string`, `Field`\<`GenericFieldValue`\> \| `Item` \| `Item`[]\>\> \| `ComponentRendering`\<`ComponentFields`\>

Defined in: [packages/angular/src/components/placeholder/placeholder-tokens.ts:12](https://github.com/Sitecore/content-sdk/blob/081959dae5f50b36abd9af8b5e9d111d2d12fc2d/packages/angular/src/components/placeholder/placeholder-tokens.ts#L12)

Parent route or rendering node that owns the placeholder map.
