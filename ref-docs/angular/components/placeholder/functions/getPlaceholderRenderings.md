[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [components/placeholder](../README.md) / getPlaceholderRenderings

# Function: getPlaceholderRenderings()

> **getPlaceholderRenderings**(`rendering`, `name`, `isEditing`): `ComponentRendering`\<`ComponentFields`\>[]

Defined in: [packages/angular/src/components/placeholder/placeholder-utils.ts:37](https://github.com/Sitecore/content-sdk/blob/e2bacaf0f5c83b2db3fd8f4245136fda44d91dad/packages/angular/src/components/placeholder/placeholder-utils.ts#L37)

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
