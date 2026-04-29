import type { SitecoreConfig } from '@sitecore-content-sdk/content/config';
import { createStorage, type Storage } from 'unstorage';
import memoryDriver from 'unstorage/drivers/memory';
import type {
  ExpressMiddleware,
  ExpressNextFunction,
  ExpressRequest,
  ExpressResponse,
} from '@sitecore-content-sdk/angular';

/**
 * Cached HTML entry with metadata
 * @public
 */
export interface HtmlCacheEntry {
  /** Rendered HTML content */
  html: string;
  /** Timestamp when cached (ms since epoch) */
  createdAt: number;
  /** Expiry timestamp (ms since epoch) */
  expiresAt: number;
  /** Personalization variant ID */
  variantId: string;
}

/**
 * Configuration for HTML cache
 * @public
 */
export interface HtmlCacheConfig {
  /** Whether HTML caching is enabled */
  enabled: boolean;
  /** TTL in seconds for cached HTML */
  ttlSeconds: number;
  /** Storage driver name (memory, fs, etc.) */
  driver: string;
  /** Driver-specific options */
  driverOptions?: Record<string, unknown>;
}

/**
 * Options for personalization middleware
 * @public
 */
export interface PersonalizationMiddlewareOptions {
  /**
   * Function to determine variant ID from request.
   * If not provided, uses mock implementation that returns 'default' or cookie value.
   */
  getVariantId?: (req: ExpressRequest) => Promise<string> | string;
  /**
   * Cookie name for caching variant decision
   * @default 'sc_variant'
   */
  variantCookieName?: string;
}

/**
 * Options for HTML cache middleware
 * @public
 */
export interface HtmlCacheMiddlewareOptions {
  /** HTML cache configuration */
  cacheConfig: HtmlCacheConfig;
  /**
   * Paths to exclude from caching (e.g., API routes, admin)
   * @default []
   */
  excludePaths?: string[];
}

/**
 * Extended Express request with variant info
 * @public
 */
export interface PersonalizedRequest extends ExpressRequest {
  /** Personalization variant ID */
  variantId?: string;
  /** Cache key for this request (url + variant) */
  htmlCacheKey?: string;
}

/**
 * Extended Express response with cache control
 * @public
 */
export interface CacheableResponse extends ExpressResponse {
  /** Original send function */
  _originalSend?: (body: unknown) => void;
  /** Flag indicating response should be cached */
  _shouldCacheHtml?: boolean;
}

/** @internal */
async function createDriver(driverName: string, driverOptions: Record<string, unknown>) {
  const name = (driverName || 'memory').toLowerCase();
  switch (name) {
    case 'memory':
      return memoryDriver(driverOptions as never);
    case 'fs':
      return (await import('unstorage/drivers/fs')).default(driverOptions as { base: string });
    case 'lru-cache':
      return (await import('unstorage/drivers/lru-cache')).default(driverOptions as never);
    default: {
      console.warn(`[HTML Cache] Unknown driver "${driverName}", using memory.`);
      return memoryDriver();
    }
  }
}

/**
 * HTML cache store for rendered pages
 * @public
 */
export class HtmlCache {
  private storage: Storage | null = null;
  private initPromise: Promise<void> | null = null;

  constructor(private config: HtmlCacheConfig) {}

  /** Whether HTML caching is enabled */
  isEnabled(): boolean {
    return this.config.enabled === true;
  }

  /**
   * Get cached HTML for a cache key
   * @param cacheKey - Cache key (typically url + variantId)
   */
  async get(cacheKey: string): Promise<HtmlCacheEntry | null> {
    if (!this.isEnabled()) {
      return null;
    }
    const storage = await this.ensureStorage();
    const entry = await storage.getItem<HtmlCacheEntry>(cacheKey);
    if (!entry || typeof entry !== 'object' || !entry.html) {
      return null;
    }
    if (Date.now() > entry.expiresAt) {
      await storage.removeItem(cacheKey);
      return null;
    }
    return entry;
  }

  /**
   * Store rendered HTML in cache
   * @param cacheKey - Cache key
   * @param html - Rendered HTML
   * @param variantId - Personalization variant ID
   */
  async set(cacheKey: string, html: string, variantId: string): Promise<void> {
    if (!this.isEnabled()) {
      return;
    }
    const ttl = this.config.ttlSeconds;
    if (!Number.isFinite(ttl) || ttl <= 0) {
      return;
    }
    const storage = await this.ensureStorage();
    const now = Date.now();
    const entry: HtmlCacheEntry = {
      html,
      createdAt: now,
      expiresAt: now + ttl * 1000,
      variantId,
    };
    await storage.setItem(cacheKey, entry);
  }

  /**
   * Get all cache keys (for diagnostics)
   */
  async getKeys(): Promise<string[]> {
    if (!this.storage && !this.initPromise) {
      return [];
    }
    const storage = await this.ensureStorage();
    return storage.getKeys();
  }

  /**
   * Clear all cached entries
   */
  async clear(): Promise<void> {
    if (!this.storage) {
      return;
    }
    await this.storage.clear();
  }

  private async ensureStorage(): Promise<Storage> {
    if (this.storage) {
      return this.storage;
    }
    if (!this.initPromise) {
      this.initPromise = (async () => {
        const driverImpl = await createDriver(this.config.driver, {
          ...(this.config.driverOptions ?? {}),
        });
        this.storage = createStorage({ driver: driverImpl });
      })();
    }
    await this.initPromise;
    return this.storage!;
  }
}

/**
 * Build cache key from URL and variant ID
 * @param url - Request URL
 * @param variantId - Personalization variant ID
 * @public
 */
export function buildHtmlCacheKey(url: string, variantId: string): string {
  const safeUrl = url.replace(/[:/\\?&=]/g, '_');
  return `html__${safeUrl}__${variantId}`;
}

/**
 * Create mock personalization middleware.
 * Sets `req.variantId` based on cookie or mock logic.
 *
 * In production, replace `getVariantId` with a call to CDP/Personalize API.
 *
 * @param options - Personalization options
 * @returns Express middleware
 * @example
 * ```typescript
 * // Mock personalization (uses cookie or defaults to 'default')
 * app.use(createPersonalizationMiddleware());
 *
 * // With custom variant resolver (e.g., CDP API call)
 * app.use(createPersonalizationMiddleware({
 *   getVariantId: async (req) => {
 *     const variant = await cdpClient.getVariant(req.url, req.cookies);
 *     return variant.id;
 *   }
 * }));
 * ```
 * @public
 */
export function createPersonalizationMiddleware(
  options: PersonalizationMiddlewareOptions = {}
): ExpressMiddleware {
  const { variantCookieName = 'sc_variant', getVariantId } = options;

  const defaultGetVariantId = (req: ExpressRequest): string => {
    return req.cookies?.[variantCookieName] || 'default';
  };

  const resolveVariant = getVariantId || defaultGetVariantId;

  return async (
    req: PersonalizedRequest,
    _res: ExpressResponse,
    next: ExpressNextFunction
  ): Promise<void> => {
    try {
      req.variantId = await resolveVariant(req);
    } catch (error) {
      console.warn('[Personalization] Error resolving variant:', error);
      req.variantId = 'default';
    }
    next();
  };
}

/**
 * Create HTML cache middleware.
 * Serves cached HTML if available, otherwise passes to next middleware.
 *
 * Use with `createHtmlCacheWriter` to store rendered HTML after Angular SSR.
 *
 * @param htmlCache - HTML cache instance
 * @param options - Cache middleware options
 * @returns Express middleware
 * @example
 * ```typescript
 * const htmlCache = new HtmlCache({ enabled: true, ttlSeconds: 300, driver: 'fs', driverOptions: { base: '.cache/html' } });
 *
 * app.use(createPersonalizationMiddleware());
 * app.use(createHtmlCacheMiddleware(htmlCache));
 * // ... Angular SSR handler ...
 * ```
 * @public
 */
export function createHtmlCacheMiddleware(
  htmlCache: HtmlCache,
  options: Partial<HtmlCacheMiddlewareOptions> = {}
): ExpressMiddleware {
  const { excludePaths = [] } = options;

  return async (
    req: PersonalizedRequest,
    res: ExpressResponse,
    next: ExpressNextFunction
  ): Promise<void> => {
    if (!htmlCache.isEnabled()) {
      next();
      return;
    }

    if (req.method !== 'GET') {
      next();
      return;
    }

    if (excludePaths.some((p) => req.path.startsWith(p))) {
      next();
      return;
    }

    const variantId = req.variantId || 'default';
    const cacheKey = buildHtmlCacheKey(req.url, variantId);
    req.htmlCacheKey = cacheKey;

    try {
      const cached = await htmlCache.get(cacheKey);
      if (cached) {
        console.log(`[HTML Cache] HIT: ${cacheKey}`);
        res.status(200);
        (res as { send?: (body: string) => void }).send?.(cached.html);
        return;
      }
      console.log(`[HTML Cache] MISS: ${cacheKey}`);
    } catch (error) {
      console.warn('[HTML Cache] Error reading cache:', error);
    }

    next();
  };
}

/**
 * Options for creating HTML cache from Sitecore config
 * @public
 */
export interface HtmlCacheFromConfigOptions {
  /**
   * Override config values
   */
  overrides?: Partial<HtmlCacheConfig>;
}

/**
 * Create HTML cache from Sitecore config.
 * Reads `angular.htmlCache` section if present, otherwise uses defaults.
 *
 * @param config - Sitecore configuration
 * @param options - Override options
 * @returns HtmlCache instance
 * @public
 */
export function createHtmlCache(
  config?: SitecoreConfig,
  options: HtmlCacheFromConfigOptions = {}
): HtmlCache {
  const angularConfig = (config as { angular?: { htmlCache?: HtmlCacheConfig } })?.angular;
  const cacheConfig: HtmlCacheConfig = {
    enabled: angularConfig?.htmlCache?.enabled ?? false,
    ttlSeconds: angularConfig?.htmlCache?.ttlSeconds ?? 300,
    driver: angularConfig?.htmlCache?.driver ?? 'memory',
    driverOptions: angularConfig?.htmlCache?.driverOptions,
    ...options.overrides,
  };
  return new HtmlCache(cacheConfig);
}

/**
 * Helper to store rendered HTML in cache after Angular SSR.
 * Call this after Angular renders but before sending response.
 *
 * @param htmlCache - HTML cache instance
 * @param cacheKey - Cache key from request
 * @param html - Rendered HTML
 * @param variantId - Personalization variant ID
 * @public
 */
export async function storeHtmlInCache(
  htmlCache: HtmlCache,
  cacheKey: string,
  html: string,
  variantId: string
): Promise<void> {
  if (!htmlCache.isEnabled() || !cacheKey) {
    return;
  }
  try {
    await htmlCache.set(cacheKey, html, variantId);
    console.log(`[HTML Cache] STORED: ${cacheKey}`);
  } catch (error) {
    console.warn('[HTML Cache] Error storing:', error);
  }
}
