[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [atoms](../README.md) / addComponentPropsUpdateHandler

# Function: addComponentPropsUpdateHandler()

> **addComponentPropsUpdateHandler**(`callback`): () => `void`

Defined in: [content/src/atoms/design-library-bridge/events.ts:109](https://github.com/Sitecore/content-sdk/blob/2ebaba6454c3e55795d63c8d38a7bfd15c6ab5ac/packages/content/src/atoms/design-library-bridge/events.ts#L109)

**`Internal`**

Adds a handler for component props (fields and params) updates from the design library.
Listens for 'component:update' events and invokes the callback with the updated fields and params.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `callback` | (`fields`, `params`) => `void` | Called when a 'component:update' message is received. |

## Returns

A function to unsubscribe from the event.

() => `void`
