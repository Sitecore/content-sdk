[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [components/placeholder](../README.md) / getPlaceholderRenderings

# Function: getPlaceholderRenderings()

> **getPlaceholderRenderings**(`rendering`, `name`, `isEditing`): `ComponentRendering`\<`ComponentFields`\>[]

Defined in: [packages/angular/src/components/placeholder/placeholder-utils.ts:37](https://github.com/Sitecore/content-sdk/blob/8b18c6e6c2cc3546028f5408655ca263435d7507/packages/angular/src/components/placeholder/placeholder-utils.ts#L37)

Get the renderings for the specified placeholder from the rendering layout data.
Includes dynamic placeholder handling

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rendering` | `RouteData`\<`Record`\<`string`, `Field`\<`GenericFieldValue`\> \| `Item` \| `Item`[]\>\> \| `ComponentRendering`\<`ComponentFields`\> | rendering data |
| `name` | `string` | placeholder name |
| `isEditing` | `boolean` | whether editing mode is active |

## Returns

`ComponentRendering`\<`ComponentFields`\>[]

Child renderings for the placeholder.
