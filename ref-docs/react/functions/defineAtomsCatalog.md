[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / defineAtomsCatalog

# Function: defineAtomsCatalog()

> **defineAtomsCatalog**\<`T`\>(`input`): `Catalog`\<\{ `catalog`: `SchemaType`\<`"object"`, \{ `actions`: `SchemaType`\<`"map"`, \{ `description`: `SchemaType`\<`"string"`, `unknown`\>; `params`: `SchemaType`\<`"zod"`, `unknown`\>; \}\>; `components`: `SchemaType`\<`"map"`, \{ `description`: `SchemaType`\<`"string"`, `unknown`\>; `example`: `SchemaType`\<`"any"`, `unknown`\>; `props`: `SchemaType`\<`"zod"`, `unknown`\>; `slots`: `SchemaType`\<`"array"`, `SchemaType`\<`"string"`, `unknown`\>\>; \}\>; \}\>; `spec`: `SchemaType`\<`"object"`, \{ `elements`: `SchemaType`\<`"record"`, `SchemaType`\<`"object"`, \{ `children`: `SchemaType`\<`"array"`, `SchemaType`\<`"string"`, `unknown`\>\>; `props`: `SchemaType`\<`"propsOf"`, `string`\>; `type`: `SchemaType`\<`"ref"`, `string`\>; `visible`: `SchemaType`\<`"any"`, `unknown`\>; \}\>\>; `root`: `SchemaType`\<`"string"`, `unknown`\>; \}\>; \}, `T` & `Record`\<`Exclude`\<keyof `T`, `"components"` \| `"actions"` \| `"version"`\>, `never`\> & `object`\>

Defined in: [packages/react/src/atoms/define-atoms-catalog.ts:41](https://github.com/Sitecore/content-sdk/blob/b144b81e7600e42e4de922c8a39635d9a9ecf1ba/packages/react/src/atoms/define-atoms-catalog.ts#L41)

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
| `input` | `T` & `Record`\<`Exclude`\<keyof `T`, `"components"` \| `"actions"` \| `"version"`\>, `never`\> & `object` | Catalog input with `components` and optionally `actions` |

## Returns

`Catalog`\<\{ `catalog`: `SchemaType`\<`"object"`, \{ `actions`: `SchemaType`\<`"map"`, \{ `description`: `SchemaType`\<`"string"`, `unknown`\>; `params`: `SchemaType`\<`"zod"`, `unknown`\>; \}\>; `components`: `SchemaType`\<`"map"`, \{ `description`: `SchemaType`\<`"string"`, `unknown`\>; `example`: `SchemaType`\<`"any"`, `unknown`\>; `props`: `SchemaType`\<`"zod"`, `unknown`\>; `slots`: `SchemaType`\<`"array"`, `SchemaType`\<`"string"`, `unknown`\>\>; \}\>; \}\>; `spec`: `SchemaType`\<`"object"`, \{ `elements`: `SchemaType`\<`"record"`, `SchemaType`\<`"object"`, \{ `children`: `SchemaType`\<`"array"`, `SchemaType`\<`"string"`, `unknown`\>\>; `props`: `SchemaType`\<`"propsOf"`, `string`\>; `type`: `SchemaType`\<`"ref"`, `string`\>; `visible`: `SchemaType`\<`"any"`, `unknown`\>; \}\>\>; `root`: `SchemaType`\<`"string"`, `unknown`\>; \}\>; \}, `T` & `Record`\<`Exclude`\<keyof `T`, `"components"` \| `"actions"` \| `"version"`\>, `never`\> & `object`\>

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
