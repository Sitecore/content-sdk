import type { FetchOptions } from '@sitecore-content-sdk/core';
import type { Page, PageOptions, SitecoreClientInit } from '@sitecore-content-sdk/content/client';
import { SitecoreClient } from '@sitecore-content-sdk/content/client';
import type { DictionaryPhrases } from '@sitecore-content-sdk/content/i18n';
import type { RouteOptions } from '@sitecore-content-sdk/content/layout';
import type {
  ScClientCacheRequest,
  ScClientCacheResponse,
  ScClientCacheStore,
} from './sc-client-cache.interface';
import {
  NULL_SC_CLIENT_CACHE,
  buildPageCacheKey,
  buildDictionaryCacheKey,
} from './sc-client-cache.interface';

/** Default endpoint for scClient data requests from browser. @public */
export const SC_CLIENT_DATA_ENDPOINT = '/_sc-client';

/**
 * Options for {@link AngularSitecoreClientService}.
 * Pass cache and endpoint behavior when constructing the client (e.g. from `getClient()` in the app).
 * @public
 */
export interface AngularSitecoreClientServiceOptions {
  /**
   * Server-side cache for `getPage` / `getDictionary`. Omit or use {@link NULL_SC_CLIENT_CACHE} on the browser.
   */
  cache?: ScClientCacheStore;
  /**
   * When true, `getPage` / `getDictionary` POST to {@link scClientDataEndpoint} instead of calling GraphQL.
   * Use `true` in the browser; `false` on the server (SSR / Express).
   */
  useScClientEndpoint?: boolean;
  /** Override default {@link SC_CLIENT_DATA_ENDPOINT}. */
  scClientDataEndpoint?: string;
}

/**
 * Sitecore client with optional scClient caching and browser delegation to `/_sc-client`.
 * Extends {@link SitecoreClient}; construct explicitly (not injectable), e.g.:
 *
 * ```typescript
 * const client = new AngularSitecoreClientService(scConfig, {
 *   cache: serverCache,
 *   useScClientEndpoint: typeof window !== 'undefined',
 * });
 * ```
 *
 * Register with `provideSitecoreAngular({ sitecoreConfig, sitecoreClient: getClient() })`.
 * @public
 */
export class AngularSitecoreClientService extends SitecoreClient {
  private readonly cache: ScClientCacheStore;
  private readonly useScClientEndpoint: boolean;
  private readonly scClientDataEndpoint: string;

  constructor(initOptions: SitecoreClientInit, options: AngularSitecoreClientServiceOptions = {}) {
    super(initOptions);
    this.cache = options.cache ?? NULL_SC_CLIENT_CACHE;
    this.useScClientEndpoint = options.useScClientEndpoint ?? false;
    this.scClientDataEndpoint = options.scClientDataEndpoint ?? SC_CLIENT_DATA_ENDPOINT;
  }

  /**
   * Same as {@link SitecoreClient}, with cache on the server and HTTP delegation in the browser when configured.
   */
  override async getPage(
    path: string | string[],
    pageOptions?: PageOptions,
    fetchOptions?: FetchOptions
  ): Promise<Page | null> {
    const normalizedPath = this.parsePath(path);

    if (this.useScClientEndpoint) {
      return this.getPageOnBrowser(normalizedPath, pageOptions);
    }

    return this.getPageWithCache(normalizedPath, path, pageOptions, fetchOptions);
  }

  /**
   * Same as {@link SitecoreClient}, with cache on the server and HTTP delegation in the browser when configured.
   */
  override async getDictionary(
    routeOptions?: Partial<RouteOptions>,
    fetchOptions?: FetchOptions
  ): Promise<DictionaryPhrases> {
    if (this.useScClientEndpoint) {
      return this.getDictionaryOnBrowser(routeOptions);
    }

    return this.getDictionaryWithCache(routeOptions, fetchOptions);
  }

  private async getPageWithCache(
    normalizedPath: string,
    originalPath: string | string[],
    pageOptions?: PageOptions,
    fetchOptions?: FetchOptions
  ): Promise<Page | null> {
    const cacheKey = buildPageCacheKey(normalizedPath, pageOptions);

    if (this.cache.isEnabled()) {
      const cached = await this.cache.get(cacheKey);
      if (cached?.kind === 'page') {
        return cached.data;
      }
    }

    const result = await super.getPage(originalPath, pageOptions, fetchOptions);

    if (this.cache.isEnabled()) {
      void this.cache.set(cacheKey, { kind: 'page', data: result });
    }

    return result;
  }

  private async getDictionaryWithCache(
    routeOptions?: Partial<RouteOptions>,
    fetchOptions?: FetchOptions
  ): Promise<DictionaryPhrases> {
    const cacheKey = buildDictionaryCacheKey(routeOptions);

    if (this.cache.isEnabled()) {
      const cached = await this.cache.get(cacheKey);
      if (cached?.kind === 'dictionary') {
        return cached.data;
      }
    }

    const result = await super.getDictionary(routeOptions, fetchOptions);

    if (this.cache.isEnabled()) {
      void this.cache.set(cacheKey, { kind: 'dictionary', data: result });
    }

    return result;
  }

  private async getPageOnBrowser(path: string, options?: PageOptions): Promise<Page | null> {
    const request: ScClientCacheRequest = { method: 'getPage', path, options };
    const response = await this.fetchFromEndpoint(request);
    if (response.kind === 'page') {
      return response.data;
    }
    throw new Error(`Unexpected response kind: ${response.kind}`);
  }

  private async getDictionaryOnBrowser(
    options?: Partial<RouteOptions>
  ): Promise<DictionaryPhrases> {
    const request: ScClientCacheRequest = { method: 'getDictionary', options };
    const response = await this.fetchFromEndpoint(request);
    if (response.kind === 'dictionary') {
      return response.data;
    }
    throw new Error(`Unexpected response kind: ${response.kind}`);
  }

  private async fetchFromEndpoint(request: ScClientCacheRequest): Promise<ScClientCacheResponse> {
    try {
      const response = await fetch(this.scClientDataEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
        cache: 'no-store',
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const json = (await response.json()) as ScClientCacheResponse | null;
      if (!json) {
        throw new Error(`No JSON from ${this.scClientDataEndpoint}`);
      }
      return json;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Fetch failed';
      throw new Error(`AngularSitecoreClientService: ${message}`);
    }
  }
}
