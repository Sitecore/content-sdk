[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / ImageProps

# Interface: ImageProps

<<<<<<< HEAD
Defined in: [packages/react/src/components/Image.tsx:39](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/react/src/components/Image.tsx#L39)
=======
Defined in: [packages/react/src/components/Image.tsx:39](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/react/src/components/Image.tsx#L39)
>>>>>>> dd686bb50 (Update API docs)

## Extends

- `EditableFieldProps`

## Indexable

\[`attributeName`: `string`\]: `unknown`

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

### field?

> `optional` **field**: [`ImageFieldValue`](ImageFieldValue.md) \| [`ImageField`](ImageField.md) & `FieldMetadata`

<<<<<<< HEAD
Defined in: [packages/react/src/components/Image.tsx:42](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/react/src/components/Image.tsx#L42)
=======
Defined in: [packages/react/src/components/Image.tsx:42](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/react/src/components/Image.tsx#L42)
>>>>>>> dd686bb50 (Update API docs)

Image field data (consistent with other field types)

***

### imageParams?

> `optional` **imageParams**: `object`

<<<<<<< HEAD
Defined in: [packages/react/src/components/Image.tsx:47](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/react/src/components/Image.tsx#L47)
=======
Defined in: [packages/react/src/components/Image.tsx:47](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/react/src/components/Image.tsx#L47)
>>>>>>> dd686bb50 (Update API docs)

Parameters that will be attached to Sitecore media URLs

#### Index Signature

\[`paramName`: `string`\]: `string` \| `number`

***

### mediaUrlPrefix?

> `optional` **mediaUrlPrefix**: `RegExp`

<<<<<<< HEAD
Defined in: [packages/react/src/components/Image.tsx:60](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/react/src/components/Image.tsx#L60)
=======
Defined in: [packages/react/src/components/Image.tsx:60](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/react/src/components/Image.tsx#L60)
>>>>>>> dd686bb50 (Update API docs)

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

<<<<<<< HEAD
Defined in: [packages/react/src/components/Image.tsx:51](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/react/src/components/Image.tsx#L51)
=======
Defined in: [packages/react/src/components/Image.tsx:51](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/react/src/components/Image.tsx#L51)
>>>>>>> dd686bb50 (Update API docs)
