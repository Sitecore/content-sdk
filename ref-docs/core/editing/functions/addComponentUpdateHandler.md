[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [editing](../README.md) / addComponentUpdateHandler

# Function: addComponentUpdateHandler()

> **addComponentUpdateHandler**(`rootComponent`, `successCallback?`): `undefined` \| () => `void`

<<<<<<< HEAD
Defined in: [packages/core/src/editing/design-library.ts:48](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/editing/design-library.ts#L48)
=======
Defined in: [packages/core/src/editing/design-library.ts:48](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/editing/design-library.ts#L48)
>>>>>>> dd686bb50 (Update API docs)

Adds the browser-side event handler for 'component:update' message used in Design Library
The event should update a component on page by uid, with fields and params from event args

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rootComponent` | [`ComponentRendering`](../../layout/interfaces/ComponentRendering.md) | root component displayed for Design Library page |
| `successCallback?` | (`updatedRootComponent`) => `void` | callback to be called after successful component update |

## Returns

`undefined` \| () => `void`
