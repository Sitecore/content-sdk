[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [atoms](../README.md) / defineAtomsCatalog

# Variable: defineAtomsCatalog

> `const` **defineAtomsCatalog**: \<`T`\>(`input`) => `Catalog`\<\{ `catalog`: `SchemaType`\<`"object"`, \{ `actions`: `SchemaType`\<`"map"`, \{ `description`: `SchemaType`\<`"string"`, `unknown`\>; `params`: `SchemaType`\<`"zod"`, `unknown`\>; \}\>; `components`: `SchemaType`\<`"map"`, \{ `description`: `SchemaType`\<`"string"`, `unknown`\>; `example`: `SchemaType`\<`"any"`, `unknown`\>; `props`: `SchemaType`\<`"zod"`, `unknown`\>; `slots`: `SchemaType`\<`"array"`, `SchemaType`\<`"string"`, `unknown`\>\>; \}\>; \}\>; `spec`: `SchemaType`\<`"object"`, \{ `elements`: `SchemaType`\<`"record"`, `SchemaType`\<`"object"`, \{ `children`: `SchemaType`\<`"array"`, `SchemaType`\<`"string"`, `unknown`\>\>; `props`: `SchemaType`\<`"propsOf"`, `string`\>; `type`: `SchemaType`\<`"ref"`, `string`\>; `visible`: `SchemaType`\<`"any"`, `unknown`\>; \}\>\>; `root`: `SchemaType`\<`"string"`, `unknown`\>; \}\>; \}, `Exact`\<`T`, [`AtomsCatalogInput`](../type-aliases/AtomsCatalogInput.md)\>\> = `defineAtomsCatalogReact`

Defined in: [nextjs/src/atoms/re-exports.ts:42](https://github.com/Sitecore/content-sdk/blob/983922d9befd808bfc886e48936661b9e7afa003/packages/nextjs/src/atoms/re-exports.ts#L42)

Define an atoms catalog from component and action definitions.

Pass component/action definitions exactly as json-render expects them.
The returned catalog carries full type information so `defineAtomsRegistry`
can infer props per component.

Define an atoms catalog from component and action definitions.

Pass component/action definitions exactly as json-render expects them.
The returned catalog carries full type information so `defineAtomsRegistry`
can infer props per component.

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`AtomsCatalogInput`](../type-aliases/AtomsCatalogInput.md) |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `Exact`\<`T`, [`AtomsCatalogInput`](../type-aliases/AtomsCatalogInput.md)\> | Catalog input with `components` and optionally `actions` |

## Returns

`Catalog`\<\{ `catalog`: `SchemaType`\<`"object"`, \{ `actions`: `SchemaType`\<`"map"`, \{ `description`: `SchemaType`\<`"string"`, `unknown`\>; `params`: `SchemaType`\<`"zod"`, `unknown`\>; \}\>; `components`: `SchemaType`\<`"map"`, \{ `description`: `SchemaType`\<`"string"`, `unknown`\>; `example`: `SchemaType`\<`"any"`, `unknown`\>; `props`: `SchemaType`\<`"zod"`, `unknown`\>; `slots`: `SchemaType`\<`"array"`, `SchemaType`\<`"string"`, `unknown`\>\>; \}\>; \}\>; `spec`: `SchemaType`\<`"object"`, \{ `elements`: `SchemaType`\<`"record"`, `SchemaType`\<`"object"`, \{ `children`: `SchemaType`\<`"array"`, `SchemaType`\<`"string"`, `unknown`\>\>; `props`: `SchemaType`\<`"propsOf"`, `string`\>; `type`: `SchemaType`\<`"ref"`, `string`\>; `visible`: `SchemaType`\<`"any"`, `unknown`\>; \}\>\>; `root`: `SchemaType`\<`"string"`, `unknown`\>; \}\>; \}, `Exact`\<`T`, [`AtomsCatalogInput`](../type-aliases/AtomsCatalogInput.md)\>\>

A typed json-render Catalog

## Example

```ts
import { z } from 'zod';
import { defineAtomsCatalog } from '@sitecore-content-sdk/react';

const catalog = defineAtomsCatalog({
  components: {
    Button: {
      props: z.object({ label: z.string(), variant: z.enum(['primary', 'secondary']) }),
      description: 'A clickable button',
      slots: ['default'],
    },
    Card: {
      props: z.object({ title: z.string() }),
      description: 'A content card',
      slots: ['default'],
    },
  },
  actions: {
    submit: {
      params: z.object({ formId: z.string() }),
      description: 'Submit a form',
    },
  },
});
```

## Param

**input**

Catalog input with `components` and optionally `actions`

## Returns

A typed json-render Catalog

## Example

```ts
import { z } from 'zod';
import { defineAtomsCatalog } from '@sitecore-content-sdk/nextjs/atoms';

const catalog = defineAtomsCatalog({
  components: {
    Button: {
      props: z.object({ label: z.string(), variant: z.enum(['primary', 'secondary']) }),
      description: 'A clickable button',
      slots: ['default'],
    },
    Card: {
      props: z.object({ title: z.string() }),
      description: 'A content card',
      slots: ['default'],
    },
  },
  actions: {
    submit: {
      params: z.object({ formId: z.string() }),
      description: 'Submit a form',
    },
  },
});
```
