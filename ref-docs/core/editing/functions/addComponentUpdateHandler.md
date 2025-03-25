[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [editing](../README.md) / addComponentUpdateHandler

# Function: addComponentUpdateHandler()

> **addComponentUpdateHandler**(`rootComponent`, `successCallback`?): `undefined` \| () => `void`

Defined in: [packages/core/src/editing/design-library.ts:45](https://github.com/Sitecore/xmc-jss-dev/blob/643e3fe82af3b30800fd4ecaa7f98eb7f13d1ef6/packages/core/src/editing/design-library.ts#L45)

Adds the browser-side event handler for 'component:update' message used in Design Library
The event should update a component on page by uid, with fields and params from event args

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rootComponent` | [`ComponentRendering`](../../layout/interfaces/ComponentRendering.md) | root component displayed for Design Library page |
| `successCallback`? | (`updatedRootComponent`) => `void` | callback to be called after successful component update |

## Returns

`undefined` \| () => `void`
