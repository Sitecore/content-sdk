[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / LinkProps

# Type Alias: LinkProps

> **LinkProps** = `EditableFieldProps`\<`LinkProps`\> & `React.AnchorHTMLAttributes`\<`HTMLAnchorElement`\> & `RefAttributes`\<`HTMLAnchorElement`\> & `object`

Defined in: [packages/react/src/components/Link.tsx:38](https://github.com/Sitecore/content-sdk/blob/6b5ddb46afb5e20b513a1bf5d7977b5cb27bfdc2/packages/react/src/components/Link.tsx#L38)

The interface for the Link component props.

## Type Declaration

### field

> **field**: [`LinkField`](../interfaces/LinkField.md) \| [`LinkFieldValue`](../interfaces/LinkFieldValue.md) & `FieldMetadata`

The link field data.

### showLinkTextWithChildrenPresent?

> `optional` **showLinkTextWithChildrenPresent?**: `boolean`

Displays a link text ('description' in Sitecore) even when children exist
