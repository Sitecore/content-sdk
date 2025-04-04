[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / DateFieldProps

# Interface: DateFieldProps

Defined in: [packages/react/src/components/Date.tsx:10](https://github.com/Sitecore/content-sdk/blob/5647269998b9306151914ae421806dad763f924a/packages/react/src/components/Date.tsx#L10)

## Extends

- `EditableFieldProps`

## Indexable

\[`htmlAttributes`: `string`\]: `unknown`

## Properties

### editable?

> `optional` **editable**: `boolean`

Defined in: [packages/react/src/components/sharedTypes/props.ts:9](https://github.com/Sitecore/content-sdk/blob/5647269998b9306151914ae421806dad763f924a/packages/react/src/components/sharedTypes/props.ts#L9)

Can be used to explicitly disable inline editing.

#### Default

```ts
true
```

#### Inherited from

`EditableFieldProps.editable`

***

### emptyFieldEditingComponent?

> `optional` **emptyFieldEditingComponent**: `ComponentClass`\<`unknown`\> \| `FC`\<`unknown`\>

Defined in: [packages/react/src/components/sharedTypes/props.ts:13](https://github.com/Sitecore/content-sdk/blob/5647269998b9306151914ae421806dad763f924a/packages/react/src/components/sharedTypes/props.ts#L13)

Custom element to render in Pages in edit mode if field value is empty

#### Inherited from

`EditableFieldProps.emptyFieldEditingComponent`

***

### field

> **field**: `FieldMetadata` & `object`

Defined in: [packages/react/src/components/Date.tsx:13](https://github.com/Sitecore/content-sdk/blob/5647269998b9306151914ae421806dad763f924a/packages/react/src/components/Date.tsx#L13)

#### Type declaration

##### value?

> `optional` **value**: `string`

***

### render()?

> `optional` **render**: (`date`) => `ReactNode`

Defined in: [packages/react/src/components/Date.tsx:21](https://github.com/Sitecore/content-sdk/blob/5647269998b9306151914ae421806dad763f924a/packages/react/src/components/Date.tsx#L21)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `date` | `Date` |

#### Returns

`ReactNode`

***

### tag?

> `optional` **tag**: `string`

Defined in: [packages/react/src/components/Date.tsx:19](https://github.com/Sitecore/content-sdk/blob/5647269998b9306151914ae421806dad763f924a/packages/react/src/components/Date.tsx#L19)

The HTML element that will wrap the contents of the field.
