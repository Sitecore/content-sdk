[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [atoms](../README.md) / SitecoreComponentMeta

# Interface: SitecoreComponentMeta

Defined in: [content/src/atoms/types.ts:64](https://github.com/Sitecore/content-sdk/blob/eb4a5a9ee099182eed23366c9fea12d5faf5c541/packages/content/src/atoms/types.ts#L64)

Sitecore-specific placement metadata added to a component definition.

## Properties

### allowedChildren?

> `optional` **allowedChildren?**: `string`[]

Defined in: [content/src/atoms/types.ts:68](https://github.com/Sitecore/content-sdk/blob/eb4a5a9ee099182eed23366c9fea12d5faf5c541/packages/content/src/atoms/types.ts#L68)

Component names that are allowed as children in this component's slots.

***

### allowedParents?

> `optional` **allowedParents?**: `string`[]

Defined in: [content/src/atoms/types.ts:70](https://github.com/Sitecore/content-sdk/blob/eb4a5a9ee099182eed23366c9fea12d5faf5c541/packages/content/src/atoms/types.ts#L70)

Component names that this component is allowed to be placed inside.

***

### version?

> `optional` **version?**: `string`

Defined in: [content/src/atoms/types.ts:66](https://github.com/Sitecore/content-sdk/blob/eb4a5a9ee099182eed23366c9fea12d5faf5c541/packages/content/src/atoms/types.ts#L66)

Semver version of this component definition.
