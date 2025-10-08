// src/tools/codegen/test-data/import-map/fake-react.ts
const React = { __fake: true };

export default React;

// named export used by tests/fixtures
/**
 *
 * @param {...any} _args
 */
export function useEffect() {
  // noop
}
