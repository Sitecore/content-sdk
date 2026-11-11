---
'create-content-sdk-app': patch
---

[nextjs-app-router-cache-components] Fix `global-error.tsx` pulling the server component map into the client bundle. The Client Component imported `src/Layout`, which imports `.sitecore/component-map`, so every server component (and any inline `'use cache'` function or `server-only` code reachable from it) was compiled for the client. `global-error.tsx` now renders the Sitecore 500 page with the new `src/Layout.client.tsx`, which uses only `.sitecore/component-map.client`. Only client components in the 500 page layout are rendered there.
