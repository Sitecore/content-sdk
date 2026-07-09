[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / defineAtomsRegistry

# Variable: defineAtomsRegistry

> `const` **defineAtomsRegistry**: \<`C`\>(`_catalog`, `options`) => `DefineRegistryResult` = `defineRegistry`

Defined in: [packages/react/src/atoms/define-atoms-registry.ts:34](https://github.com/Sitecore/content-sdk/blob/935d69d056b753a906f23541fe4b788acdc743ae/packages/react/src/atoms/define-atoms-registry.ts#L34)

Define an atoms registry that maps catalog definitions to React implementations.

Each component receives `{ props, children, emit, on, bindings, loading }`

Create a registry from a catalog with components and/or actions.

When the catalog declares actions, the `actions` field is required.

## Type Parameters

| Type Parameter |
| ------ |
| `C` *extends* `Catalog`\<`SchemaDefinition`\<`SchemaType`\<`string`, `unknown`\>, `SchemaType`\<`string`, `unknown`\>\>, `unknown`\> |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `_catalog` | `C` |
| `options` | `DefineRegistryOptions`\<`C`\> |

## Returns

`DefineRegistryResult`

## Example

```tsx
// Components only (catalog has no actions)
const { registry } = defineRegistry(catalog, {
  components: {
    Card: ({ props, children }) => (
      <div className="card">{props.title}{children}</div>
    ),
  },
});

// Both (catalog declares actions)
const { registry, handlers, executeAction } = defineRegistry(catalog, {
  components: { ... },
  actions: { ... },
});
```

## Param

**catalog**

The catalog created by defineAtomsCatalog

## Param

**options**

Component and action implementations

## Returns

Registry result with component registry and action handlers

## Example

```tsx
import { defineAtomsRegistry } from '@sitecore-content-sdk/react';

const { registry, handlers, executeAction } = defineAtomsRegistry(catalog, {
  components: {
    Button: ({ props, children, emit }) => (
      <button onClick={() => emit('press')}>{props.label}{children}</button>
    ),
    Card: ({ props, children }) => (
      <div className="card"><h2>{props.title}</h2>{children}</div>
    ),
  },
  actions: {
    submit: async (params) => {
      await fetch('/api/submit', { method: 'POST', body: JSON.stringify(params) });
    },
  },
});
```
