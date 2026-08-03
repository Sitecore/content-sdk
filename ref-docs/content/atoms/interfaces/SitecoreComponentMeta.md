[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [atoms](../README.md) / SitecoreComponentMeta

# Interface: SitecoreComponentMeta

Defined in: [content/src/atoms/types.ts:56](https://github.com/Sitecore/content-sdk/blob/67aa52ba0cee57732483f58d187367f0b89f05a1/packages/content/src/atoms/types.ts#L56)

Sitecore-specific placement metadata added to a component definition.

## Properties

### allowedChildren?

> `optional` **allowedChildren?**: `string`[]

Defined in: [content/src/atoms/types.ts:60](https://github.com/Sitecore/content-sdk/blob/67aa52ba0cee57732483f58d187367f0b89f05a1/packages/content/src/atoms/types.ts#L60)

Component names that are allowed as children in this component's slots.

***

### allowedParents?

> `optional` **allowedParents?**: `string`[]

Defined in: [content/src/atoms/types.ts:62](https://github.com/Sitecore/content-sdk/blob/67aa52ba0cee57732483f58d187367f0b89f05a1/packages/content/src/atoms/types.ts#L62)

Component names that this component is allowed to be placed inside.

***

### version?

> `optional` **version?**: `string`

Defined in: [content/src/atoms/types.ts:58](https://github.com/Sitecore/content-sdk/blob/67aa52ba0cee57732483f58d187367f0b89f05a1/packages/content/src/atoms/types.ts#L58)

Semver version of this component definition.
