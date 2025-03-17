[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / DateFieldProps

# Interface: DateFieldProps

Defined in: [packages/react/src/components/Date.tsx:10](https://github.com/Sitecore/xmc-jss-dev/blob/ee74fbe95e0fc8de46ce468c8a36831db55f7aeb/packages/react/src/components/Date.tsx#L10)

## Extends

- `EditableFieldProps`

## Indexable

\[`htmlAttributes`: `string`\]: `unknown`

## Properties

### editable?

> `optional` **editable**: `boolean`

Defined in: [packages/react/src/components/sharedTypes.ts:29](https://github.com/Sitecore/xmc-jss-dev/blob/ee74fbe95e0fc8de46ce468c8a36831db55f7aeb/packages/react/src/components/sharedTypes.ts#L29)

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

Defined in: [packages/react/src/components/sharedTypes.ts:33](https://github.com/Sitecore/xmc-jss-dev/blob/ee74fbe95e0fc8de46ce468c8a36831db55f7aeb/packages/react/src/components/sharedTypes.ts#L33)

Custom element to render in Pages in edit mode if field value is empty

#### Inherited from

`EditableFieldProps.emptyFieldEditingComponent`

***

### field

> **field**: `FieldMetadata` & `object`

Defined in: [packages/react/src/components/Date.tsx:13](https://github.com/Sitecore/xmc-jss-dev/blob/ee74fbe95e0fc8de46ce468c8a36831db55f7aeb/packages/react/src/components/Date.tsx#L13)

#### Type declaration

##### value?

> `optional` **value**: `string`

***

### render()?

> `optional` **render**: (`date`) => `ReactNode`

Defined in: [packages/react/src/components/Date.tsx:21](https://github.com/Sitecore/xmc-jss-dev/blob/ee74fbe95e0fc8de46ce468c8a36831db55f7aeb/packages/react/src/components/Date.tsx#L21)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `date` | `Date` |

#### Returns

`ReactNode`

***

### tag?

> `optional` **tag**: `string`

Defined in: [packages/react/src/components/Date.tsx:19](https://github.com/Sitecore/xmc-jss-dev/blob/ee74fbe95e0fc8de46ce468c8a36831db55f7aeb/packages/react/src/components/Date.tsx#L19)

The HTML element that will wrap the contents of the field.
