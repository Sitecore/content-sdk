# Angular Loaders: Technical Documentation

This document explains the loaders system in `@sitecore-content-sdk/angular`, covering both how to use loaders in your application and the internal implementation details for SDK contributors.

## Table of Contents

1. [Introduction and Problem Statement](#introduction-and-problem-statement)
2. [Architecture Overview](#architecture-overview)
3. [Key Entities Explained](#key-entities-explained)
4. [For SDK Users: Implementing Loaders](#for-sdk-users-implementing-loaders)
5. [For SDK Contributors: Internal Implementation](#for-sdk-contributors-internal-implementation)
6. [API Reference](#api-reference)
7. [Complete Example](#complete-example)

---

## Introduction and Problem Statement

### The Challenge

Angular applications with Server-Side Rendering (SSR) face a fundamental challenge: **data must be fetched on the server during initial render, then efficiently transferred to the client without re-fetching**.

Standard Angular route resolvers have limitations in SSR scenarios:

1. **No built-in hydration**: Data fetched on the server isn't automatically available on the client
2. **Duplicate requests**: Without proper handling, the same data gets fetched twice (server + client)
3. **Client navigation**: After hydration, subsequent navigation requires a different data-fetching strategy than SSR

### What Loaders Solve

The loaders system provides a **unified data-loading abstraction** that handles all three scenarios:

| Scenario | How Loaders Handle It |
|----------|----------------------|
| **SSR (Initial Render)** | Loader runs on server, data stored in Angular's `TransferState` |
| **Hydration (First Client Load)** | Data retrieved from `TransferState`, no network request |
| **Client Navigation** | Data fetched via `/_data` endpoint, with caching and deduplication |

### Goals

- **Write once**: Define a single loader function that works in all scenarios
- **Automatic optimization**: TransferState hydration and request deduplication handled automatically
- **Type safety**: Full TypeScript support with loader ID type checking
- **Familiar patterns**: Inspired by React Router and Next.js data loading conventions

---

## Architecture Overview

### High-Level Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Sample Application                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐       │
│  │   pageLoader     │    │ dictionaryLoader │    │  errorPageLoader │       │
│  │   (LoaderFn)     │    │   (LoaderFn)     │    │   (LoaderFn)     │       │
│  └────────┬─────────┘    └────────┬─────────┘    └────────┬─────────┘       │
│           │                       │                       │                  │
│           └───────────────────────┼───────────────────────┘                  │
│                                   ▼                                          │
│                       ┌──────────────────────┐                               │
│                       │   SERVER_LOADERS     │                               │
│                       │   (Loader Registry)  │                               │
│                       └──────────┬───────────┘                               │
│                                  │                                           │
└──────────────────────────────────┼───────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        @sitecore-content-sdk/angular                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         Client Side                                  │    │
│  │  ┌─────────────────┐  ┌───────────────────┐  ┌───────────────────┐  │    │
│  │  │  loaderResolver │  │ LoaderDataService │  │LoaderPrefetchSvc  │  │    │
│  │  │  (ResolveFn)    │  │  (cache + fetch)  │  │ (parallel fetch)  │  │    │
│  │  └─────────────────┘  └───────────────────┘  └───────────────────┘  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         Server Side                                  │    │
│  │  ┌─────────────────┐  ┌───────────────────┐  ┌───────────────────┐  │    │
│  │  │  LOADER_REGISTRY│  │  DataMiddleware   │  │   TransferState   │  │    │
│  │  │  (DI Token)     │  │  (/_data handler) │  │  (SSR → Client)   │  │    │
│  │  └─────────────────┘  └───────────────────┘  └───────────────────┘  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow by Scenario

#### SSR (Server-Side Rendering)

```
1. Browser requests /page
2. Express server handles request
3. Angular SSR renders the route
4. loaderResolver executes:
   - Injects LOADER_REGISTRY
   - Calls loader function directly
   - Stores result in TransferState
   - Returns data to route
5. HTML + serialized TransferState sent to browser
```

#### Client Hydration

```
1. Angular hydrates on client
2. loaderResolver executes:
   - Checks TransferState for cached data
   - Data found → return it, remove from cache
   - No network request needed
```

#### Client-Side Navigation

```
1. User navigates to /new-page
2. loaderResolver executes:
   - TransferState is empty
   - Calls LoaderDataService.getData()
3. LoaderDataService:
   - Checks in-memory cache
   - If not cached, POSTs to /_data endpoint
4. Express DataMiddleware:
   - Parses request body
   - Executes loader function
   - Returns JSON response
5. Data cached and returned to resolver
```

---

## Key Entities Explained

This section provides a conceptual overview of the main building blocks in the loaders system. Understanding these entities and how they interact will help you effectively use and extend the system.

### LoaderFn (Loader Function)

**What it is:** A pure async function that fetches data for a specific purpose.

**Responsibility:** Given context (URL, params, query), fetch and return data from any source (API, CMS, database).

```typescript
type LoaderFn<T = unknown> = (ctx: LoaderContext) => Promise<T> | T;
```

**Example:**
```typescript
export const pageLoader: LoaderFn = async ({ url }) => {
  return await client.getPage(url);
};
```

**Key Points:**
- Loaders are **environment-agnostic** - the same function runs on server (SSR) and is callable via the data endpoint
- Loaders should be **pure** - no side effects, just data fetching
- Loaders can throw special errors (`notFound()`, `redirect()`) to control navigation

---

### Loader Registry (LOADER_REGISTRY)

**What it is:** A centralized map that associates string IDs with loader functions.

**Responsibility:** Provides a lookup table so the system can find and execute the right loader by its ID.

```typescript
export const SERVER_LOADERS = {
  page: pageLoader,
  dictionary: dictionaryLoader,
  '404': notFoundLoader,
} as const satisfies Record<string, LoaderFn>;
```

**Why it exists:**
- Enables **type-safe loader references** via TypeScript module augmentation
- Allows **dynamic lookup** at runtime (server can execute any registered loader)
- Keeps loaders **decoupled** from route definitions

**Where it's used:**
| Context | How Registry is Used |
|---------|---------------------|
| Server (SSR) | Injected via `LOADER_REGISTRY` token, loaders executed directly |
| Server (/_data) | Passed to data middleware, used to handle API requests |
| Client | Empty registry (loaders run via API, not locally) |

---

### loaderResolver

**What it is:** A factory function that creates Angular route resolvers.

**Responsibility:** Bridges Angular's routing system with the loaders system, handling SSR, hydration, and client navigation transparently.

```typescript
// Usage in route config
resolve: {
  page: loaderResolver('page'),  // Returns an Angular ResolveFn
}
```

**How it works by scenario:**

| Scenario | Behavior |
|----------|----------|
| **SSR** | Calls loader directly via `LOADER_REGISTRY`, stores result in `TransferState` |
| **Hydration** | Reads from `TransferState` (no network request), removes after use |
| **Client Navigation** | Fetches via `LoaderDataService` → `/_data` endpoint |

**Key Points:**
- Creates resolvers tagged with their loader ID (enables prefetch discovery)
- Handles error translation (converts `LoaderRedirect`, `LoaderNotFound` to Angular errors)
- Provides unified data loading regardless of rendering context

---

### LoaderDataService

**What it is:** An Angular service for browser-side data fetching and caching.

**Responsibility:** Fetches loader data via the `/_data` endpoint, caches results, and deduplicates in-flight requests.

```typescript
// Injected and used by loaderResolver on the client
const data = await loaderDataService.getData({
  loaderId: 'page',
  url: '/about',
  params: {},
  query: {},
});
```

**Key Features:**

| Feature | Description |
|---------|-------------|
| **In-memory Cache** | Stores fetched data to avoid duplicate requests |
| **Request Deduplication** | Concurrent requests for same data share one network call |
| **Consume-on-read** | Cache entries removed after use (one-time hydration pattern) |
| **Preload Support** | `preload()` and `prefetch()` methods for eager data loading |

**Methods:**

| Method | Purpose |
|--------|---------|
| `getData(request)` | Get data from cache or fetch from `/_data` |
| `preload(url, loaderId)` | Fire-and-forget prefetch (e.g., on link hover) |
| `prefetch(url, loaderId, params, query)` | Full prefetch with complete context |
| `has(url, loaderId)` | Check if data is already cached |
| `clear()` | Clear all cached data |

---

### Data Middleware (createExpressDataMiddleware)

**What it is:** An Express middleware that handles the `/_data` API endpoint.

**Responsibility:** Receives loader requests from the client, executes the appropriate loader, and returns the result as JSON.

```typescript
// In server.ts
app.use(createExpressDataMiddleware({ loaders: SERVER_LOADERS }));
```

**Request/Response Flow:**

```
Client (LoaderDataService)
    │
    │  POST /_data
    │  { loaderId: "page", url: "/about", params: {}, query: {} }
    ▼
Data Middleware
    │
    │  1. Parse request body
    │  2. Look up loader in registry
    │  3. Execute loader with context
    │  4. Handle errors (redirect, notFound, etc.)
    ▼
Response
    { kind: "data", data: {...} }
    or
    { kind: "redirect", location: "/login", status: 302 }
    or
    { kind: "notFound", status: 404 }
```

**Implementations:**
- `createExpressDataMiddleware` - Express-specific wrapper
- `createDataMiddleware` - Platform-agnostic (uses Fetch API)

---

### LoaderPrefetchService

**What it is:** An Angular service that optimizes client-side navigation by prefetching data in parallel.

**Responsibility:** Listens for navigation events, discovers all loaders in the target route tree, and prefetches their data concurrently.

**Why it exists:**

Angular resolvers run **sequentially** by default. Without prefetching:
```
Navigate to /about
├── dictionary resolver (waits for network) ── 100ms
└── page resolver (waits for network) ────────── 150ms
Total: ~250ms (sequential)
```

With prefetching enabled:
```
Navigate to /about
├── Prefetch service fires all requests in parallel
│   ├── dictionary ─┐
│   └── page ───────┼── Network (parallel)
│                   │
├── dictionary resolver (data already cached) ── 1ms
└── page resolver (data already cached) ──────── 1ms
Total: ~150ms (parallel network + minimal resolver time)
```

**How it works:**

1. Listens to `ResolveStart` router events
2. Walks the matched route tree
3. Identifies `loaderResolver` functions using `getLoaderId()`
4. Calls `LoaderDataService.prefetch()` for each loader (fire-and-forget)

**Configuration:**
```typescript
provideSitecoreContentSdk({
  componentMap,
  prefetch: true,  // Enabled by default
})
```

---

### Entity Relationship Summary

```
┌────────────────────────────────────────────────────────────────────────┐
│                         APPLICATION SETUP                               │
│                                                                         │
│   SERVER_LOADERS ────────────────────────────────────────────┐         │
│   (Loader Registry)                                          │         │
│        │                                                     │         │
│        ├─────────► provideSitecoreContentSdkServer() ───► LOADER_REGISTRY
│        │                    (Server DI)                      │         │
│        │                                                     │         │
│        └─────────► createExpressDataMiddleware() ───► Data Middleware  │
│                         (/_data endpoint)                    │         │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│                           RUNTIME FLOW                                  │
│                                                                         │
│   Route Config ──► loaderResolver('page') ──► Angular ResolveFn        │
│                                                      │                  │
│                    ┌─────────────────────────────────┤                  │
│                    │                                 │                  │
│                    ▼ (SSR)                          ▼ (Client)          │
│              LOADER_REGISTRY              LoaderDataService             │
│                    │                                 │                  │
│                    ▼                                 │                  │
│              pageLoader()                            │                  │
│                    │                                 ▼                  │
│                    ▼                           POST /_data              │
│              TransferState                           │                  │
│                    │                                 ▼                  │
│                    └───────────────────► Data Middleware                │
│                                                      │                  │
│                                                      ▼                  │
│   LoaderPrefetchService ◄──── Router Events    pageLoader()            │
│         │                                            │                  │
│         └──► LoaderDataService.prefetch() ──────────►│                  │
│                   (parallel optimization)            │                  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## For SDK Users: Implementing Loaders

### Step 1: Create Loader Functions

A loader is an async function that receives context and returns data:

```typescript
// lib/page-loader.ts
import { LoaderFn, notFound } from '@sitecore-content-sdk/angular';
import { client } from './sitecore-client';

export const pageLoader: LoaderFn = async ({ url, params, query }) => {
  // url: The full URL path (e.g., '/about/team')
  // params: Route parameters (e.g., { id: '123' })
  // query: Query string parameters (e.g., { preview: 'true' })

  const page = await client.getPage(url);

  if (!page) {
    // Throw to trigger 404 handling
    notFound();
  }

  return page;
};
```

#### LoaderContext Properties

| Property | Type | Description |
|----------|------|-------------|
| `url` | `string` | The current URL path |
| `params` | `Params` | Route parameters from all matched segments |
| `query` | `Record<string, string \| string[]>` | Query string parameters |
| `req` | `Request` (optional) | Server-only: the incoming request |
| `res` | `Response` (optional) | Server-only: the response object |

#### Control Flow Helpers

```typescript
import { redirect, notFound, serverError } from '@sitecore-content-sdk/angular';

// Redirect to another URL
redirect('/login', 302);  // 301, 302, 307, or 308

// Trigger 404 Not Found
notFound();

// Trigger 500 Internal Server Error
serverError('Database connection failed');
```

### Step 2: Create the Loader Registry

Register all loaders in a central registry:

```typescript
// lib/loaders.ts
import { ErrorPage, LoaderFn } from '@sitecore-content-sdk/angular';
import { pageLoader } from './page-loader';
import { dictionaryLoader } from './dictionary-loader';
import { errorPageLoader } from './not-found-loader';

export const SERVER_LOADERS = {
  dictionary: dictionaryLoader,
  page: pageLoader,
  '404': errorPageLoader(ErrorPage.NotFound),
  '500': errorPageLoader(ErrorPage.InternalServerError),
} as const satisfies Record<string, LoaderFn>;

// Type augmentation for type-safe loader IDs
type ServerLoaderIdMap = typeof SERVER_LOADERS;

declare module '@sitecore-content-sdk/angular' {
  export interface LoaderIdMap extends ServerLoaderIdMap {}
}
```

The type augmentation enables TypeScript to validate loader IDs used in `loaderResolver()`.

### Step 3: Configure Routes

Use `loaderResolver()` in your route configuration:

```typescript
// app/app.routes.ts
import { Routes } from '@angular/router';
import { loaderResolver } from '@sitecore-content-sdk/angular';
import { PageComponent } from './pages/page.component';
import { ShellComponent } from './shared';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    resolve: {
      // Dictionary loads at the root level
      dictionary: loaderResolver('dictionary'),
    },
    children: [
      {
        path: '404',
        component: PageComponent,
        resolve: {
          page: loaderResolver('404'),
        },
      },
      {
        path: '**',
        component: PageComponent,
        resolve: {
          // 'page' loader handles all pages
          page: loaderResolver('page'),
        },
      },
    ],
  },
];
```

### Step 4: Register Loaders in Server Config

```typescript
// app/app.config.server.ts
import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { provideSitecoreContentSdkServer } from '@sitecore-content-sdk/angular';
import { SERVER_LOADERS } from '../lib/loaders';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    // Register loaders for server-side execution
    provideSitecoreContentSdkServer({
      loaders: SERVER_LOADERS,
    }),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
```

### Step 5: Configure Client

```typescript
// app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withNavigationErrorHandler } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {
  provideSitecoreContentSdk,
  handleNavigationError,
} from '@sitecore-content-sdk/angular';
import { routes } from './app.routes';
import { componentMap } from '../../.sitecore/component-map';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideRouter(
      routes,
      // Handle loader errors (notFound, serverError)
      withNavigationErrorHandler(
        handleNavigationError({
          notFoundRoute: '/404',
          internalServerErrorRoute: '/500',
        })
      )
    ),
    provideClientHydration(withEventReplay()),
    provideSitecoreContentSdk({
      componentMap,
      // Prefetch is enabled by default
      // prefetch: false  // to disable
    }),
  ],
};
```

### Step 6: Set Up Express Server

```typescript
// server.ts
import { AngularNodeAppEngine, createNodeRequestHandler } from '@angular/ssr/node';
import express from 'express';
import { createExpressDataMiddleware } from '@sitecore-content-sdk/angular';
import { SERVER_LOADERS } from './lib/loaders';

const app = express();
const angularApp = new AngularNodeAppEngine();

// Parse JSON for POST requests to /_data
app.use(express.json());

// Data middleware handles /_data endpoint
app.use(createExpressDataMiddleware({ loaders: SERVER_LOADERS }));

// Static files
app.use(express.static(browserDistFolder, { maxAge: '1y', index: false }));

// Angular SSR for all other routes
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

app.listen(4000);
```

### Step 7: Access Loader Data in Components

```typescript
// pages/page.component.ts
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-page',
  template: `<h1>{{ page?.title }}</h1>`,
})
export class PageComponent {
  private route = inject(ActivatedRoute);

  // Access resolved data
  page = this.route.snapshot.data['page'];

  // Or reactively
  // page$ = this.route.data.pipe(map(data => data['page']));
}
```

---

## For SDK Contributors: Internal Implementation

### Core Components

#### 1. LoaderFn and LoaderContext (types.ts)

```typescript
export type LoaderContext = {
  url: string;
  params: Params;
  query: Record<string, string | string[]>;
  req?: Request;  // Server only
  res?: Response; // Server only
};

export type LoaderFn<T = unknown> = (ctx: LoaderContext) => Promise<T> | T;
```

#### 2. loaderResolver (loader-resolver.ts)

The core resolver factory that handles SSR, hydration, and CSR:

**Key behaviors:**

- **SSR (server)**: Executes loader directly via `LOADER_REGISTRY`, stores result in `TransferState`
- **Hydration (browser, first load)**: Reads from `TransferState`, removes after use
- **CSR (browser, navigation)**: Fetches via `LoaderDataService`

**Error handling classes:**

```typescript
export class LoaderRedirect extends Error {
  constructor(public location: string, public status: 301 | 302 | 307 | 308 = 302) {}
}

export class LoaderNotFound extends Error {}

export class LoaderHttpError extends Error {
  constructor(public status: number, message = 'Error') {}
}
```

**Loader ID tagging:**

Resolvers are tagged with their loader ID using a Symbol, enabling the prefetch service to discover them:

```typescript
export const LOADER_ID = Symbol('loaderId');

export const getLoaderId = (fn: unknown): string | undefined => {
  if (fn && typeof fn === 'function' && LOADER_ID in fn) {
    return (fn as Record<symbol, string>)[LOADER_ID];
  }
  return undefined;
};
```

#### 3. LoaderDataService (loader-data.service.ts)

Browser-side service for fetching and caching loader data:

**Features:**

- **In-memory caching**: Stores fetched data to avoid duplicate requests
- **Request deduplication**: Pending requests are shared (no parallel requests for same data)
- **Consume-on-read**: Cached data is removed after use (one-time hydration)

**Key methods:**

| Method | Purpose |
|--------|---------|
| `getData(request)` | Get data, using cache or fetching from `/_data` |
| `preload(url, loaderId)` | Fire-and-forget prefetch (link hover) |
| `prefetch(url, loaderId, params, query)` | Full prefetch with context |
| `has(url, loaderId)` | Check if data is cached |
| `clear()` | Clear all cached data |

#### 4. LoaderPrefetchService (loader-prefetch.service.ts)

Optimizes navigation by prefetching all loaders in parallel:

**How it works:**

1. Listens to `ResolveStart` router events
2. Walks the matched route tree
3. Identifies all `loaderResolver` functions using `getLoaderId()`
4. Calls `LoaderDataService.prefetch()` for each (fire-and-forget)

This means when Angular's resolvers run sequentially, the data is already being fetched in parallel.

#### 5. DataMiddleware (server/data-handler.ts)

Handles the `/_data` endpoint on the server:

**Request format:**

```typescript
interface LoaderApiRequest {
  loaderId: string;
  url: string;
  params: Params;
  query: Record<string, any>;
}
```

**Response format:**

```typescript
type LoaderApiResponse =
  | { kind: 'data'; data: any }
  | { kind: 'redirect'; location: string; status: number }
  | { kind: 'error'; status: number; message: string }
  | { kind: 'notFound'; status: number };
```

**Two implementations:**

- `createDataMiddleware`: Uses Fetch API (platform-agnostic)
- `createExpressDataMiddleware`: Express adapter wrapping the above

### TransferState Key Strategy

Keys are generated as `loader:${loaderId}:${url}` to ensure uniqueness:

```typescript
function tsKey(loaderId: string, url: string) {
  return makeStateKey<any>(`loader:${loaderId}:${url}`);
}
```

### SDK Provider Functions

#### provideSitecoreContentSdk (client config)

```typescript
export function provideSitecoreContentSdk(config: SitecoreContentSdkConfig): EnvironmentProviders {
  // Provides:
  // - COMPONENT_MAP (if specified)
  // - LOADER_REGISTRY (empty on client)
  // - LoaderPrefetchService (if prefetch enabled)
}
```

#### provideSitecoreContentSdkServer (server config)

```typescript
export function provideSitecoreContentSdkServer(
  config: SitecoreContentSdkServerConfig
): EnvironmentProviders {
  // Provides:
  // - LOADER_REGISTRY with actual loaders
}
```

---

## API Reference

### Types

| Type | Description |
|------|-------------|
| `LoaderFn<T>` | Loader function signature: `(ctx: LoaderContext) => Promise<T> \| T` |
| `LoaderContext` | Context object with `url`, `params`, `query`, optional `req`/`res` |
| `LoaderId` | String union of registered loader IDs (via type augmentation) |
| `LoaderApiRequest` | Request body for `/_data` endpoint |
| `LoaderApiResponse` | Response union for `/_data` endpoint |

### Functions

| Function | Description |
|----------|-------------|
| `loaderResolver(loaderId)` | Creates an Angular `ResolveFn` for the specified loader |
| `redirect(to, status?)` | Throws `LoaderRedirect` to redirect the user |
| `notFound()` | Throws `LoaderNotFound` to trigger 404 handling |
| `serverError(message?)` | Throws `LoaderHttpError` with status 500 |
| `getLoaderId(fn)` | Extract loader ID from a resolver function (internal) |

### Providers

| Provider | Description |
|----------|-------------|
| `provideSitecoreContentSdk(config)` | Client-side SDK configuration |
| `provideSitecoreContentSdkServer(config)` | Server-side loader registration |
| `provideLoaderPrefetch(config?)` | Enable/configure parallel prefetching |

### Middleware

| Middleware | Description |
|------------|-------------|
| `createDataMiddleware(options)` | Fetch API-based `/_data` handler |
| `createExpressDataMiddleware(options)` | Express middleware for `/_data` |

### DI Tokens

| Token | Description |
|-------|-------------|
| `LOADER_REGISTRY` | Injection token for the loader function map |
| `LOADER_PREFETCH_CONFIG` | Injection token for prefetch configuration |

---

## Complete Example

Here's a complete working example showing all pieces together:

### 1. Loader Functions

```typescript
// lib/page-loader.ts
import { LoaderFn, notFound, redirect } from '@sitecore-content-sdk/angular';
import { client } from './sitecore-client';

export const pageLoader: LoaderFn = async ({ url, query }) => {
  // Handle special preview/edit modes
  if (query.preview === 'true') {
    return client.getPreview(query);
  }

  // Normal page fetch
  const page = await client.getPage(url);

  // Handle redirects from CMS
  if (page?.redirect) {
    redirect(page.redirect.url, page.redirect.status);
  }

  if (!page) {
    notFound();
  }

  return page;
};
```

```typescript
// lib/dictionary-loader.ts
import { LoaderFn, DictionaryPhrases } from '@sitecore-content-sdk/angular';
import { client } from './sitecore-client';
import config from '../sitecore.config';

export const dictionaryLoader: LoaderFn<DictionaryPhrases> = async () => {
  return client.getDictionary({
    site: config.defaultSite,
    locale: config.defaultLanguage,
  });
};
```

### 2. Loader Registry

```typescript
// lib/loaders.ts
import { ErrorPage, LoaderFn } from '@sitecore-content-sdk/angular';
import { pageLoader } from './page-loader';
import { dictionaryLoader } from './dictionary-loader';

export const SERVER_LOADERS = {
  dictionary: dictionaryLoader,
  page: pageLoader,
} as const satisfies Record<string, LoaderFn>;

// Type augmentation
type ServerLoaderIdMap = typeof SERVER_LOADERS;
declare module '@sitecore-content-sdk/angular' {
  export interface LoaderIdMap extends ServerLoaderIdMap {}
}
```

### 3. Routes

```typescript
// app/app.routes.ts
import { Routes } from '@angular/router';
import { loaderResolver } from '@sitecore-content-sdk/angular';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    resolve: { dictionary: loaderResolver('dictionary') },
    children: [
      {
        path: '**',
        component: PageComponent,
        resolve: { page: loaderResolver('page') },
      },
    ],
  },
];
```

### 4. Server Configuration

```typescript
// app/app.config.server.ts
import { provideSitecoreContentSdkServer } from '@sitecore-content-sdk/angular';
import { SERVER_LOADERS } from '../lib/loaders';

const serverConfig: ApplicationConfig = {
  providers: [
    provideSitecoreContentSdkServer({ loaders: SERVER_LOADERS }),
  ],
};
```

### 5. Express Server

```typescript
// server.ts
import express from 'express';
import { createExpressDataMiddleware } from '@sitecore-content-sdk/angular';
import { SERVER_LOADERS } from './lib/loaders';

const app = express();
app.use(express.json());
app.use(createExpressDataMiddleware({ loaders: SERVER_LOADERS }));
// ... rest of server setup
```

---

## Troubleshooting

### Common Issues

**"No loader registered for id 'xyz'"**
- Ensure the loader is added to `SERVER_LOADERS`
- Verify `provideSitecoreContentSdkServer()` is configured in server config

**Data fetched twice**
- Check that `TransferState` is properly configured
- Ensure `provideClientHydration()` is in app config

**404 not working**
- Verify `withNavigationErrorHandler()` is configured
- Ensure error route exists in routes config

**Prefetch not working**
- Check that `prefetch: false` isn't set in `provideSitecoreContentSdk()`
- Verify the loader resolver uses `loaderResolver()` (not a custom resolver)
