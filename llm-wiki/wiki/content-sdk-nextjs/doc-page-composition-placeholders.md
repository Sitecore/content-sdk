# Page composition and placeholders

From [Page composition in Content SDK apps using SitecoreAI data](https://doc.sitecore.com/sai/en/developers/content-sdk/20/page-composition-in-content-sdk-apps-using-sitecoreai-data.html) plus templates in `packages/create-content-sdk-app/src/templates/nextjs*`.

## Authoring vs runtime

1. **SitecoreAI** — authors compose pages in WYSIWYG; **placeholders** nest **renderings** (components).
2. **App** — root **`Layout`** with a **root placeholder** whose name matches SitecoreAI.
3. **Runtime** — layout arrives as **JSON** from **GraphQL** (Edge or local) via **`SitecoreClient`** / layout service.

## Developer constraints

- Placeholder keys must match authoring.
- Rendering names map to **registered** front-end components (`.sitecore/component-map.ts`).
- **Dynamic placeholders** — supported per product doc; keep names in sync.

## `Placeholder` vs `AppPlaceholder` (React / Next)

Both ultimately render the same **placeholder resolution** pipeline (`getPlaceholderRenderings`, component map, editing metadata). The split is **where context comes from** and **whether the tree can run as a React Server Component (RSC)**.

### `AppPlaceholder` (`@sitecore-content-sdk/react`)

- **No `use client`** on the module: safe to import from **server components** when the build wires **`#rsc-env`** for App Router.
- **Requires** explicit **`page`** and **`componentMap`** props (`AppPlaceholderProps`); it does **not** call **`useSitecore()`**.
- Uses **`rsc`** from **`#rsc-env`**: when **`rsc`** is true and a mapped component is a **client** component, it wraps the child in **`ClientComponentWrapper`** so the server placeholder can host client leaves without illegal boundary crossing.
- In **editing** mode, wraps output in **`PlaceholderMetadata`** for Pages chromes / hydration markers.

**Typical use:** **Next.js App Router** root **`Layout.tsx`** in the template (`packages/create-content-sdk-app/src/templates/nextjs-app-router/src/Layout.tsx`) — default **Layout is a server component**; it renders **`<AppPlaceholder page={page} componentMap={componentMap} name="…" rendering={route} />`**. Server-only editing surfaces such as **`DesignLibraryServer`** also use **`AppPlaceholder`**.

### `Placeholder` (React — `@sitecore-content-sdk/react`)

- Declares **`'use client'`** and uses **`useSitecore()`** to obtain **`page`** and **`componentMap`** when callers omit them (Pages-style apps rely on **`SitecoreProvider`**).
- Runs a **`useEffect`** that calls **`PagesEditor.resetChromes()`** when the placeholder is empty and the Pages editor is active (client-only editor UX).
- Delegates rendering to **`<AppPlaceholder {...appProps} />`** after merging props.

```1:34:packages/react/src/components/Placeholder/Placeholder.tsx
'use client';
import React, { useEffect } from 'react';
import { PlaceholderProps } from './models';
import { PagesEditor } from '@sitecore-content-sdk/content/editing';
import { getPlaceholderRenderings } from './placeholder-utils';
import { useSitecore } from '../SitecoreProvider';
import { AppPlaceholder } from './AppPlaceholder';
// ...
export const Placeholder = (props: PlaceholderProps) => {
  const { page, componentMap } = useSitecore();
  // ...
  const appProps = { ...props, page, componentMap };

  return <AppPlaceholder {...appProps} />;
};
```

**Typical use:** **Pages Router** template **`Layout.tsx`** imports **`Placeholder`** from **`@sitecore-content-sdk/nextjs`** and passes **`name`** + **`rendering`** only; **`SitecoreProvider`** supplies **`page`** / **`componentMap`**. Nested placeholders inside **client** route trees use the same **`Placeholder`**.

### `Placeholder` (Next.js — `@sitecore-content-sdk/nextjs`)

- Also **`'use client'`**; wraps the React **`Placeholder`** and merges **`getComponentData`** output from **`ComponentPropsReactContext`** into each child’s props via **`modifyComponentProps`**.

```1:38:packages/nextjs/src/components/Placeholder.tsx
'use client';
import React, { useContext } from 'react';
import {
  Placeholder as ReactPlaceholder,
  PlaceholderComponentProps,
  EnhancedOmit,
  SitecoreProviderState,
} from '@sitecore-content-sdk/react';
import { ComponentPropsReactContext } from './ComponentPropsContext';
// ...
export const Placeholder = (props: PlaceholderProps) => {
  const componentPropsContext = useContext(ComponentPropsReactContext);

  return (
    <ReactPlaceholder
      {...props}
      modifyComponentProps={(initialProps) => {
        if (!initialProps.rendering.uid) return initialProps;
        const data = componentPropsContext[initialProps.rendering.uid] as {
          [key: string]: unknown;
        };

        return { ...initialProps, ...data };
      }}
    />
  );
};
```

**Typical use:** **Pages Router** only (Next-specific component props hydration). App Router template uses **`AppPlaceholder`** from **`@sitecore-content-sdk/nextjs`** directly, not this wrapper.

### HOCs

| HOC | Declares client? | Inner component |
|-----|------------------|-----------------|
| **`withPlaceholder`** | **`'use client'`** | React **`Placeholder`** (optional `page` / `componentMap` from props or context) |
| **`withAppPlaceholder`** | No **`use client`** on the module | **`AppPlaceholder`** with required **`page`** / **`componentMap`** on the wrapper props |

### Quick matrix

| Stack | Root layout pattern | Component |
|--------|----------------------|-----------|
| **Pages Router** (template) | Client/SSR page tree with **`SitecoreProvider`** | **`Placeholder`** from **`@sitecore-content-sdk/nextjs`** |
| **App Router** (template) | Server **`Layout`**; **`Providers`** (`'use client'`) wraps **`SitecoreProvider`** around children, but root placeholders still use explicit props | **`AppPlaceholder`** from **`@sitecore-content-sdk/nextjs`** |
| **RSC / server-only branches** | Must pass **`page`** + **`componentMap`** | **`AppPlaceholder`** |
| **Client subtrees** (hooks, chromes reset, Next `getComponentData` merge) | Under **`SitecoreProvider`** | **`Placeholder`** from **`@sitecore-content-sdk/nextjs`** (App Router) or React **`Placeholder`** (any app using provider only) |

## Code anchors

- `packages/react` — **`Placeholder`**, **`AppPlaceholder`**, **`placeholder-utils`**, **`withPlaceholder`**, **`withAppPlaceholder`**
- `packages/nextjs` — Next **`Placeholder`**, **`ComponentPropsReactContext`**, editing, `getComponentData`, App Router helpers
- Templates — Pages **`Layout.tsx`** (`Placeholder`); App Router **`Layout.tsx`** (`AppPlaceholder`); `[[...path]].tsx` / `[[...path]]/page.tsx`

## Related

- [../common/doc-component-map.md](../common/doc-component-map.md) — component map format and CLI generation (shared contract)
- [doc-editor-integration-metadata.md](doc-editor-integration-metadata.md)
- [doc-route-handling-data-fetching.md](doc-route-handling-data-fetching.md)

## Raw

- `llm-wiki/raw/2026-05-14-page-composition-sitecoreai-data.md`
