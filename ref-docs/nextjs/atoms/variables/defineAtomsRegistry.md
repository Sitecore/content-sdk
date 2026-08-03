[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [atoms](../README.md) / defineAtomsRegistry

# Variable: defineAtomsRegistry

> `const` **defineAtomsRegistry**: *typeof* `defineAtomsRegistryReact` = `defineAtomsRegistryReact`

Defined in: [nextjs/src/atoms/re-exports.ts:74](https://github.com/Sitecore/content-sdk/blob/67aa52ba0cee57732483f58d187367f0b89f05a1/packages/nextjs/src/atoms/re-exports.ts#L74)

Define an atoms registry that maps catalog definitions to Nextjs implementations.

Each component receives `{ props, children, emit, on, bindings, loading }`

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
import { defineAtomsRegistry } from '@sitecore-content-sdk/nextjs/atoms';

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
