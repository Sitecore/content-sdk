import type { SitecoreConfig } from '@sitecore-content-sdk/content/config';
import { createStorage, type Storage } from 'unstorage';
import memoryDriver from 'unstorage/drivers/memory';
import type { LoaderApiResponse } from './models';

interface CacheEnvelope {
  v: 1;
  exp: number;
  response: LoaderApiResponse;
}

/**
 * Cache key for server-side loader results — same format as `LoaderDataService` (`loader:${loaderId}:${url}`).
 * @public
 */
export function buildLoaderCacheKeyString(loaderId: string, url: string): string {
  return `loader:${loaderId}:${url}`;
}

export function shouldCacheLoaderResponse(response: LoaderApiResponse): boolean {
  return response.kind === 'data' || response.kind === 'redirect';
}

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
          `[Sitecore Angular] Unknown loader cache driver "${driverName}", using memory.`
        );
      }
      return memoryDriver();
    }
  }
}

function loaderCacheDriverFingerprint(config: SitecoreConfig): string {
  const lc = config.angular.loaderCache;
  return `${lc.driver}\0${JSON.stringify(lc.driverOptions ?? {})}`;
}

/**
 * Server-side loader result cache backed by unstorage.
 * Use {@link getLoaderResultCache} (or {@link LoaderResultCache.forConfig}) to bind the active {@link SitecoreConfig}.
 * @public
 */
export class LoaderResultCache {
  private static instance: LoaderResultCache | null = null;

  /**
   * Process-wide cache instance, bound to the given config.
   */
  static forConfig(config: SitecoreConfig): LoaderResultCache {
    if (!LoaderResultCache.instance) {
      LoaderResultCache.instance = new LoaderResultCache();
    }
    LoaderResultCache.instance.bindSitecoreConfig(config);
    return LoaderResultCache.instance;
  }

  private sitecoreConfig!: SitecoreConfig;
  private storage: Storage | null = null;
  private initPromise: Promise<void> | null = null;
  private boundDriverFingerprint: string | undefined;

  private bindSitecoreConfig(config: SitecoreConfig): void {
    const fp = loaderCacheDriverFingerprint(config);
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

  /** Whether loader caching is enabled in Sitecore config. */
  isEnabled(): boolean {
    return this.sitecoreConfig.angular.loaderCache.enabled === true;
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

  async get(keyMaterial: string): Promise<LoaderApiResponse | null> {
    if (!this.isEnabled()) {
      return null;
    }
    const storage = await this.ensureStorage();
    const envelope = await storage.getItem<CacheEnvelope>(keyMaterial);
    if (
      envelope == null ||
      typeof envelope !== 'object' ||
      envelope.v !== 1 ||
      typeof envelope.exp !== 'number' ||
      !envelope.response
    ) {
      await storage.removeItem(keyMaterial);
      return null;
    }
    if (Date.now() > envelope.exp) {
      await storage.removeItem(keyMaterial);
      return null;
    }
    return envelope.response;
  }

  async set(keyMaterial: string, response: LoaderApiResponse): Promise<void> {
    if (!this.isEnabled() || !shouldCacheLoaderResponse(response)) {
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
    await storage.setItem(keyMaterial, envelope);
  }
}

/**
 * Returns the process-wide loader result cache, bound to the given Sitecore config.
 * @public
 */
export function getLoaderResultCache(sitecoreConfig: SitecoreConfig): LoaderResultCache {
  return LoaderResultCache.forConfig(sitecoreConfig);
}
