[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / DateFieldProps

# Interface: DateFieldProps

Defined in: [packages/react/src/components/Date.tsx:13](https://github.com/Sitecore/content-sdk/blob/989287a2df1ab364e25b013c2e5fd976abe491b5/packages/react/src/components/Date.tsx#L13)

The props for the DateField component.

## Extends

- `EditableFieldProps`\<`DateFieldProps`\>

## Indexable

\[`htmlAttributes`: `string`\]: `unknown`

The date field data.

## Properties

### editable?

> `optional` **editable**: `boolean`

Defined in: [packages/react/src/components/sharedTypes/props.ts:9](https://github.com/Sitecore/content-sdk/blob/989287a2df1ab364e25b013c2e5fd976abe491b5/packages/react/src/components/sharedTypes/props.ts#L9)

Can be used to explicitly disable inline editing.

#### Default

```ts
true
```

#### Inherited from

`EditableFieldProps.editable`

***

### emptyFieldEditingComponent?

> `optional` **emptyFieldEditingComponent**: `ComponentClass`\<`DateFieldProps`, `any`\> \| `FC`\<`DateFieldProps`\>

Defined in: [packages/react/src/components/sharedTypes/props.ts:13](https://github.com/Sitecore/content-sdk/blob/989287a2df1ab364e25b013c2e5fd976abe491b5/packages/react/src/components/sharedTypes/props.ts#L13)

Custom element to render in Pages in edit mode if field value is empty

#### Inherited from

`EditableFieldProps.emptyFieldEditingComponent`

***

### field

> **field**: `FieldMetadata` & `object`

Defined in: [packages/react/src/components/Date.tsx:16](https://github.com/Sitecore/content-sdk/blob/989287a2df1ab364e25b013c2e5fd976abe491b5/packages/react/src/components/Date.tsx#L16)

#### Type Declaration

##### value?

> `optional` **value**: `string`

***

### render()?

> `optional` **render**: (`date`) => `ReactNode`

Defined in: [packages/react/src/components/Date.tsx:24](https://github.com/Sitecore/content-sdk/blob/989287a2df1ab364e25b013c2e5fd976abe491b5/packages/react/src/components/Date.tsx#L24)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `date` | `Date` \| `null` |

#### Returns

`ReactNode`

***

### tag?

> `optional` **tag**: `string`

Defined in: [packages/react/src/components/Date.tsx:22](https://github.com/Sitecore/content-sdk/blob/989287a2df1ab364e25b013c2e5fd976abe491b5/packages/react/src/components/Date.tsx#L22)

The HTML element that will wrap the contents of the field.
