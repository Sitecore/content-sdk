[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / extractDocumentClasses

# Function: extractDocumentClasses()

> **extractDocumentClasses**(`doc`): `string`[]

Defined in: [packages/react/src/atoms/extract-document-classes.ts:14](https://github.com/Sitecore/content-sdk/blob/2db997286d1a49ba2de622f5535feed2205c999a/packages/react/src/atoms/extract-document-classes.ts#L14)

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
