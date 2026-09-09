[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [atoms](../README.md) / addDocumentUpdateHandler

# Function: addDocumentUpdateHandler()

> **addDocumentUpdateHandler**(`callback`): () => `void`

Defined in: [content/src/atoms/design-library-bridge/events.ts:73](https://github.com/Sitecore/content-sdk/blob/c876e4539ff3eeebb114160dc3159c5d1ae13766/packages/content/src/atoms/design-library-bridge/events.ts#L73)

**`Internal`**

Adds a handler for atom document update events from the design library.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `callback` | (`updatedRootComponent`) => `void` | The callback to be invoked when a document update event is received. |

## Returns

A function to unsubscribe from the atom document update events.

() => `void`
