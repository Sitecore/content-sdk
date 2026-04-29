# Loader Cache Injection Architecture

This document explores injecting the loader cache with a real implementation on server and an empty stub on client, ensuring the same cache instance is used by both `loaderResolver` (Angular DI) and Express middleware.

---

## Problem Statement

The current `LoaderResultCache` in `loader-result-cache.ts`:
1. Imports `unstorage` at module load time
2. Gets exported from `public-api.ts`
3. Is imported by `loader-resolver.ts`

This pulls Node.js dependencies into the browser bundle, breaking builds.

**Goal:** Keep cache functionality on server, provide a no-op stub on browser, and ensure both `loaderResolver` and `createLoaderDataServiceMiddleware` use the **same cache instance** for consistency.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              server.ts                                       │
│                                                                              │
│   const loaderCache = LoaderResultCache.forConfig(scConfig);                │
│                           │                                                  │
│           ┌───────────────┴───────────────┐                                  │
│           ▼                               ▼                                  │
│   ┌───────────────────┐       ┌───────────────────────────────┐             │
│   │ Angular SSR App   │       │ Express Middleware            │             │
│   │                   │       │                               │             │
│   │ provideSitecore-  │       │ createLoaderDataService-      │             │
│   │ Angular({         │       │ Middleware({                  │             │
│   │   loaderCache,    │       │   loaders,                    │             │
│   │   ...             │       │   loaderCache,  ← same        │             │
│   │ })                │       │ })                            │             │
│   │                   │       │                               │             │
│   │ loaderResolver()  │       │ executeLoader()               │             │
│   │ injects cache     │       │ uses cache                    │             │
│   └───────────────────┘       └───────────────────────────────┘             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              Browser                                         │
│                                                                              │
│   provideSitecoreAngular({                                                   │
│     // no loaderCache provided → uses NullLoaderCache stub                  │
│   })                                                                         │
│                                                                              │
│   loaderResolver() → inject(LOADER_RESULT_CACHE_TOKEN) → NullLoaderCache    │
│                    → isEnabled() returns false                              │
│                    → skips cache, delegates to LoaderDataService            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Key Design Decisions

### 1. Abstract Interface (Browser-Safe)

Define a minimal interface that both server and browser can implement without importing `unstorage`:

```typescript
// loaders/loader-cache.interface.ts (NEW FILE - browser-safe)

import type { LoaderApiResponse } from './models';

/**
 * Abstract interface for loader result caching.
 * Server provides real implementation; browser uses a no-op stub.
 * @public
 */
export interface ILoaderResultCache {
  /** Whether caching is enabled */
  isEnabled(): boolean;
  
  /** Get cached response, or null if not cached/expired */
  get(key: string): Promise<LoaderApiResponse | null>;
  
  /** Store response in cache (fire-and-forget safe) */
  set(key: string, response: LoaderApiResponse): Promise<void>;
}

/**
 * No-op cache implementation for browser.
 * Always returns null, does nothing on set.
 * @public
 */
export class NullLoaderCache implements ILoaderResultCache {
  isEnabled(): boolean {
    return false;
  }
  
  async get(_key: string): Promise<LoaderApiResponse | null> {
    return null;
  }
  
  async set(_key: string, _response: LoaderApiResponse): Promise<void> {
    // No-op
  }
}

/**
 * Singleton browser stub instance.
 */
export const NULL_LOADER_CACHE = new NullLoaderCache();
```

### 2. Injection Token

```typescript
// lib/tokens.ts (ADD)

import { InjectionToken } from '@angular/core';
import type { ILoaderResultCache } from '../loaders/loader-cache.interface';

/**
 * Injection token for the loader result cache.
 * On server: provide the real LoaderResultCache instance.
 * On browser: defaults to NullLoaderCache (no-op).
 * @public
 */
export const LOADER_RESULT_CACHE_TOKEN = new InjectionToken<ILoaderResultCache>(
  'LOADER_RESULT_CACHE_TOKEN'
);
```

### 3. Server Implementation Stays Separate

The real `LoaderResultCache` class (with unstorage) stays in `loader-result-cache.ts` but:
- **NOT** exported from `public-api.ts` directly
- Only imported in server-side code (`server.ts`)
- Implements `ILoaderResultCache` interface

```typescript
// loaders/loader-result-cache.ts (MODIFY)

import type { ILoaderResultCache } from './loader-cache.interface';

export class LoaderResultCache implements ILoaderResultCache {
  // ... existing implementation unchanged
}
```

### 4. Provider Setup

```typescript
// lib/providers.ts (MODIFY)

import type { ILoaderResultCache } from '../loaders/loader-cache.interface';
import { NULL_LOADER_CACHE } from '../loaders/loader-cache.interface';
import { LOADER_RESULT_CACHE_TOKEN } from './tokens';

export interface SitecoreAngularConfig {
  sitecoreConfig?: SitecoreConfig;
  sitecoreClient?: SitecoreClient;
  notFoundRoute?: string;
  errorRoute?: string;
  
  /**
   * Loader result cache instance. On server, pass the real LoaderResultCache.
   * On browser, omit or pass null to use the no-op stub.
   * @example
   * // server.ts
   * const loaderCache = LoaderResultCache.forConfig(scConfig);
   * provideSitecoreAngular({ loaderCache, sitecoreConfig: scConfig, ... })
   */
  loaderCache?: ILoaderResultCache | null;
}

export function provideSitecoreAngular(config: SitecoreAngularConfig): EnvironmentProviders {
  const providers = [];
  
  // ... existing providers ...
  
  // Loader cache: use provided instance or default to null cache
  const loaderCache = config.loaderCache ?? NULL_LOADER_CACHE;
  providers.push({ provide: LOADER_RESULT_CACHE_TOKEN, useValue: loaderCache });
  
  return makeEnvironmentProviders(providers);
}
```

---

## Integration with loaderResolver

```typescript
// loaders/loader-resolver.ts (MODIFY)

import { LOADER_RESULT_CACHE_TOKEN } from '../lib/tokens';
import type { ILoaderResultCache } from './loader-cache.interface';
import { buildLoaderCacheKeyString } from './loader-cache.interface'; // Move pure function here

export const loaderResolver = (loaderId: LoaderId): ResolveFn<unknown> => {
  const resolver = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    // ... existing code ...
    
    if (isPlatformBrowser(platformId)) {
      // Browser path: no cache access, delegates to LoaderDataService
      return await resolveOnBrowser(route, state, loaderId, router);
    }
    
    // Server path: use injected cache
    const loaderCache = inject(LOADER_RESULT_CACHE_TOKEN, { optional: true });
    const cacheKeyMaterial = buildLoaderCacheKeyString(loaderId, url);
    
    const cached = await tryReadFromCache(loaderCache ?? null, cacheKeyMaterial);
    // ... rest of server logic ...
  };
  
  return resolver;
};
```

---

## Integration with Express Middleware

The middleware receives the cache instance via options (not Angular DI):

```typescript
// server/loader-data-service-middleware.ts (MODIFY)

import type { ILoaderResultCache } from '../loaders/loader-cache.interface';
import { buildLoaderCacheKeyString, shouldCacheLoaderResponse } from '../loaders/loader-cache.interface';

export interface ExpressDataHandlerOptions {
  loaders: LoaderRegistry;
  endpoint?: string;
  extractRequestContext?: (req: ExpressRequest) => RequestContext;
  
  /**
   * Loader result cache instance. Pass the same instance used by Angular SSR
   * to ensure cache consistency between SSR and client navigation requests.
   */
  loaderCache?: ILoaderResultCache | null;
  
  /** @deprecated Use loaderCache instead */
  sitecoreConfig?: SitecoreConfig;
}

export function createLoaderDataServiceMiddleware(
  options: ExpressDataHandlerOptions
): ExpressMiddleware {
  const {
    loaders,
    endpoint = LOADER_DATA_ENDPOINT,
    extractRequestContext: extractReq = extractRequestContext,
    loaderCache = null,  // Direct cache instance
    sitecoreConfig,      // Legacy: create cache from config
  } = options;
  
  // Support both new (loaderCache) and legacy (sitecoreConfig) patterns
  const cache = loaderCache ?? (sitecoreConfig ? getLoaderResultCache(sitecoreConfig) : null);
  
  return async (req, res, next) => {
    // ... use `cache` instead of creating from sitecoreConfig ...
  };
}
```

---

## Usage in server.ts

```typescript
// server.ts (MODIFY)

import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

// Server-only imports
import { createLoaderDataServiceMiddleware } from '@sitecore-content-sdk/angular';
import { LoaderResultCache } from '@sitecore-content-sdk/angular/server'; // NEW: server-only path
import { LOADERS } from './content-sdk/loaders';
import scConfig from './sitecore.config';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();

// Create single cache instance for the entire server process
const loaderCache = LoaderResultCache.forConfig(scConfig);

const angularApp = new AngularNodeAppEngine({
  // Pass cache to Angular app
  bootstrap: () => import('./main.server').then(m => m.bootstrap({
    loaderCache,
  })),
});

// Pass same cache instance to Express middleware
app.use(express.json());
app.use(createLoaderDataServiceMiddleware({ 
  loaders: LOADERS,
  loaderCache,  // Same instance as Angular
}));

// ... rest of server setup ...
```

---

## Usage in app.config.ts (Browser)

```typescript
// app.config.ts (NO CHANGE NEEDED)

export const appConfig: ApplicationConfig = {
  providers: [
    provideSitecoreAngular({
      notFoundRoute: '/404',
      errorRoute: '/500',
      sitecoreConfig: scConfig,
      sitecoreClient: getClient(),
      // loaderCache omitted → uses NullLoaderCache automatically
    }),
    // ...
  ],
};
```

---

## Usage in app.config.server.ts

```typescript
// app.config.server.ts (MODIFY)

import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { provideSitecoreAngular } from '@sitecore-content-sdk/angular';
import type { ILoaderResultCache } from '@sitecore-content-sdk/angular';

// Cache instance passed from server.ts bootstrap
let serverLoaderCache: ILoaderResultCache | null = null;

export function setServerLoaderCache(cache: ILoaderResultCache) {
  serverLoaderCache = cache;
}

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    // Override the browser's null cache with the real server cache
    ...(serverLoaderCache ? [
      { provide: LOADER_RESULT_CACHE_TOKEN, useValue: serverLoaderCache }
    ] : []),
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
```

---

## File Structure Changes

```
packages/angular/src/
├── loaders/
│   ├── loader-cache.interface.ts    # NEW: ILoaderResultCache, NullLoaderCache (browser-safe)
│   ├── loader-result-cache.ts       # KEEP: Real implementation (unstorage) - NOT in public-api
│   ├── loader-resolver.ts           # MODIFY: Use injected cache
│   └── models.ts                    # KEEP: Types
├── server/
│   ├── loader-data-service-middleware.ts  # MODIFY: Accept loaderCache option
│   └── index.ts                     # MODIFY: Export LoaderResultCache for server-only import
├── lib/
│   ├── tokens.ts                    # MODIFY: Add LOADER_RESULT_CACHE_TOKEN
│   └── providers.ts                 # MODIFY: Accept loaderCache in config
└── public-api.ts                    # MODIFY: Export interface, NOT real cache class
```

---

## Public API Exports

```typescript
// public-api.ts (MODIFY)

// Browser-safe exports
export {
  ILoaderResultCache,
  NullLoaderCache,
  NULL_LOADER_CACHE,
  buildLoaderCacheKeyString,
  shouldCacheLoaderResponse,
} from './loaders/loader-cache.interface';

export { LOADER_RESULT_CACHE_TOKEN } from './lib/tokens';

// DO NOT export LoaderResultCache or getLoaderResultCache here
// Those are server-only and exported from ./server
```

```typescript
// server/index.ts (MODIFY)

export { LoaderResultCache, getLoaderResultCache } from '../loaders/loader-result-cache';
export { createLoaderDataServiceMiddleware, createExpressDataMiddleware } from './loader-data-service-middleware';
// ... other server exports
```

---

## Cache Consistency Guarantee

The key to consistency is that **both paths use the exact same object reference**:

```typescript
// server.ts
const loaderCache = LoaderResultCache.forConfig(scConfig);  // Single instance

// Passed to Angular SSR
angularApp.bootstrap({ loaderCache });

// Passed to Express middleware  
createLoaderDataServiceMiddleware({ loaderCache });

// Both now share:
// - Same in-memory Map (for memory driver)
// - Same unstorage connection (for other drivers)
// - Same TTL/expiration logic
```

**Result:** 
- SSR request caches page data
- Browser navigation request (via `/_data`) hits the same cache
- No cache duplication or inconsistency

---

## Data Flow with Injection

### SSR Request

```
1. Express receives request
2. angularApp.handle(req) starts Angular SSR
3. loaderResolver() runs:
   - inject(LOADER_RESULT_CACHE_TOKEN) → gets real LoaderResultCache
   - tryReadFromCache() → checks cache
   - HIT: return cached data, skip loader
   - MISS: run loader, persistIntoCache(), set TransferState
4. Angular renders HTML with data
5. Response sent with TransferState embedded
```

### Browser Hydration

```
1. Angular bootstraps in browser
2. loaderResolver() runs:
   - isPlatformBrowser() → true
   - resolveOnBrowser() → reads TransferState
   - Returns hydrated data (no HTTP call)
```

### Client Navigation

```
1. User clicks link
2. loaderResolver() runs in browser:
   - isPlatformBrowser() → true
   - resolveOnBrowser() → TransferState empty
   - LoaderDataService.getData() → POST /_data
3. Express middleware receives /_data request:
   - Uses same loaderCache instance as SSR
   - tryReadFromCache() → may HIT from SSR's cache
   - Returns cached or fresh data
4. Browser receives response, displays page
```

---

## Migration Checklist

- [ ] Create `loader-cache.interface.ts` with `ILoaderResultCache`, `NullLoaderCache`
- [ ] Move `buildLoaderCacheKeyString`, `shouldCacheLoaderResponse` to interface file
- [ ] Add `LOADER_RESULT_CACHE_TOKEN` to `tokens.ts`
- [ ] Update `SitecoreAngularConfig` to accept `loaderCache`
- [ ] Update `provideSitecoreAngular` to provide cache token
- [ ] Update `loaderResolver` to use injected cache
- [ ] Update `createLoaderDataServiceMiddleware` to accept `loaderCache` option
- [ ] Update `public-api.ts` exports (interface only, not class)
- [ ] Update `server/index.ts` exports (class for server-only)
- [ ] Update template `server.ts` to create and pass cache instance
- [ ] Update template `app.config.server.ts` to receive cache
- [ ] Run tests
- [ ] Build `angular-csdk` sample to verify browser bundle is clean

---

## Design Decisions

1. **Bootstrap pattern:** Keep the current module-level singleton pattern (`LoaderResultCache.forConfig()`). The singleton is created once in `server.ts` and shared.

2. **Development mode:** Cache should be **disabled** in dev to avoid stale data during development. Control via:
   ```typescript
   // sitecore.config.ts
   angular: {
     loaderCache: {
       enabled: process.env.NODE_ENV === 'production',
       // ...
     }
   }
   ```

3. **Multi-instance / serverless:** Cache storage should be **configurable** via unstorage drivers. In serverless environments with multiple instances, use shared storage:
   ```typescript
   // Production with Redis (shared across instances)
   angular: {
     loaderCache: {
       enabled: true,
       driver: 'redis',
       driverOptions: { url: process.env.REDIS_URL },
       ttlSeconds: 60,
     }
   }
   
   // Vercel with KV
   angular: {
     loaderCache: {
       enabled: true,
       driver: 'vercel-kv',
       driverOptions: {},
       ttlSeconds: 60,
     }
   }
   
   // Single instance (memory is fine)
   angular: {
     loaderCache: {
       enabled: true,
       driver: 'memory',
       driverOptions: {},
       ttlSeconds: 60,
     }
   }
   ```
