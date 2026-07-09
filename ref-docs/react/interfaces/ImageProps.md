[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / ImageProps

# Interface: ImageProps

Defined in: [packages/react/src/components/Image.tsx:20](https://github.com/Sitecore/content-sdk/blob/a45363382ef21e6ca947808e5b980aa4f1721e36/packages/react/src/components/Image.tsx#L20)

The interface for the Image component props.

## Extends

- `EditableFieldProps`\<`ImageProps`\>

## Indexable

> \[`attributeName`: `string`\]: `unknown`

## Properties

### editable?

> `optional` **editable?**: `boolean`

Defined in: [packages/react/src/components/sharedTypes/props.ts:9](https://github.com/Sitecore/content-sdk/blob/a45363382ef21e6ca947808e5b980aa4f1721e36/packages/react/src/components/sharedTypes/props.ts#L9)

Can be used to explicitly disable inline editing.

#### Default

```ts
true
```

#### Inherited from

`EditableFieldProps.editable`

***

### emptyFieldEditingComponent?

> `optional` **emptyFieldEditingComponent?**: `ComponentClass`\<`ImageProps`, `any`\> \| `FC`\<`ImageProps`\>

Defined in: [packages/react/src/components/sharedTypes/props.ts:13](https://github.com/Sitecore/content-sdk/blob/a45363382ef21e6ca947808e5b980aa4f1721e36/packages/react/src/components/sharedTypes/props.ts#L13)

Custom element to render in Pages in edit mode if field value is empty

#### Inherited from

`EditableFieldProps.emptyFieldEditingComponent`

***

### field?

> `optional` **field?**: (ImageField \| ImageFieldValue) & FieldMetadata

Defined in: [packages/react/src/components/Image.tsx:23](https://github.com/Sitecore/content-sdk/blob/a45363382ef21e6ca947808e5b980aa4f1721e36/packages/react/src/components/Image.tsx#L23)

Image field data (consistent with other field types)

***

### imageParams?

> `optional` **imageParams?**: `object`

Defined in: [packages/react/src/components/Image.tsx:28](https://github.com/Sitecore/content-sdk/blob/a45363382ef21e6ca947808e5b980aa4f1721e36/packages/react/src/components/Image.tsx#L28)

Parameters that will be attached to Sitecore media URLs

#### Index Signature

\[`paramName`: `string`\]: `string` \| `number`

***

### mediaUrlPrefix?

> `optional` **mediaUrlPrefix?**: `RegExp`

Defined in: [packages/react/src/components/Image.tsx:41](https://github.com/Sitecore/content-sdk/blob/a45363382ef21e6ca947808e5b980aa4f1721e36/packages/react/src/components/Image.tsx#L41)

Custom regexp that finds media URL prefix that will be replaced by `/-/jssmedia` or `/~/jssmedia`.

#### Example

```ts
//([-~]{1})assets//i
/-assets/website -> /-/jssmedia/website
/~assets/website -> /~/jssmedia/website
```

***

### srcSet?

> `optional` **srcSet?**: [`ImageSizeParameters`](ImageSizeParameters.md)[]

Defined in: [packages/react/src/components/Image.tsx:32](https://github.com/Sitecore/content-sdk/blob/a45363382ef21e6ca947808e5b980aa4f1721e36/packages/react/src/components/Image.tsx#L32)
