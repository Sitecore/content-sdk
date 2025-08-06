[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / RichTextProps

# Interface: RichTextProps

<<<<<<< HEAD
Defined in: [packages/react/src/components/RichText.tsx:12](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/react/src/components/RichText.tsx#L12)
=======
Defined in: [packages/react/src/components/RichText.tsx:12](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/react/src/components/RichText.tsx#L12)
>>>>>>> dd686bb50 (Update API docs)

## Extends

- `EditableFieldProps`

## Indexable

\[`htmlAttributes`: `string`\]: `unknown`

## Properties

### editable?

> `optional` **editable**: `boolean`

<<<<<<< HEAD
Defined in: [packages/react/src/components/sharedTypes/props.ts:9](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/react/src/components/sharedTypes/props.ts#L9)
=======
Defined in: [packages/react/src/components/sharedTypes/props.ts:9](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/react/src/components/sharedTypes/props.ts#L9)
>>>>>>> dd686bb50 (Update API docs)

Can be used to explicitly disable inline editing.

#### Default

```ts
true
```

#### Inherited from

`EditableFieldProps.editable`

***

### emptyFieldEditingComponent?

> `optional` **emptyFieldEditingComponent**: `ComponentClass`\<`unknown`, `any`\> \| `FC`\<`unknown`\>

<<<<<<< HEAD
Defined in: [packages/react/src/components/sharedTypes/props.ts:13](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/react/src/components/sharedTypes/props.ts#L13)
=======
Defined in: [packages/react/src/components/sharedTypes/props.ts:13](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/react/src/components/sharedTypes/props.ts#L13)
>>>>>>> dd686bb50 (Update API docs)

Custom element to render in Pages in edit mode if field value is empty

#### Inherited from

`EditableFieldProps.emptyFieldEditingComponent`

***

### field?

> `optional` **field**: [`RichTextField`](RichTextField.md)

<<<<<<< HEAD
Defined in: [packages/react/src/components/RichText.tsx:15](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/react/src/components/RichText.tsx#L15)
=======
Defined in: [packages/react/src/components/RichText.tsx:15](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/react/src/components/RichText.tsx#L15)
>>>>>>> dd686bb50 (Update API docs)

The rich text field data.

***

### tag?

> `optional` **tag**: `string`

<<<<<<< HEAD
Defined in: [packages/react/src/components/RichText.tsx:20](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/react/src/components/RichText.tsx#L20)
=======
Defined in: [packages/react/src/components/RichText.tsx:20](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/react/src/components/RichText.tsx#L20)
>>>>>>> dd686bb50 (Update API docs)

The HTML element that will wrap the contents of the field.

#### Default

```ts
<div />
```
