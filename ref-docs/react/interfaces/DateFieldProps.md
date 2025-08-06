[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / DateFieldProps

# Interface: DateFieldProps

Defined in: [packages/react/src/components/Date.tsx:9](https://github.com/Sitecore/content-sdk/blob/e2cfae3b839cc2bcfbb157002edaeb01a84aebb9/packages/react/src/components/Date.tsx#L9)

## Extends

- `EditableFieldProps`

## Indexable

\[`htmlAttributes`: `string`\]: `unknown`

The date field data.

## Properties

### editable?

> `optional` **editable**: `boolean`

Defined in: [packages/react/src/components/sharedTypes/props.ts:9](https://github.com/Sitecore/content-sdk/blob/e2cfae3b839cc2bcfbb157002edaeb01a84aebb9/packages/react/src/components/sharedTypes/props.ts#L9)

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

Defined in: [packages/react/src/components/sharedTypes/props.ts:13](https://github.com/Sitecore/content-sdk/blob/e2cfae3b839cc2bcfbb157002edaeb01a84aebb9/packages/react/src/components/sharedTypes/props.ts#L13)

Custom element to render in Pages in edit mode if field value is empty

#### Inherited from

`EditableFieldProps.emptyFieldEditingComponent`

***

### field

> **field**: `FieldMetadata` & `object`

Defined in: [packages/react/src/components/Date.tsx:12](https://github.com/Sitecore/content-sdk/blob/e2cfae3b839cc2bcfbb157002edaeb01a84aebb9/packages/react/src/components/Date.tsx#L12)

#### Type declaration

##### value?

> `optional` **value**: `string`

***

### render()?

> `optional` **render**: (`date`) => `ReactNode`

Defined in: [packages/react/src/components/Date.tsx:20](https://github.com/Sitecore/content-sdk/blob/e2cfae3b839cc2bcfbb157002edaeb01a84aebb9/packages/react/src/components/Date.tsx#L20)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `date` | `Date` |

#### Returns

`ReactNode`

***

### tag?

> `optional` **tag**: `string`

Defined in: [packages/react/src/components/Date.tsx:18](https://github.com/Sitecore/content-sdk/blob/e2cfae3b839cc2bcfbb157002edaeb01a84aebb9/packages/react/src/components/Date.tsx#L18)

The HTML element that will wrap the contents of the field.
