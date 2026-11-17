[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [editing](../README.md) / addComponentUpdateHandler

# Function: addComponentUpdateHandler()

> **addComponentUpdateHandler**(`rootComponent`, `successCallback?`): (() => `void`) \| `undefined`

Defined in: [content/src/editing/design-library.ts:87](https://github.com/Sitecore/content-sdk/blob/4ed8b0d2eae4c3a3380de61934b40365770bba80/packages/content/src/editing/design-library.ts#L87)

**`Internal`**

Adds the browser-side event handler for 'component:update' message used in Design Library
The event should update a component on page by uid, with fields and params from event args

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rootComponent` | [`ComponentRendering`](../../layout/interfaces/ComponentRendering.md) | root component displayed for Design Library page |
| `successCallback?` | (`updatedRootComponent`) => `void` | callback to be called after successful component update |

## Returns

(() => `void`) \| `undefined`
