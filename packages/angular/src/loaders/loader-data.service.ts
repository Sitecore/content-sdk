import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Params } from '@angular/router';
import { LoaderApiRequest, LoaderApiResponse } from './model';
import { DEFAULT_DATA_ENDPOINT } from '../server/config';

/**
 * Cache key generator for loader data
 * @param {string} loaderId - The loader ID
 * @param {string} url - The URL
 * @returns {string} The cache key
 */
function cacheKey(loaderId: string, url: string): string {
  return `loader:${loaderId}:${url}`;
}

/**
 * Request parameters for fetching loader data
 * @public
 */
export interface LoaderDataRequest {
  url: string;
  loaderId: string;
  params?: Params;
  query?: Record<string, string | string[]>;
}

@Injectable({
  providedIn: 'root',
})
export class LoaderDataService {
  private readonly cache = new Map<string, unknown>();
  private readonly pending = new Map<string, Promise<LoaderApiResponse>>();
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

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

    const key = cacheKey(request.loaderId, request.url);

    // Return cached data if available (consume on use)
    const cachedData = this.cache.get(key);
    if (cachedData !== undefined) {
      this.cache.delete(key);
      return { kind: 'data', data: cachedData };
    }

    // Wait for pending request if one exists
    const pendingRequest = this.pending.get(key);
    if (pendingRequest) {
      return pendingRequest;
    }

    // Make new request
    return this.fetchData(request);
  }

  /**
   * Preload data for the given URL using the specified loader.
   * Makes a request to the /_data endpoint and caches the result.
   * Does nothing if already cached or currently loading.
   * Fire-and-forget - does not return the result.
   * @param {string} url - The URL to preload
   * @param {string} loaderId - The loader ID to use
   */
  preload(url: string, loaderId: string): void {
    this.prefetch(url, loaderId);
  }

  /**
   * Prefetch data with full context (url, params, query).
   * Makes a request to the /_data endpoint and caches the result.
   * Does nothing if already cached or currently loading.
   * Fire-and-forget - does not return the result.
   *
   * This method is used by the LoaderPrefetchService to start parallel
   * fetching of all loaders in the matched route tree.
   * @param {string} url - The URL to prefetch
   * @param {string} loaderId - The loader ID to use
   * @param {Params} [params] - Route parameters
   * @param {Record<string, string | string[]>} [query] - Query parameters
   */
  prefetch(
    url: string,
    loaderId: string,
    params?: Params,
    query?: Record<string, string | string[]>
  ): void {
    // Only prefetch in browser
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const key = cacheKey(loaderId, url);

    // Skip if already cached or loading
    if (this.cache.has(key) || this.pending.has(key)) {
      return;
    }

    // Fire and forget - we don't await this
    this.fetchData({ url, loaderId, params, query }).catch(() => {
      // Silently fail - prefetching is best effort
    });
  }

  /**
   * Fetch data from the /_data endpoint.
   * Stores result in cache and handles pending request tracking.
   * @param {LoaderDataRequest} request - The loader data request
   * @returns {Promise<LoaderApiResponse>} Promise resolving to the API response
   */
  private async fetchData(request: LoaderDataRequest): Promise<LoaderApiResponse> {
    const key = cacheKey(request.loaderId, request.url);

    const reqBody: LoaderApiRequest = {
      loaderId: request.loaderId,
      url: request.url,
      params: request.params ?? {},
      query: request.query ?? {},
    };

    const fetchPromise = firstValueFrom(
      this.http.post<LoaderApiResponse>(DEFAULT_DATA_ENDPOINT, reqBody)
    )
      .then((resp) => {
        this.pending.delete(key);

        if (!resp) {
          return {
            kind: 'error',
            status: 500,
            message: 'No response from /_data',
          } as LoaderApiResponse;
        }

        // Cache successful data responses
        if (resp.kind === 'data') {
          this.cache.set(key, resp.data);
        }

        return resp;
      })
      .catch((error) => {
        this.pending.delete(key);

        const message = error instanceof Error ? error.message : 'Fetch failed';
        return { kind: 'error', status: 500, message } as LoaderApiResponse;
      });

    this.pending.set(key, fetchPromise);

    return fetchPromise;
  }
}
