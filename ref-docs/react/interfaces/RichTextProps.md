[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / RichTextProps

# Interface: RichTextProps

Defined in: [packages/react/src/components/RichText.tsx:21](https://github.com/Sitecore/content-sdk/blob/d9f7582b5350af2bcb2bcf85688a0d10f66aff49/packages/react/src/components/RichText.tsx#L21)

The interface for the RichText component props.

## Extends

- `EditableFieldProps`\<`RichTextProps`\>

## Indexable

\[`htmlAttributes`: `string`\]: `unknown`

## Properties

### editable?

> `optional` **editable**: `boolean`

Defined in: [packages/react/src/components/sharedTypes/props.ts:9](https://github.com/Sitecore/content-sdk/blob/d9f7582b5350af2bcb2bcf85688a0d10f66aff49/packages/react/src/components/sharedTypes/props.ts#L9)

Can be used to explicitly disable inline editing.

#### Default

```ts
true
```

#### Inherited from

`EditableFieldProps.editable`

***

### emptyFieldEditingComponent?

> `optional` **emptyFieldEditingComponent**: `ComponentClass`\<`RichTextProps`, `any`\> \| `FC`\<`RichTextProps`\>

Defined in: [packages/react/src/components/sharedTypes/props.ts:13](https://github.com/Sitecore/content-sdk/blob/d9f7582b5350af2bcb2bcf85688a0d10f66aff49/packages/react/src/components/sharedTypes/props.ts#L13)

Custom element to render in Pages in edit mode if field value is empty

#### Inherited from

`EditableFieldProps.emptyFieldEditingComponent`

***

### field?

> `optional` **field**: [`RichTextField`](RichTextField.md)

Defined in: [packages/react/src/components/RichText.tsx:24](https://github.com/Sitecore/content-sdk/blob/d9f7582b5350af2bcb2bcf85688a0d10f66aff49/packages/react/src/components/RichText.tsx#L24)

The rich text field data.

***

### ref?

> `optional` **ref**: `Ref`\<`HTMLElement`\>

Defined in: [packages/react/src/components/RichText.tsx:31](https://github.com/Sitecore/content-sdk/blob/d9f7582b5350af2bcb2bcf85688a0d10f66aff49/packages/react/src/components/RichText.tsx#L31)

Ref forwarded to the root element.

***

### tag?

> `optional` **tag**: `string`

Defined in: [packages/react/src/components/RichText.tsx:29](https://github.com/Sitecore/content-sdk/blob/d9f7582b5350af2bcb2bcf85688a0d10f66aff49/packages/react/src/components/RichText.tsx#L29)

The HTML element that will wrap the contents of the field.

#### Default

```ts
<div />
```
