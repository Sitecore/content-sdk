[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [atoms](../README.md) / SitecoreComponentMeta

# Interface: SitecoreComponentMeta

Defined in: [content/src/atoms/types.ts:68](https://github.com/Sitecore/content-sdk/blob/bd4d0720071b7055a086bf071f7474f03927a82d/packages/content/src/atoms/types.ts#L68)

Sitecore-specific placement metadata added to a component definition.

## Properties

### allowedChildren?

> `optional` **allowedChildren?**: `string`[]

Defined in: [content/src/atoms/types.ts:72](https://github.com/Sitecore/content-sdk/blob/bd4d0720071b7055a086bf071f7474f03927a82d/packages/content/src/atoms/types.ts#L72)

Component names that are allowed as children in this component's slots.

***

### allowedParents?

> `optional` **allowedParents?**: `string`[]

Defined in: [content/src/atoms/types.ts:74](https://github.com/Sitecore/content-sdk/blob/bd4d0720071b7055a086bf071f7474f03927a82d/packages/content/src/atoms/types.ts#L74)

Component names that this component is allowed to be placed inside.

***

### legacy?

> `optional` **legacy?**: `boolean`

Defined in: [content/src/atoms/types.ts:80](https://github.com/Sitecore/content-sdk/blob/bd4d0720071b7055a086bf071f7474f03927a82d/packages/content/src/atoms/types.ts#L80)

Marks the component as legacy so Design Studio excludes it from new AI component
generations. Existing usages are unaffected.

#### Default

```ts
false
```

***

### version?

> `optional` **version?**: `string`

Defined in: [content/src/atoms/types.ts:70](https://github.com/Sitecore/content-sdk/blob/bd4d0720071b7055a086bf071f7474f03927a82d/packages/content/src/atoms/types.ts#L70)

Semver version of this component definition.
