[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / RichTextProps

# Interface: RichTextProps

Defined in: [packages/react/src/components/RichText.tsx:13](https://github.com/Sitecore/xmc-jss-dev/blob/a044b326cf7fdf7e220ec3cd173873f1315ba099/packages/react/src/components/RichText.tsx#L13)

## Extends

- `EditableFieldProps`

## Indexable

\[`htmlAttributes`: `string`\]: `unknown`

## Properties

### editable?

> `optional` **editable**: `boolean`

Defined in: [packages/react/src/components/sharedTypes.ts:29](https://github.com/Sitecore/xmc-jss-dev/blob/a044b326cf7fdf7e220ec3cd173873f1315ba099/packages/react/src/components/sharedTypes.ts#L29)

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

Defined in: [packages/react/src/components/sharedTypes.ts:33](https://github.com/Sitecore/xmc-jss-dev/blob/a044b326cf7fdf7e220ec3cd173873f1315ba099/packages/react/src/components/sharedTypes.ts#L33)

Custom element to render in Pages in edit mode if field value is empty

#### Inherited from

`EditableFieldProps.emptyFieldEditingComponent`

***

### field?

> `optional` **field**: [`RichTextField`](RichTextField.md)

Defined in: [packages/react/src/components/RichText.tsx:16](https://github.com/Sitecore/xmc-jss-dev/blob/a044b326cf7fdf7e220ec3cd173873f1315ba099/packages/react/src/components/RichText.tsx#L16)

The rich text field data.

***

### tag?

> `optional` **tag**: `string`

Defined in: [packages/react/src/components/RichText.tsx:21](https://github.com/Sitecore/xmc-jss-dev/blob/a044b326cf7fdf7e220ec3cd173873f1315ba099/packages/react/src/components/RichText.tsx#L21)

The HTML element that will wrap the contents of the field.

#### Default

```ts
<div />
```
