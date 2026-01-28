[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / DateFieldProps

# Interface: DateFieldProps

Defined in: [packages/react/src/components/Date.tsx:12](https://github.com/Sitecore/content-sdk/blob/89adbfc3ea681d0ed290aa42c633f2413d661f6c/packages/react/src/components/Date.tsx#L12)

The props for the DateField component.

## Extends

- `EditableFieldProps`\<`DateFieldProps`\>

## Indexable

\[`htmlAttributes`: `string`\]: `unknown`

The date field data.

## Properties

### editable?

> `optional` **editable**: `boolean`

Defined in: [packages/react/src/components/sharedTypes/props.ts:9](https://github.com/Sitecore/content-sdk/blob/89adbfc3ea681d0ed290aa42c633f2413d661f6c/packages/react/src/components/sharedTypes/props.ts#L9)

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

Defined in: [packages/react/src/components/sharedTypes/props.ts:13](https://github.com/Sitecore/content-sdk/blob/89adbfc3ea681d0ed290aa42c633f2413d661f6c/packages/react/src/components/sharedTypes/props.ts#L13)

Custom element to render in Pages in edit mode if field value is empty

#### Inherited from

`EditableFieldProps.emptyFieldEditingComponent`

***

### field

> **field**: `FieldMetadata` & `object`

Defined in: [packages/react/src/components/Date.tsx:15](https://github.com/Sitecore/content-sdk/blob/89adbfc3ea681d0ed290aa42c633f2413d661f6c/packages/react/src/components/Date.tsx#L15)

#### Type Declaration

##### value?

> `optional` **value**: `string`

***

### render()?

> `optional` **render**: (`date`) => `ReactNode`

Defined in: [packages/react/src/components/Date.tsx:23](https://github.com/Sitecore/content-sdk/blob/89adbfc3ea681d0ed290aa42c633f2413d661f6c/packages/react/src/components/Date.tsx#L23)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `date` | `Date` \| `null` |

#### Returns

`ReactNode`

***

### tag?

> `optional` **tag**: `string`

Defined in: [packages/react/src/components/Date.tsx:21](https://github.com/Sitecore/content-sdk/blob/89adbfc3ea681d0ed290aa42c633f2413d661f6c/packages/react/src/components/Date.tsx#L21)

The HTML element that will wrap the contents of the field.
