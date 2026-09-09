[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / extractDocumentClasses

# Function: extractDocumentClasses()

> **extractDocumentClasses**(`doc`): `string`[]

Defined in: [packages/react/src/atoms/extract-document-classes.ts:14](https://github.com/Sitecore/content-sdk/blob/c876e4539ff3eeebb114160dc3159c5d1ae13766/packages/react/src/atoms/extract-document-classes.ts#L14)

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
