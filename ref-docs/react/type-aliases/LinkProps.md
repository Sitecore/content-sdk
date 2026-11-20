[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / LinkProps

# Type Alias: LinkProps

> **LinkProps** = `EditableFieldProps`\<`LinkProps`\> & `React.AnchorHTMLAttributes`\<`HTMLAnchorElement`\> & `RefAttributes`\<`HTMLAnchorElement`\> & `object`

Defined in: [packages/react/src/components/Link.tsx:19](https://github.com/Sitecore/content-sdk/blob/51a9829bf867488124b20691dcc78e44f942c3db/packages/react/src/components/Link.tsx#L19)

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
