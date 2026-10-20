[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [atoms](../README.md) / AtomsDocumentValidationError

# Interface: AtomsDocumentValidationError

Defined in: [content/src/atoms/design-library-bridge/types.ts:33](https://github.com/Sitecore/content-sdk/blob/d5ea81c08b96d9a7a94e6b7a230773c14fa1940d/packages/content/src/atoms/design-library-bridge/types.ts#L33)

**`Internal`**

Payload sent on `atoms:error` when Document validation fails before render.

## Properties

### formatted

> **formatted**: `string`

Defined in: [content/src/atoms/design-library-bridge/types.ts:37](https://github.com/Sitecore/content-sdk/blob/d5ea81c08b96d9a7a94e6b7a230773c14fa1940d/packages/content/src/atoms/design-library-bridge/types.ts#L37)

Human-readable issue list suitable for an AI repair prompt.

***

### issues

> **issues**: [`AtomsDocumentValidationIssue`](AtomsDocumentValidationIssue.md)[]

Defined in: [content/src/atoms/design-library-bridge/types.ts:35](https://github.com/Sitecore/content-sdk/blob/d5ea81c08b96d9a7a94e6b7a230773c14fa1940d/packages/content/src/atoms/design-library-bridge/types.ts#L35)

Structured issues from `validateSpec`.
