[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [components/placeholder](../README.md) / resolveComponentForRendering

# Function: resolveComponentForRendering()

> **resolveComponentForRendering**(`renderingDefinition`, `placeholderName`, `componentMap`, `hiddenRenderingComponent?`, `missingComponentComponent?`): [`ComponentForRendering`](../interfaces/ComponentForRendering.md)

Defined in: [packages/angular/src/components/placeholder/placeholder-utils.ts:148](https://github.com/Sitecore/content-sdk/blob/0ffd4a7c097b40701ae1608ec7fee7decab49a91/packages/angular/src/components/placeholder/placeholder-utils.ts#L148)

Resolve a component type for a rendering definition.
Handles hidden renderings, missing components, variant selection, and map lookup.
FEaaS/BYOC are intentionally not handled; they fall through to missingComponent.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `renderingDefinition` | `ComponentRendering` | The rendering to resolve. |
| `placeholderName` | `string` | Current placeholder name (for logging). |
| `componentMap` | [`ComponentMap`](../../type-aliases/ComponentMap.md) | The app component map. |
| `hiddenRenderingComponent?` | `Type`\<`unknown`\> | Optional override for hidden renderings. |
| `missingComponentComponent?` | `Type`\<`unknown`\> | Optional override for missing/unknown components. |

## Returns

[`ComponentForRendering`](../interfaces/ComponentForRendering.md)

Resolved component info.
