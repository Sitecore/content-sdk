import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Params } from '@angular/router';
import { LoaderApiRequest, LoaderApiResponse } from './models';
import { LOADER_DATA_ENDPOINT } from '../server/constants';
import { FETCH_DATA_ENDPOINT } from './loader-registry.token';
import { SITECORE_CONFIG_TOKEN } from '../lib/tokens';
import { resolveLocale, stripLocalePrefix } from '../i18n/locale-url';
import { loaderDataCacheKey } from './loader-cache-key';

/**
 * Request parameters for fetching loader data
 * @public
 */
export interface LoaderDataRequest {
  /** Canonical URL (locale prefix stripped) passed to loaders and `/_data`. */
  url: string;
  loaderId: string;
  params?: Params;
  query?: Record<string, string | string[]>;
}

@Injectable({
  providedIn: 'root',
})
export class LoaderDataService {
  private readonly cache = new Map<string, LoaderApiResponse>();
  private readonly pending = new Map<string, Promise<LoaderApiResponse>>();
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly fetchDataEndpoint =
    inject(FETCH_DATA_ENDPOINT, { optional: true }) ?? LOADER_DATA_ENDPOINT;
  private readonly scConfig = inject(SITECORE_CONFIG_TOKEN, { optional: true });

  /**
   * Prefetch loader data for the given request without consuming the cache.
   * If data is already cached or a request is pending, does nothing.
   * Otherwise starts a fetch and stores the result in cache for a later getData() call.
   * Used by PreLoaderDataService to warm the cache for all loaders in a route in parallel.
   * @param {LoaderDataRequest} loaderRequest - The loader data request
   */
  prefetch(loaderRequest: LoaderDataRequest): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const key = this.cacheKey(loaderRequest);
    if (this.cache.has(key) || this.pending.has(key)) {
      return;
    }
    const promise = this.fetchData(loaderRequest);
    this.pending.set(key, promise);
    promise.then(() => {
      // Result is already stored in cache by fetchData; nothing to consume
    });
  }

  /**
   * Get data for the given request, using cache or fetching if needed.
   * If a request is already pending for this URL/loader combination,
   * waits for it to complete instead of making a duplicate request.
   * Consumes (removes) cached data after retrieval.
   * @param {LoaderDataRequest} request - The loader data request
   * @returns {Promise<LoaderApiResponse>} Promise resolving to the API response
   */
  async getData(request: LoaderDataRequest): Promise<LoaderApiResponse> {
    // Only fetch in browser
    if (!isPlatformBrowser(this.platformId)) {
      return { kind: 'error', status: 500, message: 'LoaderDataService only works in browser' };
    }

    const key = this.cacheKey(request);

    // Return cached response if available (consume on use); supports data and redirect
    const cached = this.cache.get(key);
    if (cached !== undefined) {
      this.cache.delete(key);
      return cached;
    }

    // Wait for pending request if one exists
    const pendingRequest = this.pending.get(key);
    if (pendingRequest) {
      return pendingRequest;
    }

    // Make new request; add to pending so concurrent callers reuse the same promise
    const pendingFetchData = this.fetchData(request);
    this.pending.set(key, pendingFetchData);
    return pendingFetchData;
  }

  private cacheKey(request: LoaderDataRequest): string {
    const defaultLanguage = this.scConfig?.defaultLanguage ?? 'en';
    const locales = this.scConfig?.locales?.length ? this.scConfig.locales : [defaultLanguage];
    const locale = resolveLocale(request.params ?? {}, defaultLanguage);
    const canonicalUrl = stripLocalePrefix(request.url, locales);
    return loaderDataCacheKey(request.loaderId, locale, canonicalUrl);
  }

  /**
   * Fetch data from the configured data endpoint.
   * Callers (getData, prefetch) add the returned promise to pending; it is removed
   * in finally when the promise settles.
   * @param {LoaderDataRequest} request - The loader data request
   * @returns {Promise<LoaderApiResponse>} Promise resolving to the API response
   */
  private async fetchData(request: LoaderDataRequest): Promise<LoaderApiResponse> {
    const key = this.cacheKey(request);
    const endpoint = this.fetchDataEndpoint;
    const reqBody: LoaderApiRequest = {
      loaderId: request.loaderId,
      url: request.url,
      params: request.params ?? {},
      query: request.query ?? {},
    };

    try {
      const resp = await firstValueFrom(
        this.http.post<LoaderApiResponse>(endpoint, reqBody, { cache: 'no-store' })
      );
      if (!resp) {
        const message = `No response from ${endpoint}`;
        return { kind: 'error', status: 500, message } as LoaderApiResponse;
      }
      if (resp.kind === 'data') {
        this.cache.set(key, resp);
      } else if (resp.kind === 'redirect') {
        this.cache.set(key, resp);
      }
      return resp;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Fetch failed';
      return { kind: 'error', status: 500, message } as LoaderApiResponse;
    } finally {
      this.pending.delete(key);
    }
  }
}
