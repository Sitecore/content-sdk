[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [atoms](../README.md) / useBoundProp

# Variable: useBoundProp

> `const` **useBoundProp**: *typeof* `useBoundPropInternal`

Defined in: react/types/atoms/re-exports.d.ts:21

Hook for two-way bound props. Returns `[value, setValue]` where:

- `value` is the already-resolved prop value (passed through from render props)
- `setValue` writes back to the bound state path (no-op if not bound)

Designed to work with the `bindings` map that the renderer provides when
a prop uses `{ $bindState: "/path" }` or `{ $bindItem: "field" }`.

## Example

```tsx
import { useBoundProp } from '@sitecore-content-sdk/react';

const Input: ComponentRenderer = ({ props, bindings }) => {
  const [value, setValue] = useBoundProp<string>(props.value, bindings?.value);
  return <input value={value ?? ""} onChange={(e) => setValue(e.target.value)} />;
};
```
