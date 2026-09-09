[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / LinkProps

# Type Alias: LinkProps

> **LinkProps** = `EditableFieldProps`\<`LinkProps`\> & `React.AnchorHTMLAttributes`\<`HTMLAnchorElement`\> & `RefAttributes`\<`HTMLAnchorElement`\> & `object`

Defined in: [packages/react/src/components/Link.tsx:18](https://github.com/Sitecore/content-sdk/blob/ccaa42fb0ef4df028b4e3a0cdf13355c3673c639/packages/react/src/components/Link.tsx#L18)

The interface for the Link component props.

## Type Declaration

### field

> **field**: [`LinkField`](../interfaces/LinkField.md) \| [`LinkFieldValue`](../interfaces/LinkFieldValue.md) & `FieldMetadata`

The link field data.

### renderChildrenWhenEmpty?

> `optional` **renderChildrenWhenEmpty?**: `boolean`

Renders children even when the link field value is empty.
When true, an empty anchor element containing the children is rendered instead of null.

#### Default

```ts
false
```

### showLinkTextWithChildrenPresent?

> `optional` **showLinkTextWithChildrenPresent?**: `boolean`

Displays a link text ('description' in Sitecore) even when children exist
