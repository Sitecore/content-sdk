[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / useBoundProp

# Variable: useBoundProp

> `const` **useBoundProp**: \<`T`\>(`propValue`, `bindingPath`) => \[`T` \| `undefined`, (`value`) => `void`\] = `useBoundPropInternal`

Defined in: [packages/react/src/atoms/re-exports.ts:22](https://github.com/Sitecore/content-sdk/blob/935d69d056b753a906f23541fe4b788acdc743ae/packages/react/src/atoms/re-exports.ts#L22)

Hook for two-way bound props. Returns `[value, setValue]` where:

- `value` is the already-resolved prop value (passed through from render props)
- `setValue` writes back to the bound state path (no-op if not bound)

Designed to work with the `bindings` map that the renderer provides when
a prop uses `{ $bindState: "/path" }` or `{ $bindItem: "field" }`.

Hook for two-way bound props. Returns `[value, setValue]` where:

- `value` is the already-resolved prop value (passed through from render props)
- `setValue` writes back to the bound state path (no-op if not bound)

Designed to work with the `bindings` map that the renderer provides when
a prop uses `{ $bindState: "/path" }` or `{ $bindItem: "field" }`.

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `propValue` | `T` \| `undefined` |
| `bindingPath` | `string` \| `undefined` |

## Returns

\[`T` \| `undefined`, (`value`) => `void`\]

## Example

```tsx
import { useBoundProp } from "@json-render/react";

const Input: ComponentRenderer = ({ props, bindings }) => {
  const [value, setValue] = useBoundProp<string>(props.value, bindings?.value);
  return <input value={value ?? ""} onChange={(e) => setValue(e.target.value)} />;
};
```

## Example

```tsx
import { useBoundProp } from '@sitecore-content-sdk/react';

const Input: ComponentRenderer = ({ props, bindings }) => {
  const [value, setValue] = useBoundProp<string>(props.value, bindings?.value);
  return <input value={value ?? ""} onChange={(e) => setValue(e.target.value)} />;
};
```
