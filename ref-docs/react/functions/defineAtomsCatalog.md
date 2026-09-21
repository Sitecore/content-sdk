[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / defineAtomsCatalog

# Function: defineAtomsCatalog()

> **defineAtomsCatalog**\<`T`\>(`input`): [`AtomsCatalog`](../type-aliases/AtomsCatalog.md)\<`T`\>

Defined in: [packages/react/src/atoms/define-atoms-catalog.ts:41](https://github.com/Sitecore/content-sdk/blob/eb4a5a9ee099182eed23366c9fea12d5faf5c541/packages/react/src/atoms/define-atoms-catalog.ts#L41)

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

[`AtomsCatalog`](../type-aliases/AtomsCatalog.md)\<`T`\>

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
