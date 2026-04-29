# Route Props Cache Architecture

This document describes the current loader system and a proposed route-level caching approach with personalization support.

---

## Current Architecture: Individual Loader Cache

### Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SSR Request                                     │
│  loaderResolver() → check LoaderResultCache → run loader → TransferState    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Browser Hydration                                  │
│  loaderResolver() → read TransferState → return cached data                 │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Client Navigation                                    │
│  loaderResolver() → LoaderDataService.getData() → POST /_loader → Express   │
│  Express middleware → check LoaderResultCache → run loader → return JSON    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Key Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `loaderResolver` | `loaders/loader-resolver.ts` | Route resolver that dispatches to server/browser paths |
| `LoaderResultCache` | `loaders/loader-result-cache.ts` | Server-side cache backed by unstorage |
| `LoaderDataService` | `loaders/loader-data.service.ts` | Browser service for fetching data via `/_loader` |
| `createLoaderDataServiceMiddleware` | `server/loader-data-service-middleware.ts` | Express middleware handling `/_loader` requests |

### Current Cache Strategy

- **Granularity:** Per loader × URL (`loader:${loaderId}:${url}`)
- **Storage:** unstorage (memory, fs, lru-cache, vercel-kv, etc.)
- **TTL:** Configurable via `angular.loaderCache.ttlSeconds`
- **Scope:** Server-only (SSR and Express middleware share the same cache instance)

### Limitations

1. **Browser bundle pollution:** `loader-result-cache.ts` imports unstorage, which pulls Node.js dependencies into the browser bundle
2. **Multiple cache lookups:** Each loader for a route is cached separately
3. **Multiple HTTP requests:** Client navigation makes one `/_loader` request per loader
4. **No personalization awareness:** Cache key doesn't account for personalized variants

---

## Proposed Architecture: Route Props Cache

### Concept

Cache the **aggregate props** for an entire route (all loaders' combined output) rather than individual loader results. Add personalization support by including a **variant ID** in the cache key.

### Data Shape

```typescript
interface RoutePropsEntry {
  v: 1;
  path: string;
  variantId: string;           // Personalization variant (or "default")
  props: Record<string, any>;  // { [loaderId]: loaderResult }
  createdAt: number;
  expiresAt: number;
  tags?: string[];             // For invalidation: ["site:mysite", "page:abc123"]
}
```

### Cache Key Structure

```
route-props:${locale}:${variantId}:${path}

Examples:
  route-props:en:default:/home
  route-props:en:variant-abc123:/home
  route-props:de:default:/products/shoes
```

### Data Flow with Personalization

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Request                                         │
│                                 │                                            │
│                                 ▼                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  1. Call Personalize Endpoint                                        │    │
│  │     POST /api/personalize { path, cookies, headers, ... }            │    │
│  │     Response: { variantId: "variant-abc123" | "default" }            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                 │                                            │
│                                 ▼                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  2. Check Route Props Cache                                          │    │
│  │     key = route-props:${locale}:${variantId}:${path}                 │    │
│  │                                                                       │    │
│  │     HIT  → Return cached props                                       │    │
│  │     MISS → Continue to step 3                                        │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                 │                                            │
│                                 ▼                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  3. Execute All Loaders                                              │    │
│  │     props = await Promise.all(loaders.map(l => l(context)))          │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                 │                                            │
│                                 ▼                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  4. Cache Route Props                                                │    │
│  │     routePropsCache.set(key, { props, variantId, ... })              │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                 │                                            │
│                                 ▼                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  5. Return Props                                                     │    │
│  │     SSR: Populate TransferState, render Angular                      │    │
│  │     Browser: Return JSON via /_data (cached route props)             │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Personalization Integration

### Personalize Endpoint

Before checking the route props cache, the system must determine which personalization variant applies to the current request.

```typescript
interface PersonalizeRequest {
  path: string;
  locale: string;
  cookies: Record<string, string>;
  headers: Record<string, string>;
  geo?: { country?: string; region?: string; city?: string };
}

interface PersonalizeResponse {
  variantId: string;  // "default" if no personalization applies
  // Optional: include resolved audience/segment info for debugging
  audiences?: string[];
}
```

### Variant Resolution Flow

```typescript
async function resolveVariant(req: Request): Promise<string> {
  // 1. Check if personalization is enabled
  if (!config.personalization.enabled) {
    return 'default';
  }

  // 2. Check for explicit variant override (preview/testing)
  const overrideVariant = req.cookies['sc_variant'] || req.query['variant'];
  if (overrideVariant) {
    return overrideVariant;
  }

  // 3. Call personalize endpoint
  const response = await fetch(config.personalization.endpoint, {
    method: 'POST',
    body: JSON.stringify({
      path: req.path,
      locale: req.locale,
      cookies: req.cookies,
      headers: extractRelevantHeaders(req),
      geo: req.geo,
    }),
  });

  const { variantId } = await response.json();
  return variantId || 'default';
}
```

### Caching Considerations for Personalization

| Scenario | Cache Strategy |
|----------|----------------|
| **Anonymous, no personalization** | Cache with `variantId: "default"` |
| **Anonymous, personalized by segment** | Cache per `variantId` (shared across users in same segment) |
| **Authenticated user** | Consider not caching, or cache with user-specific key |
| **A/B test variant** | Cache per variant ID |
| **Geo-targeted content** | Include geo in cache key or variant ID |

### When to Skip Cache

```typescript
function shouldSkipCache(req: Request): boolean {
  // Sitecore editing/preview mode
  if (req.cookies['sc_site'] || req.query['sc_mode']) return true;
  
  // Explicit cache bypass
  if (req.headers['cache-control'] === 'no-cache') return true;
  
  // Authenticated users (optional, depends on requirements)
  if (req.cookies['auth_token'] && !config.cacheAuthenticatedUsers) return true;
  
  return false;
}
```

---

## API Design

Two separate endpoints with distinct responsibilities:

| Endpoint | Purpose | Cache |
|----------|---------|-------|
| `/_loader` | Execute individual loaders (no cache) | No |
| `/_data` | Get cached route props | Yes |

### `/_loader` Endpoint (Loader Execution)

Executes a single loader directly, bypassing cache. Used as fallback or for non-cacheable loaders.

```http
POST /_loader
Content-Type: application/json

{
  "loaderId": "page",
  "url": "/about",
  "params": {},
  "query": {}
}
```

Response:
```json
{
  "kind": "data",
  "data": { "title": "About Us", ... }
}
```

### `/_data` Endpoint (Cached Route Props)

Returns cached route props (all loaders' output for a route). Includes personalization variant resolution.

```http
POST /_data
Content-Type: application/json

{
  "path": "/about",
  "locale": "en"
}
```

Response:
```json
{
  "kind": "routeProps",
  "variantId": "default",
  "props": {
    "page": { "title": "About Us", ... },
    "layout": { "nav": [...], ... }
  },
  "cached": true,
  "ttl": 45
}
```

### Endpoint Comparison

| Aspect | `/_loader` | `/_data` |
|--------|-----------|----------|
| **Granularity** | Single loader | All loaders for route |
| **Caching** | None | Route props cache |
| **Personalization** | N/A | Resolves variant ID |
| **Use case** | Fallback, dynamic data | Primary route data |
| **Response** | `LoaderDataResponse` | `RoutePropsResponse` |

### TypeScript Interfaces

```typescript
// /_loader request/response
interface LoaderRequest {
  loaderId: string;
  url: string;
  params?: Record<string, string>;
  query?: Record<string, string | string[]>;
}

interface LoaderResponse {
  kind: 'data';
  data: any;
}

// /_data request/response
interface RoutePropsRequest {
  path: string;
  locale?: string;
  // Explicit variant override (for testing/preview)
  variantId?: string;
}

interface RoutePropsResponse {
  kind: 'routeProps';
  variantId: string;
  props: Record<string, any>;
  cached: boolean;
  ttl?: number;  // Seconds until expiration (for client-side cache hints)
}

// Shared
interface ErrorResponse {
  kind: 'error';
  status: number;
  message: string;
}

interface NotFoundResponse {
  kind: 'notFound';
  status: 404;
}

interface RedirectResponse {
  kind: 'redirect';
  redirect: {
    loaderRedirectTarget: string;
    status?: number;
  };
}

type LoaderEndpointResponse = LoaderResponse | ErrorResponse | NotFoundResponse | RedirectResponse;
type DataEndpointResponse = RoutePropsResponse | ErrorResponse | NotFoundResponse | RedirectResponse;
```

### Client Usage Pattern

```typescript
// LoaderDataService
@Injectable({ providedIn: 'root' })
export class LoaderDataService {
  private readonly loaderEndpoint = '/_loader';
  private readonly dataEndpoint = '/_data';
  
  /**
   * Get cached route props (primary method for client navigation)
   */
  async getRouteProps(path: string, locale?: string): Promise<RoutePropsResponse> {
    return this.http.post<RoutePropsResponse>(this.dataEndpoint, { path, locale });
  }
  
  /**
   * Execute single loader directly (fallback, bypasses cache)
   */
  async executeLoader(request: LoaderRequest): Promise<LoaderResponse> {
    return this.http.post<LoaderResponse>(this.loaderEndpoint, request);
  }
}
```

---

## Integration with Existing Loaders System

### Changes to `loaderResolver`

```typescript
// Current: Each resolver runs independently
export const loaderResolver = (loaderId: LoaderId): ResolveFn<unknown> => {
  return async (route, state) => {
    // ... runs one loader
  };
};

// Proposed: Resolvers check shared route props first
export const loaderResolver = (loaderId: LoaderId): ResolveFn<unknown> => {
  return async (route, state) => {
    const url = state.url;
    
    // Browser: Check if route props were pre-fetched
    if (isPlatformBrowser(platformId)) {
      const routeProps = inject(ROUTE_PROPS_TOKEN, { optional: true });
      if (routeProps?.[loaderId]) {
        return routeProps[loaderId];
      }
      // Fallback to existing LoaderDataService flow
    }
    
    // Server: Route props are populated before resolvers run
    // (handled by a parent resolver or APP_INITIALIZER)
  };
};
```

### New: Route Props Resolver

A top-level resolver that fetches all route props before individual loaders run:

```typescript
export const routePropsResolver: ResolveFn<Record<string, any>> = async (route, state) => {
  const transferState = inject(TransferState);
  const platformId = inject(PLATFORM_ID);
  const url = state.url;
  const key = makeStateKey<Record<string, any>>(`route-props:${url}`);
  
  // Check TransferState first (hydration)
  if (transferState.hasKey(key)) {
    const props = transferState.get(key, {});
    transferState.remove(key);
    return props;
  }
  
  if (isPlatformBrowser(platformId)) {
    // Browser: Fetch route props via /_data
    const loaderData = inject(LoaderDataService);
    return await loaderData.getRouteProps(url);
  }
  
  // Server: Fetch from cache or execute loaders
  // (This runs in Express context, has access to route props cache)
  const routePropsCache = inject(ROUTE_PROPS_CACHE_TOKEN);
  const variantId = inject(VARIANT_ID_TOKEN);
  
  const cacheKey = `route-props:${variantId}:${url}`;
  const cached = await routePropsCache.get(cacheKey);
  if (cached) {
    transferState.set(key, cached.props);
    return cached.props;
  }
  
  // Cache miss: run all loaders, cache result
  const props = await executeAllLoaders(route, state);
  await routePropsCache.set(cacheKey, { props, variantId, ... });
  transferState.set(key, props);
  return props;
};
```

### Changes to `LoaderDataService`

```typescript
@Injectable({ providedIn: 'root' })
export class LoaderDataService {
  private readonly loaderEndpoint = '/_loader';  // Direct loader execution
  private readonly dataEndpoint = '/_data';      // Cached route props
  
  // Existing: per-loader data fetching (now uses /_loader)
  async getData(request: LoaderDataRequest): Promise<LoaderApiResponse> {
    // POST /_loader for individual loader execution (fallback)
    return firstValueFrom(
      this.http.post<LoaderApiResponse>(this.loaderEndpoint, request)
    );
  }
  
  // New: route-level props fetching (uses /_data with cache)
  async getRouteProps(path: string, locale?: string): Promise<Record<string, any>> {
    const cacheKey = `${locale || 'default'}:${path}`;
    const cached = this.routePropsCache.get(cacheKey);
    if (cached) return cached;
    
    const response = await firstValueFrom(
      this.http.post<RoutePropsResponse>(this.dataEndpoint, { path, locale })
    );
    
    if (response.kind === 'routeProps') {
      this.routePropsCache.set(cacheKey, response.props);
      return response.props;
    }
    
    throw new Error('Failed to fetch route props');
  }
  
  // New: prefetch for link hover/intersection
  prefetchRouteProps(path: string, locale?: string): void {
    const cacheKey = `${locale || 'default'}:${path}`;
    if (this.routePropsCache.has(cacheKey) || this.pendingRouteProps.has(cacheKey)) {
      return;
    }
    const promise = this.getRouteProps(path, locale);
    this.pendingRouteProps.set(cacheKey, promise);
    promise.finally(() => this.pendingRouteProps.delete(cacheKey));
  }
}
```

### Changes to Express Middleware

Two separate middleware functions for the two endpoints:

```typescript
/**
 * /_loader endpoint: Direct loader execution (no cache)
 * Renamed from createLoaderDataServiceMiddleware
 */
export function createLoaderMiddleware(options: LoaderMiddlewareOptions): ExpressMiddleware {
  const { loaders, endpoint = '/_loader' } = options;
  
  return async (req, res, next) => {
    if (req.path !== endpoint) return next();
    
    const { loaderId, url, params, query } = req.body;
    
    const loader = loaders[loaderId];
    if (!loader) {
      return res.status(400).json({ kind: 'error', status: 400, message: `Unknown loader: ${loaderId}` });
    }
    
    try {
      const result = await loader({ url, params, query, requestContext: extractRequestContext(req) });
      
      if (isLoaderRedirectResult(result)) {
        return res.json({ kind: 'redirect', redirect: result });
      }
      
      return res.json({ kind: 'data', data: result });
    } catch (error) {
      if (error instanceof NotFoundNavigationError) {
        return res.json({ kind: 'notFound', status: 404 });
      }
      return res.status(500).json({ kind: 'error', status: 500, message: error.message });
    }
  };
}

/**
 * /_data endpoint: Cached route props with personalization
 */
export function createDataMiddleware(options: DataMiddlewareOptions): ExpressMiddleware {
  const { 
    loaders, 
    routePropsCache, 
    personalizeEndpoint,
    endpoint = '/_data',
    ttlSeconds = 60,
  } = options;
  
  return async (req, res, next) => {
    if (req.path !== endpoint) return next();
    
    const { path, locale } = req.body;
    
    // 1. Resolve personalization variant
    const variantId = await resolveVariant(req, personalizeEndpoint);
    
    // 2. Check route props cache
    const cacheKey = `route-props:${locale || 'default'}:${variantId}:${path}`;
    const cached = await routePropsCache.get(cacheKey);
    
    if (cached && !isExpired(cached)) {
      return res.json({
        kind: 'routeProps',
        variantId,
        props: cached.props,
        cached: true,
        ttl: Math.max(0, Math.floor((cached.expiresAt - Date.now()) / 1000)),
      });
    }
    
    // 3. Execute all loaders in parallel
    const props: Record<string, any> = {};
    const loaderEntries = Object.entries(loaders);
    
    const results = await Promise.allSettled(
      loaderEntries.map(async ([id, loader]) => {
        const result = await loader({ 
          url: path, 
          params: {}, 
          query: {},
          requestContext: extractRequestContext(req),
        });
        return { id, result };
      })
    );
    
    for (const result of results) {
      if (result.status === 'fulfilled') {
        const { id, result: loaderResult } = result.value;
        if (!isLoaderRedirectResult(loaderResult)) {
          props[id] = loaderResult;
        }
      }
    }
    
    // 4. Cache result
    const entry = {
      props,
      variantId,
      createdAt: Date.now(),
      expiresAt: Date.now() + (ttlSeconds * 1000),
    };
    await routePropsCache.set(cacheKey, entry);
    
    return res.json({
      kind: 'routeProps',
      variantId,
      props,
      cached: false,
      ttl: ttlSeconds,
    });
  };
}
```

### server.ts Usage

```typescript
// server.ts
import { createLoaderMiddleware, createDataMiddleware } from '@sitecore-content-sdk/angular/server';

const app = express();
app.use(express.json());

// /_loader: Direct loader execution (fallback)
app.use(createLoaderMiddleware({ loaders: LOADERS }));

// /_data: Cached route props (primary)
app.use(createDataMiddleware({ 
  loaders: LOADERS,
  routePropsCache,
  personalizeEndpoint: process.env.PERSONALIZE_ENDPOINT,
  ttlSeconds: 60,
}));
```

---

## Configuration

### Sitecore Config Extension

```typescript
interface SitecoreAngularConfig {
  // Existing
  loaderCache: {
    enabled: boolean;
    driver: string;
    driverOptions: Record<string, unknown>;
    ttlSeconds: number;
  };
  
  // New
  routePropsCache: {
    enabled: boolean;
    driver: string;
    driverOptions: Record<string, unknown>;
    ttlSeconds: number;
    // Routes to cache (glob patterns)
    include?: string[];  // e.g., ['/home', '/products/**']
    // Routes to exclude from caching
    exclude?: string[];  // e.g., ['/account/**', '/checkout']
  };
  
  personalization: {
    enabled: boolean;
    endpoint: string;  // e.g., 'https://personalize.sitecore.cloud/v1/resolve'
    // Fallback variant when personalize endpoint fails
    fallbackVariant: string;  // default: 'default'
  };
}
```

---

## ISR (Incremental Static Regeneration) Pattern

### Stale-While-Revalidate

```typescript
async function getRoutePropsWithISR(cacheKey: string, options: ISROptions) {
  const cached = await routePropsCache.get(cacheKey);
  
  if (cached) {
    const now = Date.now();
    const isExpired = now > cached.expiresAt;
    const isStale = now > cached.revalidateAfter;
    
    if (isExpired) {
      // Hard expired: must revalidate synchronously
      return await revalidateAndReturn(cacheKey);
    }
    
    if (isStale) {
      // Soft stale: return cached, revalidate in background
      triggerBackgroundRevalidation(cacheKey);
    }
    
    return cached.props;
  }
  
  // Cache miss: fetch and cache
  return await revalidateAndReturn(cacheKey);
}

function triggerBackgroundRevalidation(cacheKey: string) {
  // Fire-and-forget: don't await
  revalidateRouteProps(cacheKey).catch(err => {
    console.error('Background revalidation failed:', err);
  });
}
```

### Cache Entry with ISR Fields

```typescript
interface RoutePropsEntry {
  v: 1;
  path: string;
  variantId: string;
  props: Record<string, any>;
  createdAt: number;
  expiresAt: number;       // Hard expiration (remove from cache)
  revalidateAfter: number; // Soft expiration (trigger background refresh)
  tags?: string[];
}
```

---

## Cache Invalidation

### Tag-Based Invalidation

```typescript
// When content changes, invalidate by tag
async function invalidateByTag(tag: string) {
  const keys = await routePropsCache.getKeys();
  
  for (const key of keys) {
    const entry = await routePropsCache.get(key);
    if (entry?.tags?.includes(tag)) {
      await routePropsCache.removeItem(key);
    }
  }
}

// Usage: Webhook from CMS
app.post('/api/invalidate', async (req, res) => {
  const { tag, path } = req.body;
  
  if (tag) {
    await invalidateByTag(tag);
  }
  
  if (path) {
    // Invalidate all variants of a path
    const keys = await routePropsCache.getKeys();
    for (const key of keys) {
      if (key.includes(`:${path}`)) {
        await routePropsCache.removeItem(key);
      }
    }
  }
  
  res.json({ invalidated: true });
});
```

### Tagging Strategy

| Content Type | Tag Pattern | Example |
|--------------|-------------|---------|
| Page item | `page:${itemId}` | `page:abc123` |
| Site | `site:${siteName}` | `site:mysite` |
| Template | `template:${templateId}` | `template:article` |
| Datasource | `datasource:${itemId}` | `datasource:xyz789` |

---

## Migration Path

### Phase 1: Browser-Safe Refactor
1. Move `LoaderResultCache` to server-only entry point
2. Use injection token in `loaderResolver`
3. Existing per-loader cache still works

### Phase 2: Route Props Cache
1. Rename existing `/_data` to `/_loader` (direct loader execution, no cache)
2. Add new `/_data` endpoint for cached route props
3. Add `routePropsCache` configuration
4. Add `getRouteProps()` to `LoaderDataService` (calls `/_data`)
5. Keep `/_loader` as fallback for non-cacheable loaders

### Phase 3: Personalization
1. Add personalization configuration
2. Implement variant resolution
3. Include `variantId` in cache keys
4. Add variant override for testing/preview

### Phase 4: ISR
1. Add `revalidateAfter` to cache entries
2. Implement background revalidation
3. Add invalidation webhooks

---

## Design Decisions

1. **Loader dependencies:** Loaders are independent and do not depend on each other's output. They run in parallel.

2. **Selective caching:** All loaders executed through `loaderResolver` have their results cached by default. Loaders can define a `skip` function to bypass caching:
   ```typescript
   const myLoader: LoaderFn = async (ctx) => {
     return fetchData(ctx.url);
   };
   
   // Skip cache for this loader (e.g., user-specific data)
   myLoader.skipCache = (ctx) => !!ctx.requestContext?.cookies?.['auth_token'];
   ```

3. **Error handling:** If a loader throws an error, it bubbles up and that loader's result is **not** cached. Other loaders' results may still be cached independently.

---

## Open Questions

1. **Variant explosion:** With many personalization variants, cache could grow large. Eviction strategy?

2. **CDN integration:** Should route props be cached at the edge (CDN) or only at origin?

3. **Real-time personalization:** Some personalization decisions can't be pre-computed. How to handle?
