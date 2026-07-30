[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [atoms](../README.md) / addComponentPropsUpdateHandler

# Function: addComponentPropsUpdateHandler()

> **addComponentPropsUpdateHandler**(`callback`): () => `void`

Defined in: [content/src/atoms/design-library-bridge/events.ts:100](https://github.com/Sitecore/content-sdk/blob/ce87c676fc99682dfe788e7ca7dc2a0c95e8cb51/packages/content/src/atoms/design-library-bridge/events.ts#L100)

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
