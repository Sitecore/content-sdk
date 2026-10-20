[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [atoms](../README.md) / addDocumentUpdateHandler

# Function: addDocumentUpdateHandler()

> **addDocumentUpdateHandler**(`callback`): () => `void`

Defined in: [content/src/atoms/design-library-bridge/events.ts:76](https://github.com/Sitecore/content-sdk/blob/d5ea81c08b96d9a7a94e6b7a230773c14fa1940d/packages/content/src/atoms/design-library-bridge/events.ts#L76)

**`Internal`**

Adds a handler for atom document update events from the design library.
Validates the Document with json-render's `validateSpec` before invoking the callback.
On failure, sends an `atoms:error` event with `type: 'validation'` and does not render.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `callback` | (`updatedRootComponent`) => `void` | The callback to be invoked when a valid document update event is received. |

## Returns

A function to unsubscribe from the atom document update events.

() => `void`
