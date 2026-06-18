---
'create-content-sdk-app': patch
---

Scope Tailwind v4 source scanning to app `src` in App Router templates so monorepo `yarn watch` samples do not hang or fail on `globals.css` when symlinked SDK packages are scanned.
