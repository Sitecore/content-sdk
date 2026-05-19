[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / LinkProps

# Type Alias: LinkProps

> **LinkProps** = `EditableFieldProps`\<`LinkProps`\> & `React.AnchorHTMLAttributes`\<`HTMLAnchorElement`\> & `RefAttributes`\<`HTMLAnchorElement`\> & `object`

Defined in: [packages/react/src/components/Link.tsx:38](https://github.com/Sitecore/content-sdk/blob/2204da329c1296334b71f674795af93d93d50ee9/packages/react/src/components/Link.tsx#L38)

The interface for the Link component props.

## Type Declaration

### field

> **field**: [`LinkField`](../interfaces/LinkField.md) \| [`LinkFieldValue`](../interfaces/LinkFieldValue.md) & `FieldMetadata`

The link field data.

### showLinkTextWithChildrenPresent?

> `optional` **showLinkTextWithChildrenPresent?**: `boolean`

Displays a link text ('description' in Sitecore) even when children exist
