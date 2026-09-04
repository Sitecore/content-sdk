[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [components/placeholder](../README.md) / resolveComponentForRendering

# Function: resolveComponentForRendering()

> **resolveComponentForRendering**(`args`): [`ComponentForRendering`](../interfaces/ComponentForRendering.md)

Defined in: [packages/angular/src/components/placeholder/placeholder-utils.ts:221](https://github.com/Sitecore/content-sdk/blob/fa0496c6ff6f86b0a1256461d585a8535456bf38/packages/angular/src/components/placeholder/placeholder-utils.ts#L221)

Resolve a component type for a rendering definition.
Handles hidden renderings, missing components, variant selection, and map lookup.
FEaaS/BYOC are intentionally not handled; they fall through to missingComponent.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | \{ `componentMap`: [`ComponentMap`](../../type-aliases/ComponentMap.md); `hiddenRenderingComponent?`: `Type`\<`unknown`\>; `missingComponentComponent?`: `Type`\<`unknown`\>; `placeholderName`: `string`; `renderingDefinition`: `ComponentRendering`; \} | The arguments object. |
| `args.componentMap` | [`ComponentMap`](../../type-aliases/ComponentMap.md) | The app component map. |
| `args.hiddenRenderingComponent?` | `Type`\<`unknown`\> | Optional override for hidden renderings. |
| `args.missingComponentComponent?` | `Type`\<`unknown`\> | Optional override for missing/unknown components. |
| `args.placeholderName` | `string` | Current placeholder name (for logging). |
| `args.renderingDefinition` | `ComponentRendering` | The rendering to resolve. |

## Returns

[`ComponentForRendering`](../interfaces/ComponentForRendering.md)

Resolved component info.
