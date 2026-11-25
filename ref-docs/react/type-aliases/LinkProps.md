[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / LinkProps

# Type Alias: LinkProps

> **LinkProps** = `EditableFieldProps`\<`LinkProps`\> & `React.AnchorHTMLAttributes`\<`HTMLAnchorElement`\> & `RefAttributes`\<`HTMLAnchorElement`\> & `object`

Defined in: [packages/react/src/components/Link.tsx:19](https://github.com/Sitecore/content-sdk/blob/70cc3e22e6077307faa68bfeead5defb753a25b8/packages/react/src/components/Link.tsx#L19)

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
