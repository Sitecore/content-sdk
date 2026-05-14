---
title: "JSS-Angular Live Design — Architecture"
source_type: pdf
source_file: "JSS-Angular Live Design Doc-140526-211917.pdf"
pdf_in_repo: "llm-wiki/raw/design/JSS-Angular-Live-Design-Doc-140526-211917.pdf"
ingested: "2026-05-14"
note: "Text extracted from user-supplied PDF; structure preserved for LLM Wiki. Internal POC doc references in original PDF appear as placeholders where not included."
---

# JSS-Angular Live Design Doc — Architecture (extract)

## Goal

Provide **Angular** support while reusing common Content SDK concepts: **`scClient`**, **component-map**, **import-map** (later), **`scConfig`** (CLI config too).

## Challenges

- All imported logic must not bloat the Angular bundle incorrectly (**server and client** split).
- **`process.env`** is **not** available on the **client** in the same way as Node-based heads.

## Foundation

Angular implementation rests on the **loader system** described in an internal POC doc (referenced in the original PDF; not attached to this snapshot).

---

## Loaders

Loaders are implemented as **Angular route data resolvers** (see Angular docs: *Route data resolvers*). They populate **`page`**, **`dictionary`**, and potentially other route props when a request is processed by **Angular SSR**.

### Route configuration (example)

```typescript
{
  path: '**',
  component: PageComponent,
  resolve: {
    page: loaderResolver('page'),
    dictionary: loaderResolver('dictionary'),
  },
}
```

### Registry (`app.config.ts`)

Loaders are retrieved from a **loader registry** and provided in app config:

```typescript
import { LOADERS } from '../content-sdk/loaders';
// ...
providers: [
  // ...
  provideLoaderRegistry(LOADERS),
  // ...
];
```

### Default page loader (example)

Loader implementation lives in the app. Example pattern:

```typescript
import type { LoaderFn, Page } from '@sitecore-content-sdk/angular';
import { NotFoundNavigationError, resolveSitecorePage } from '@sitecore-content-sdk/angular';
import scConfig from '../../../sitecore.config';
import { getClient } from '../client/sitecore-client';

/**
 * Page loader: fetches layout data from Sitecore for the current URL.
 * Uses imported config and getClient so this runs outside Angular injection context.
 */
export const pageLoader: LoaderFn<Page> = async (context) => {
  const page = await resolveSitecorePage(context.url, scConfig, getClient());
  if (!page) {
    throw new NotFoundNavigationError();
  }
  return page;
};
```

### `loaderResolver` behavior

**`loaderResolver`** is the main entry point for loader execution.

**On server**

- Retrieves loaders from **`LOADER_REGISTRY`** by name.
- Executes loaders.
- Writes loader results to **`TransferState`** so values are available quickly on subsequent client navigation.

**On browser**

- Tries to read loader result from **`TransferState`** first.
- If absent, calls **`loader-data-service`** Express middleware via **`loader-data.service`**.
- Request promise is tracked in a **pending** collection; duplicate concurrent requests for the same loader/route reuse the pending promise (performance).
- Express middleware loads the loader from the registry, runs it, returns the result.

Depending on the result (**data**, **error**, **not found**), the resolver either sets the route prop or triggers navigation to **error** / **not found** routes.

### `PreLoaderDataService`

On **browser** routing, the service subscribes to Angular’s **`ActivationStart`** and runs **all** loaders for the target route **in parallel** as a **pre-warm**. Angular data resolvers run **sequentially** by default; this narrows the gap.

### Loader constraints

Loaders may run from **`loaderResolver`** **or** from the **Express** middleware — **not** inside a normal Angular **`inject()`** context. **Known limitation:** use **imports** for **`scConfig`**, **`getClient`**, etc., instead of constructor injection in loader bodies.

---

## Config and environment

Angular reuses common **`defineConfig`** logic. **`process.env`** is unavailable on the client; importing a config built only from **`process.env`** can throw.

**Mitigation (build-time script):**

1. Read **`CSDK_PUBLIC_*`** (and related) variables from **server** `process.env`.
2. Write **`environment.dev.ts` / `environment.prod.ts`** depending on the command (`npm run dev` / `npm run start`).
3. The Angular bundler folds these into a runtime **`environment.ts`** whose values are passed into **`defineConfig`** — instead of reading **`process.env`** in the browser.

---

## Components

- **Standalone** components only (Angular + Content SDK convention).
- **Component map** structure mirrors **Next.js**: PascalCase names for SAI compatibility, default + variant files (`file.default.ts`, `file.var.ts`), shared generation utilities between Next and Angular.
- **Placeholder** uses the same component map format and high-level resolution as Next.js.
- **Component map generation** is configured via **`sitecore.cli.config.ts`**.

---

## SSR

The Angular app registers **`loader-data-service`** middleware in **`server.ts`** **before** registering the browser bundle and the main Angular SSR bundle.

---

## Config (sitecore)

Angular reuses the common **`sitecore.config.ts`** approach.

---

## Fields and directives

Original PDF: **TBA**.

## Editing

Original PDF: **TBA**.

## Multisite

Original PDF: **TBA**.

## Personalization

Original PDF: **TBA**.

---

_End of extracted pages (PDF indicated 5 pages)._
