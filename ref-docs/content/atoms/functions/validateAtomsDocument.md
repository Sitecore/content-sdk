[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [atoms](../README.md) / validateAtomsDocument

# Function: validateAtomsDocument()

> **validateAtomsDocument**(`document`): [`ValidateAtomsDocumentResult`](../type-aliases/ValidateAtomsDocumentResult.md)

Defined in: [content/src/atoms/design-library-bridge/validate-document.ts:33](https://github.com/Sitecore/content-sdk/blob/2ebaba6454c3e55795d63c8d38a7bfd15c6ab5ac/packages/content/src/atoms/design-library-bridge/validate-document.ts#L33)

**`Internal`**

Validates an atoms Document with json-render's `validateSpec` before it is rendered.
Guards against missing/malformed documents so `validateSpec` is not called with invalid input.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `document` | `unknown` | The Document received from Design Studio. |

## Returns

[`ValidateAtomsDocumentResult`](../type-aliases/ValidateAtomsDocumentResult.md)

Whether the Document is structurally valid, and the error payload when it is not.
