[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [atoms](../README.md) / extractDocumentClasses

# Function: extractDocumentClasses()

> **extractDocumentClasses**(`doc`): `string`[]

Defined in: react/types/atoms/extract-document-classes.d.ts:13

Extracts all unique CSS class tokens from a Document's element props.

Walks the flat `doc.elements` map and collects every `className` string found
in element props, splitting on whitespace and deduplicating. The resulting array
can be passed to a CSS compiler (e.g. via `setAtomsCssCompiler`) to generate
the utility rules needed for the Document's components.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `doc` | `Document` | The Document to extract classes from. |

## Returns

`string`[]

Deduplicated array of class tokens.
