[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [atoms](../README.md) / AtomsDocumentValidationError

# Interface: AtomsDocumentValidationError

Defined in: [content/src/atoms/design-library-bridge/types.ts:33](https://github.com/Sitecore/content-sdk/blob/2ebaba6454c3e55795d63c8d38a7bfd15c6ab5ac/packages/content/src/atoms/design-library-bridge/types.ts#L33)

**`Internal`**

Payload sent on `atoms:error` when Document validation fails before render.

## Properties

### formatted

> **formatted**: `string`

Defined in: [content/src/atoms/design-library-bridge/types.ts:37](https://github.com/Sitecore/content-sdk/blob/2ebaba6454c3e55795d63c8d38a7bfd15c6ab5ac/packages/content/src/atoms/design-library-bridge/types.ts#L37)

Human-readable issue list suitable for an AI repair prompt.

***

### issues

> **issues**: [`AtomsDocumentValidationIssue`](AtomsDocumentValidationIssue.md)[]

Defined in: [content/src/atoms/design-library-bridge/types.ts:35](https://github.com/Sitecore/content-sdk/blob/2ebaba6454c3e55795d63c8d38a7bfd15c6ab5ac/packages/content/src/atoms/design-library-bridge/types.ts#L35)

Structured issues from `validateSpec`.
