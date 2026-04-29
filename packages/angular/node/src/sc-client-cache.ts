import type { SitecoreConfig } from '@sitecore-content-sdk/content/config';
import { createStorage, type Storage } from 'unstorage';
import memoryDriver from 'unstorage/drivers/memory';
import type { ScClientCacheResponse, ScClientCacheStore } from '@sitecore-content-sdk/angular';

interface CacheEnvelope {
  v: 1;
  exp: number;
  response: ScClientCacheResponse;
}

/**
 * One cached scClient row for diagnostics (no response body).
 * @public
 */
export interface ScClientCacheEntryDiagnostics {
  /** Cache key material. */
  key: string;
  /** Absolute expiry time (ms), or null if unknown/malformed. */
  expiresAt: number | null;
  /** `page` or `dictionary` from {@link ScClientCacheResponse}. */
  responseKind: string | null;
  /** True when past {@link ScClientCacheEntryDiagnostics.expiresAt}. */
  expired: boolean;
}

/**
 * Snapshot of scClient cache state for operators (e.g. GET `/admin/cache`).
 * @public
 */
export interface ScClientCacheDiagnostics {
  /** Cache category label for operators. */
  cacheType: 'scClient';
  /** Whether caching is enabled in Sitecore config. */
  enabled: boolean;
  /** Unstorage driver name. */
  driver: string;
  /** Configured TTL (seconds). */
  ttlSeconds: number;
  /** Number of keys in storage (may include stale rows until next access). */
  keyCount: number;
  /** Per-key summary (keys only; no serialized payloads). */
  entries: ScClientCacheEntryDiagnostics[];
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
    case 'vercel-kv':
      return (await import('unstorage/drivers/vercel-kv')).default(driverOptions as never);
    case 'netlify-blobs':
      return (await import('unstorage/drivers/netlify-blobs')).default(driverOptions as never);
    default: {
      if (typeof console !== 'undefined' && console.warn) {
        console.warn(
          `[Sitecore Angular] Unknown scClient cache driver "${driverName}", using memory.`
        );
      }
      return memoryDriver();
    }
  }
}

/** @internal */
function cacheDriverFingerprint(config: SitecoreConfig): string {
  const lc = config.angular.loaderCache;
  return `scclient\0${lc.driver}\0${JSON.stringify(lc.driverOptions ?? {})}`;
}

/**
 * Server-side scClient result cache backed by unstorage.
 * Import from `@sitecore-content-sdk/angular/node` in Node/Express only.
 * Uses the same driver config as loader cache (`angular.loaderCache`).
 * @public
 */
export class ScClientCache implements ScClientCacheStore {
  private static instance: ScClientCache | null = null;

  private sitecoreConfig!: SitecoreConfig;
  private storage: Storage | null = null;
  private initPromise: Promise<void> | null = null;
  private boundDriverFingerprint: string | undefined;

  /**
   * Process-wide cache instance, bound to the given config.
   * @param config - Active Sitecore config (must include `angular.loaderCache`)
   */
  static forConfig(config: SitecoreConfig): ScClientCache {
    if (!ScClientCache.instance) {
      ScClientCache.instance = new ScClientCache();
    }
    ScClientCache.instance.bindSitecoreConfig(config);
    return ScClientCache.instance;
  }

  /** Whether caching is enabled in Sitecore config. */
  isEnabled(): boolean {
    return this.sitecoreConfig.angular.loaderCache.enabled === true;
  }

  async get(key: string): Promise<ScClientCacheResponse | null> {
    if (!this.isEnabled()) {
      return null;
    }
    const storage = await this.ensureStorage();
    const envelope = await storage.getItem<CacheEnvelope>(key);
    if (
      envelope === null ||
      envelope === undefined ||
      typeof envelope !== 'object' ||
      envelope.v !== 1 ||
      typeof envelope.exp !== 'number' ||
      !envelope.response
    ) {
      await storage.removeItem(key);
      return null;
    }
    if (Date.now() > envelope.exp) {
      await storage.removeItem(key);
      return null;
    }
    return envelope.response;
  }

  async set(key: string, response: ScClientCacheResponse): Promise<void> {
    if (!this.isEnabled()) {
      return;
    }
    const ttl = this.sitecoreConfig.angular.loaderCache.ttlSeconds;
    if (!Number.isFinite(ttl) || ttl <= 0) {
      return;
    }
    const storage = await this.ensureStorage();
    const envelope: CacheEnvelope = {
      v: 1,
      exp: Date.now() + ttl * 1000,
      response,
    };
    await storage.setItem(key, envelope);
  }

  /**
   * Inspect cache keys and expiry metadata for monitoring (does not return payload bodies).
   * @returns Diagnostic snapshot for JSON APIs or tooling.
   * @public
   */
  async getDiagnostics(): Promise<ScClientCacheDiagnostics> {
    const cfg = this.sitecoreConfig.angular.loaderCache;
    const base: ScClientCacheDiagnostics = {
      cacheType: 'scClient',
      enabled: this.isEnabled(),
      driver: cfg.driver,
      ttlSeconds: cfg.ttlSeconds,
      keyCount: 0,
      entries: [],
    };
    if (!this.isEnabled()) {
      return base;
    }
    const storage = await this.ensureStorage();
    const keys = await storage.getKeys();
    const now = Date.now();
    const entries: ScClientCacheEntryDiagnostics[] = [];
    for (const key of keys) {
      const raw = await storage.getItem<CacheEnvelope>(key);
      if (
        raw === null ||
        raw === undefined ||
        typeof raw !== 'object' ||
        raw.v !== 1 ||
        typeof raw.exp !== 'number'
      ) {
        entries.push({
          key,
          expiresAt: null,
          responseKind: null,
          expired: false,
        });
        continue;
      }
      const responseKind =
        raw.response && typeof raw.response === 'object' && 'kind' in raw.response
          ? String((raw.response as { kind?: unknown }).kind)
          : null;
      entries.push({
        key,
        expiresAt: raw.exp,
        responseKind,
        expired: now > raw.exp,
      });
    }
    return {
      ...base,
      keyCount: keys.length,
      entries,
    };
  }

  private bindSitecoreConfig(config: SitecoreConfig): void {
    const fp = cacheDriverFingerprint(config);
    if (
      this.boundDriverFingerprint !== undefined &&
      fp !== this.boundDriverFingerprint &&
      (this.storage !== null || this.initPromise !== null)
    ) {
      this.storage = null;
      this.initPromise = null;
    }
    this.boundDriverFingerprint = fp;
    this.sitecoreConfig = config;
  }

  private async ensureStorage(): Promise<Storage> {
    if (this.storage) {
      return this.storage;
    }
    if (!this.initPromise) {
      const { driver, driverOptions } = this.sitecoreConfig.angular.loaderCache;
      this.initPromise = (async () => {
        const driverImpl = await createDriver(driver, { ...driverOptions });
        this.storage = createStorage({ driver: driverImpl });
      })();
    }
    await this.initPromise;
    return this.storage!;
  }
}

/**
 * Returns the process-wide scClient cache, bound to the given Sitecore config.
 * @param sitecoreConfig - Active Sitecore config
 * @public
 */
export function getScClientCache(sitecoreConfig: SitecoreConfig): ScClientCache {
  return ScClientCache.forConfig(sitecoreConfig);
}
