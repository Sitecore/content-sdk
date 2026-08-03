[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [atoms](../README.md) / AtomCatalogComponentEntry

# Interface: AtomCatalogComponentEntry

Defined in: [content/src/atoms/types.ts:7](https://github.com/Sitecore/content-sdk/blob/6953fcad50ce4e3d8b089190f6aed2a6b0cfd4e2/packages/content/src/atoms/types.ts#L7)

**`Internal`**

Serialized atom info for a single component, sent to Design Studio.

## Properties

### allowedChildren?

> `optional` **allowedChildren?**: `string`[]

Defined in: [content/src/atoms/types.ts:19](https://github.com/Sitecore/content-sdk/blob/6953fcad50ce4e3d8b089190f6aed2a6b0cfd4e2/packages/content/src/atoms/types.ts#L19)

Component names that are allowed as children in this component's slots.

***

### allowedParents?

> `optional` **allowedParents?**: `string`[]

Defined in: [content/src/atoms/types.ts:21](https://github.com/Sitecore/content-sdk/blob/6953fcad50ce4e3d8b089190f6aed2a6b0cfd4e2/packages/content/src/atoms/types.ts#L21)

Component names that this component is allowed to be placed inside.

***

### description?

> `optional` **description?**: `string`

Defined in: [content/src/atoms/types.ts:13](https://github.com/Sitecore/content-sdk/blob/6953fcad50ce4e3d8b089190f6aed2a6b0cfd4e2/packages/content/src/atoms/types.ts#L13)

Human-readable description.

***

### example?

> `optional` **example?**: `unknown`

Defined in: [content/src/atoms/types.ts:23](https://github.com/Sitecore/content-sdk/blob/6953fcad50ce4e3d8b089190f6aed2a6b0cfd4e2/packages/content/src/atoms/types.ts#L23)

Example prop values for AI prompt generation. Auto-generated from Zod schema if omitted.

***

### name

> **name**: `string`

Defined in: [content/src/atoms/types.ts:9](https://github.com/Sitecore/content-sdk/blob/6953fcad50ce4e3d8b089190f6aed2a6b0cfd4e2/packages/content/src/atoms/types.ts#L9)

Component name (key in the catalog).

***

### propsSchema

> **propsSchema**: `object`

Defined in: [content/src/atoms/types.ts:11](https://github.com/Sitecore/content-sdk/blob/6953fcad50ce4e3d8b089190f6aed2a6b0cfd4e2/packages/content/src/atoms/types.ts#L11)

JSON Schema representation of the component props.

***

### slots

> **slots**: `string`[]

Defined in: [content/src/atoms/types.ts:15](https://github.com/Sitecore/content-sdk/blob/6953fcad50ce4e3d8b089190f6aed2a6b0cfd4e2/packages/content/src/atoms/types.ts#L15)

Named slots (children).

***

### version?

> `optional` **version?**: `string`

Defined in: [content/src/atoms/types.ts:17](https://github.com/Sitecore/content-sdk/blob/6953fcad50ce4e3d8b089190f6aed2a6b0cfd4e2/packages/content/src/atoms/types.ts#L17)

Semver version of this component definition.
