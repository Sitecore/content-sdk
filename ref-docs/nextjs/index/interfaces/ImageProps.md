[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / ImageProps

# Interface: ImageProps

Defined in: react/types/components/Image.d.ts:28

## Extends

- `EditableFieldProps`

## Indexable

\[`attributeName`: `string`\]: `unknown`

## Properties

### editable?

> `optional` **editable**: `boolean`

Defined in: react/types/components/sharedTypes/props.d.ts:9

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

Defined in: react/types/components/sharedTypes/props.d.ts:13

Custom element to render in Pages in edit mode if field value is empty

#### Inherited from

`EditableFieldProps.emptyFieldEditingComponent`

***

### field?

> `optional` **field**: (ImageField \| ImageFieldValue) & FieldMetadata

Defined in: react/types/components/Image.d.ts:31

Image field data (consistent with other field types)

***

### imageParams?

> `optional` **imageParams**: `object`

Defined in: react/types/components/Image.d.ts:35

Parameters that will be attached to Sitecore media URLs

#### Index Signature

\[`paramName`: `string`\]: `string` \| `number`

***

### mediaUrlPrefix?

> `optional` **mediaUrlPrefix**: `RegExp`

Defined in: react/types/components/Image.d.ts:46

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

Defined in: react/types/components/Image.d.ts:38
