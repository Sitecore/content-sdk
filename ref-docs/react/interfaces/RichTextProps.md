[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / RichTextProps

# Interface: RichTextProps

Defined in: [packages/react/src/components/RichText.tsx:12](https://github.com/Sitecore/content-sdk/blob/78253760f27d4717625cd0e7bf680218381cdcc8/packages/react/src/components/RichText.tsx#L12)

## Extends

- `EditableFieldProps`\<`RichTextProps`\>

## Indexable

\[`htmlAttributes`: `string`\]: `unknown`

## Properties

### editable?

> `optional` **editable**: `boolean`

Defined in: [packages/react/src/components/sharedTypes/props.ts:9](https://github.com/Sitecore/content-sdk/blob/78253760f27d4717625cd0e7bf680218381cdcc8/packages/react/src/components/sharedTypes/props.ts#L9)

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

Defined in: [packages/react/src/components/sharedTypes/props.ts:13](https://github.com/Sitecore/content-sdk/blob/78253760f27d4717625cd0e7bf680218381cdcc8/packages/react/src/components/sharedTypes/props.ts#L13)

Custom element to render in Pages in edit mode if field value is empty

#### Inherited from

`EditableFieldProps.emptyFieldEditingComponent`

***

### field?

> `optional` **field**: [`RichTextField`](RichTextField.md)

Defined in: [packages/react/src/components/RichText.tsx:15](https://github.com/Sitecore/content-sdk/blob/78253760f27d4717625cd0e7bf680218381cdcc8/packages/react/src/components/RichText.tsx#L15)

The rich text field data.

***

### tag?

> `optional` **tag**: `string`

Defined in: [packages/react/src/components/RichText.tsx:20](https://github.com/Sitecore/content-sdk/blob/78253760f27d4717625cd0e7bf680218381cdcc8/packages/react/src/components/RichText.tsx#L20)

The HTML element that will wrap the contents of the field.

#### Default

```ts
<div />
```
