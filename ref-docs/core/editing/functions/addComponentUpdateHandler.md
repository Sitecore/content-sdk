[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [editing](../README.md) / addComponentUpdateHandler

# Function: addComponentUpdateHandler()

> **addComponentUpdateHandler**(`rootComponent`, `successCallback`?): `undefined` \| () => `void`

Defined in: [packages/core/src/editing/design-library.ts:47](https://github.com/Sitecore/content-sdk/blob/cd9c0186a1ca632e03848e7eccc9c082c9a03341/packages/core/src/editing/design-library.ts#L47)

Adds the browser-side event handler for 'component:update' message used in Design Library
The event should update a component on page by uid, with fields and params from event args

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rootComponent` | [`ComponentRendering`](../../layout/interfaces/ComponentRendering.md) | root component displayed for Design Library page |
| `successCallback`? | (`updatedRootComponent`) => `void` | callback to be called after successful component update |

## Returns

`undefined` \| () => `void`
