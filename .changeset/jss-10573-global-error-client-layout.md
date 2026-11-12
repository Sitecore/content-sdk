---
'create-content-sdk-app': patch
---

[nextjs-app-router][nextjs-app-router-cache-components] Fix `global-error.tsx` pulling the server component map into the client bundle.

`global-error.tsx` is a Client Component, but it imported `src/Layout`, which uses `.sitecore/component-map`. As a result, all server components (including `'use cache'` and `server-only` code) were compiled for the client. It now renders the 500 page with `src/Layout.client.tsx`, which uses `.sitecore/component-map.client`. Header, main, and footer markup is shared through `src/LayoutPlaceholders.tsx`. Only client components are rendered on the 500 page.

Existing apps can apply the same change to `src/Layout.tsx`, `src/LayoutPlaceholders.tsx`, `src/Layout.client.tsx`, and `src/app/global-error.tsx`.
