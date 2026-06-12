import { useBoundProp as useBoundPropInternal } from '@json-render/react';

/**
 * Hook for two-way bound props. Returns `[value, setValue]` where:
 *
 * - `value` is the already-resolved prop value (passed through from render props)
 * - `setValue` writes back to the bound state path (no-op if not bound)
 *
 * Designed to work with the `bindings` map that the renderer provides when
 * a prop uses `{ $bindState: "/path" }` or `{ $bindItem: "field" }`.
 *
 * @example
 * ```tsx
 * import { useBoundProp } from '@sitecore-content-sdk/react';
 *
 * const Input: ComponentRenderer = ({ props, bindings }) => {
 *   const [value, setValue] = useBoundProp<string>(props.value, bindings?.value);
 *   return <input value={value ?? ""} onChange={(e) => setValue(e.target.value)} />;
 * };
 * ```
 */
export const useBoundProp = useBoundPropInternal;

