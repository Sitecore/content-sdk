[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / RichTextProps

# Interface: RichTextProps

Defined in: [packages/react/src/components/RichText.tsx:15](https://github.com/Sitecore/content-sdk/blob/ec39303dfab1c8fa45958f31c508ba9a92e16847/packages/react/src/components/RichText.tsx#L15)

The interface for the RichText component props.

## Extends

- `EditableFieldProps`\<`RichTextProps`\>

## Indexable

> \[`htmlAttributes`: `string`\]: `unknown`

## Properties

### editable?

> `optional` **editable?**: `boolean`

Defined in: [packages/react/src/components/sharedTypes/props.ts:9](https://github.com/Sitecore/content-sdk/blob/ec39303dfab1c8fa45958f31c508ba9a92e16847/packages/react/src/components/sharedTypes/props.ts#L9)

Can be used to explicitly disable inline editing.

#### Default

```ts
true
```

#### Inherited from

`EditableFieldProps.editable`

***

### emptyFieldEditingComponent?

> `optional` **emptyFieldEditingComponent?**: `ComponentClass`\<`RichTextProps`, `any`\> \| `FC`\<`RichTextProps`\>

Defined in: [packages/react/src/components/sharedTypes/props.ts:13](https://github.com/Sitecore/content-sdk/blob/ec39303dfab1c8fa45958f31c508ba9a92e16847/packages/react/src/components/sharedTypes/props.ts#L13)

Custom element to render in Pages in edit mode if field value is empty

#### Inherited from

`EditableFieldProps.emptyFieldEditingComponent`

***

### field?

> `optional` **field?**: [`RichTextField`](RichTextField.md)

Defined in: [packages/react/src/components/RichText.tsx:18](https://github.com/Sitecore/content-sdk/blob/ec39303dfab1c8fa45958f31c508ba9a92e16847/packages/react/src/components/RichText.tsx#L18)

The rich text field data.

***

### ref?

> `optional` **ref?**: `Ref`\<`HTMLElement`\>

Defined in: [packages/react/src/components/RichText.tsx:25](https://github.com/Sitecore/content-sdk/blob/ec39303dfab1c8fa45958f31c508ba9a92e16847/packages/react/src/components/RichText.tsx#L25)

Ref forwarded to the root element.

***

### tag?

> `optional` **tag?**: `string`

Defined in: [packages/react/src/components/RichText.tsx:23](https://github.com/Sitecore/content-sdk/blob/ec39303dfab1c8fa45958f31c508ba9a92e16847/packages/react/src/components/RichText.tsx#L23)

The HTML element that will wrap the contents of the field.

#### Default

```ts
<div />
```
