[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [atoms](../README.md) / SitecoreComponentMeta

# Interface: SitecoreComponentMeta

Defined in: [content/src/atoms/types.ts:66](https://github.com/Sitecore/content-sdk/blob/6c65c39153c1345166224f0f46be85f70f13c595/packages/content/src/atoms/types.ts#L66)

Sitecore-specific placement metadata added to a component definition.

## Properties

### allowedChildren?

> `optional` **allowedChildren?**: `string`[]

Defined in: [content/src/atoms/types.ts:70](https://github.com/Sitecore/content-sdk/blob/6c65c39153c1345166224f0f46be85f70f13c595/packages/content/src/atoms/types.ts#L70)

Component names that are allowed as children in this component's slots.

***

### allowedParents?

> `optional` **allowedParents?**: `string`[]

Defined in: [content/src/atoms/types.ts:72](https://github.com/Sitecore/content-sdk/blob/6c65c39153c1345166224f0f46be85f70f13c595/packages/content/src/atoms/types.ts#L72)

Component names that this component is allowed to be placed inside.

***

### legacy?

> `optional` **legacy?**: `boolean`

Defined in: [content/src/atoms/types.ts:78](https://github.com/Sitecore/content-sdk/blob/6c65c39153c1345166224f0f46be85f70f13c595/packages/content/src/atoms/types.ts#L78)

Marks the component as legacy so Design Studio excludes it from new AI component
generations. Existing usages are unaffected.

#### Default

```ts
false
```

***

### version?

> `optional` **version?**: `string`

Defined in: [content/src/atoms/types.ts:68](https://github.com/Sitecore/content-sdk/blob/6c65c39153c1345166224f0f46be85f70f13c595/packages/content/src/atoms/types.ts#L68)

Semver version of this component definition.
