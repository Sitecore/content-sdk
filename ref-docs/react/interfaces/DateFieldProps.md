[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / DateFieldProps

# Interface: DateFieldProps

<<<<<<< HEAD
Defined in: [packages/react/src/components/Date.tsx:9](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/react/src/components/Date.tsx#L9)
=======
Defined in: [packages/react/src/components/Date.tsx:9](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/react/src/components/Date.tsx#L9)
>>>>>>> dd686bb50 (Update API docs)

## Extends

- `EditableFieldProps`

## Indexable

\[`htmlAttributes`: `string`\]: `unknown`

The date field data.

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

### field

> **field**: `FieldMetadata` & `object`

<<<<<<< HEAD
Defined in: [packages/react/src/components/Date.tsx:12](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/react/src/components/Date.tsx#L12)
=======
Defined in: [packages/react/src/components/Date.tsx:12](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/react/src/components/Date.tsx#L12)
>>>>>>> dd686bb50 (Update API docs)

#### Type declaration

##### value?

> `optional` **value**: `string`

***

### render()?

> `optional` **render**: (`date`) => `ReactNode`

<<<<<<< HEAD
Defined in: [packages/react/src/components/Date.tsx:20](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/react/src/components/Date.tsx#L20)
=======
Defined in: [packages/react/src/components/Date.tsx:20](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/react/src/components/Date.tsx#L20)
>>>>>>> dd686bb50 (Update API docs)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `date` | `Date` |

#### Returns

`ReactNode`

***

### tag?

> `optional` **tag**: `string`

<<<<<<< HEAD
Defined in: [packages/react/src/components/Date.tsx:18](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/react/src/components/Date.tsx#L18)
=======
Defined in: [packages/react/src/components/Date.tsx:18](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/react/src/components/Date.tsx#L18)
>>>>>>> dd686bb50 (Update API docs)

The HTML element that will wrap the contents of the field.
