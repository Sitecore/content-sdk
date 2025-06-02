[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [editing](../README.md) / addComponentUpdateHandler

# Function: addComponentUpdateHandler()

> **addComponentUpdateHandler**(`rootComponent`, `successCallback?`): `undefined` \| () => `void`

Defined in: [packages/core/src/editing/design-library.ts:47](https://github.com/Sitecore/content-sdk/blob/ccaca47e1d3be54d4807fac59220b223d5ccd97e/packages/core/src/editing/design-library.ts#L47)

Adds the browser-side event handler for 'component:update' message used in Design Library
The event should update a component on page by uid, with fields and params from event args

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rootComponent` | [`ComponentRendering`](../../layout/interfaces/ComponentRendering.md) | root component displayed for Design Library page |
| `successCallback?` | (`updatedRootComponent`) => `void` | callback to be called after successful component update |

## Returns

`undefined` \| () => `void`
