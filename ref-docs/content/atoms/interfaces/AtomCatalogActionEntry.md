[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [atoms](../README.md) / AtomCatalogActionEntry

# Interface: AtomCatalogActionEntry

Defined in: [content/src/atoms/types.ts:32](https://github.com/Sitecore/content-sdk/blob/6c65c39153c1345166224f0f46be85f70f13c595/packages/content/src/atoms/types.ts#L32)

**`Internal`**

Serialized action info, sent to Design Studio.

## Properties

### description

> **description**: `string` \| `undefined`

Defined in: [content/src/atoms/types.ts:38](https://github.com/Sitecore/content-sdk/blob/6c65c39153c1345166224f0f46be85f70f13c595/packages/content/src/atoms/types.ts#L38)

Human-readable description.

***

### name

> **name**: `string`

Defined in: [content/src/atoms/types.ts:34](https://github.com/Sitecore/content-sdk/blob/6c65c39153c1345166224f0f46be85f70f13c595/packages/content/src/atoms/types.ts#L34)

Action name (key in the catalog).

***

### paramsSchema?

> `optional` **paramsSchema?**: `object`

Defined in: [content/src/atoms/types.ts:36](https://github.com/Sitecore/content-sdk/blob/6c65c39153c1345166224f0f46be85f70f13c595/packages/content/src/atoms/types.ts#L36)

JSON Schema representation of the action params.
