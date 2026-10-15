[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [atoms](../README.md) / AtomsDocumentValidationIssue

# Interface: AtomsDocumentValidationIssue

Defined in: [content/src/atoms/design-library-bridge/types.ts:18](https://github.com/Sitecore/content-sdk/blob/5b6de22f85fe8291e5526ff894ecf1aa2f7ab37c/packages/content/src/atoms/design-library-bridge/types.ts#L18)

**`Internal`**

A single structural issue found while validating an atoms Document.
Mirrors json-render's `SpecIssue` so Design Studio can send the payload to AI for repair.

## Properties

### code

> **code**: `string`

Defined in: [content/src/atoms/design-library-bridge/types.ts:26](https://github.com/Sitecore/content-sdk/blob/5b6de22f85fe8291e5526ff894ecf1aa2f7ab37c/packages/content/src/atoms/design-library-bridge/types.ts#L26)

Machine-readable issue code from json-render.

***

### elementKey?

> `optional` **elementKey?**: `string`

Defined in: [content/src/atoms/design-library-bridge/types.ts:24](https://github.com/Sitecore/content-sdk/blob/5b6de22f85fe8291e5526ff894ecf1aa2f7ab37c/packages/content/src/atoms/design-library-bridge/types.ts#L24)

The element key where the issue was found, when applicable.

***

### message

> **message**: `string`

Defined in: [content/src/atoms/design-library-bridge/types.ts:22](https://github.com/Sitecore/content-sdk/blob/5b6de22f85fe8291e5526ff894ecf1aa2f7ab37c/packages/content/src/atoms/design-library-bridge/types.ts#L22)

Human-readable description of the issue.

***

### severity

> **severity**: `"error"` \| `"warning"`

Defined in: [content/src/atoms/design-library-bridge/types.ts:20](https://github.com/Sitecore/content-sdk/blob/5b6de22f85fe8291e5526ff894ecf1aa2f7ab37c/packages/content/src/atoms/design-library-bridge/types.ts#L20)

Severity: errors should be fixed, warnings are informational.
