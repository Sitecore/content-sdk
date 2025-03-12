[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / ImageProps

# Interface: ImageProps

Defined in: [packages/react/src/components/Image.tsx:40](https://github.com/Sitecore/xmc-jss-dev/blob/692b154f482187bff433276bee9671bda23cfd11/packages/react/src/components/Image.tsx#L40)

## Extends

- `EditableFieldProps`

## Indexable

\[`attributeName`: `string`\]: `unknown`

## Properties

### editable?

> `optional` **editable**: `boolean`

Defined in: [packages/react/src/components/sharedTypes.ts:29](https://github.com/Sitecore/xmc-jss-dev/blob/692b154f482187bff433276bee9671bda23cfd11/packages/react/src/components/sharedTypes.ts#L29)

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

Defined in: [packages/react/src/components/sharedTypes.ts:33](https://github.com/Sitecore/xmc-jss-dev/blob/692b154f482187bff433276bee9671bda23cfd11/packages/react/src/components/sharedTypes.ts#L33)

Custom element to render in Pages in edit mode if field value is empty

#### Inherited from

`EditableFieldProps.emptyFieldEditingComponent`

***

### field?

> `optional` **field**: [`ImageFieldValue`](ImageFieldValue.md) \| [`ImageField`](ImageField.md) & `FieldMetadata`

Defined in: [packages/react/src/components/Image.tsx:43](https://github.com/Sitecore/xmc-jss-dev/blob/692b154f482187bff433276bee9671bda23cfd11/packages/react/src/components/Image.tsx#L43)

Image field data (consistent with other field types)

***

### imageParams?

> `optional` **imageParams**: `object`

Defined in: [packages/react/src/components/Image.tsx:48](https://github.com/Sitecore/xmc-jss-dev/blob/692b154f482187bff433276bee9671bda23cfd11/packages/react/src/components/Image.tsx#L48)

Parameters that will be attached to Sitecore media URLs

#### Index Signature

\[`paramName`: `string`\]: `string` \| `number`

***

### mediaUrlPrefix?

> `optional` **mediaUrlPrefix**: `RegExp`

Defined in: [packages/react/src/components/Image.tsx:61](https://github.com/Sitecore/xmc-jss-dev/blob/692b154f482187bff433276bee9671bda23cfd11/packages/react/src/components/Image.tsx#L61)

Custom regexp that finds media URL prefix that will be replaced by `/-/jssmedia` or `/~/jssmedia`.

#### Example

```ts
//([-~]{1})assets//i
/-assets/website -> /-/jssmedia/website
/~assets/website -> /~/jssmedia/website
```

***

### srcSet?

> `optional` **srcSet**: [`ImageSizeParameters`](ImageSizeParameters.md)[]

Defined in: [packages/react/src/components/Image.tsx:52](https://github.com/Sitecore/xmc-jss-dev/blob/692b154f482187bff433276bee9671bda23cfd11/packages/react/src/components/Image.tsx#L52)
