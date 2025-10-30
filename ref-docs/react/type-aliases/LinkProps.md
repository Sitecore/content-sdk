[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / LinkProps

# Type Alias: LinkProps

> **LinkProps** = `EditableFieldProps`\<`LinkProps`\> & `React.AnchorHTMLAttributes`\<`HTMLAnchorElement`\> & `RefAttributes`\<`HTMLAnchorElement`\> & `object`

Defined in: [packages/react/src/components/Link.tsx:26](https://github.com/Sitecore/content-sdk/blob/a906bba440e9579bfb49486d8c4ee492c095a043/packages/react/src/components/Link.tsx#L26)

## Type declaration

### field

> **field**: [`LinkField`](../interfaces/LinkField.md) \| [`LinkFieldValue`](../interfaces/LinkFieldValue.md) & `FieldMetadata`

The link field data.

### showLinkTextWithChildrenPresent?

> `optional` **showLinkTextWithChildrenPresent**: `boolean`

Displays a link text ('description' in Sitecore) even when children exist
