---
'create-content-sdk-app': patch
---

Remove dev-mode `tsconfig` path mapping for `react` in the Pages Router template so monorepo `yarn watch` samples resolve `@types/react` and `npm run build` no longer fails with missing React declaration files.
