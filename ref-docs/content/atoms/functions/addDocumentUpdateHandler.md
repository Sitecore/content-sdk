[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [atoms](../README.md) / addDocumentUpdateHandler

# Function: addDocumentUpdateHandler()

> **addDocumentUpdateHandler**(`callback`): () => `void`

Defined in: [content/src/atoms/design-library-bridge/events.ts:73](https://github.com/Sitecore/content-sdk/blob/958b502d1704bb305d7d8f1373f43324336459f6/packages/content/src/atoms/design-library-bridge/events.ts#L73)

**`Internal`**

Adds a handler for atom document update events from the design library.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `callback` | (`updatedRootComponent`) => `void` | The callback to be invoked when a document update event is received. |

## Returns

A function to unsubscribe from the atom document update events.

() => `void`
