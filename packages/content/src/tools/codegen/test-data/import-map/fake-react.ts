/* eslint-disable jsdoc/require-jsdoc */
// src/tools/codegen/test-data/import-map/fake-react.ts
const React = { __fake: true };

export default React;

// named export used by tests/fixtures
export function useEffect() {
  // noop
}

export function useContext() {
  // noop
}

export const useState = () => {
  // noop
};

export const useMemo = () => {
  // noop
};

export const useConsole = () => {
  // noop
};

export const useComment = () => {
  // noop
};
