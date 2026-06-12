import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LoaderPayload, LoaderApiResponse } from './models';
import { LOADER_DATA_ENDPOINT } from '../server/constants';
import { FETCH_DATA_ENDPOINT } from './loader-registry.token';

/**
 * Staging key for prefetched loader responses (browser-only, consume-once).
 * @param {string} loaderId - Loader identifier
 * @param {string} url - Request URL
 * @returns Staging key string
 */
function requestKey(loaderId: string, url: string): string {
  return `loader:${loaderId}:${url}`;
}

/**
 * Loader data client for browser loader data resolution. POSTs to the `/_data` endpoint and holds
 * short-lived prefetched responses for parallel navigation prefetching.
 * Not aware of the server-side {@link LoaderCache}.
 * @public
 */
@Injectable({
  providedIn: 'root',
})
export class ClientLoaderDataService {
  private readonly prefetchedResponses = new Map<string, LoaderApiResponse>();
  private readonly pending = new Map<string, Promise<LoaderApiResponse>>();
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly fetchDataEndpoint =
    inject(FETCH_DATA_ENDPOINT, { optional: true }) ?? LOADER_DATA_ENDPOINT;

  /**
   * Prefetch loader data for the given request without consuming staged responses.
   * If a response is already staged or a request is pending, does nothing.
   * Otherwise starts a fetch and stores the result for a later getData() call.
   * Used by PreLoaderDataService to warm responses for all loaders in a route in parallel.
   * @param {LoaderPayload} loaderRequest - The loader data request
   */
  prefetch(loaderRequest: LoaderPayload): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const key = requestKey(loaderRequest.loaderId, loaderRequest.url);
    if (this.prefetchedResponses.has(key) || this.pending.has(key)) {
      return;
    }
    const promise = this.fetchData(loaderRequest);
    this.pending.set(key, promise);
    promise.then(() => {
      // Result is already stored in prefetchedResponses by fetchData
    });
  }

  /**
   * Get data for the given request, using staged prefetched responses or fetching if needed.
   * If a request is already pending for this URL/loader combination,
   * waits for it to complete instead of making a duplicate request.
   * Consumes (removes) staged responses after retrieval.
   * @param {LoaderPayload} request - The loader data request
   * @returns {Promise<LoaderApiResponse>} Promise resolving to the API response
   */
  async getData(request: LoaderPayload): Promise<LoaderApiResponse> {
    if (!isPlatformBrowser(this.platformId)) {
      return {
        kind: 'error',
        status: 500,
        message: 'ClientLoaderDataService only works in browser',
      };
    }

    const key = requestKey(request.loaderId, request.url);

    const staged = this.prefetchedResponses.get(key);
    if (staged !== undefined) {
      this.prefetchedResponses.delete(key);
      return staged;
    }

    // Wait for pending loader data request if one exists
    const pendingRequest = this.pending.get(key);
    if (pendingRequest) {
      return pendingRequest;
    }

    // Make new request; add to pending so concurrent callers reuse the same promise
    const pendingFetchData = this.fetchData(request);
    this.pending.set(key, pendingFetchData);
    return pendingFetchData;
  }

  /**
   * Fetch data from the configured data endpoint.
   * Callers (getData, prefetch) add the returned promise to pending; it is removed
   * in finally when the promise settles.
   * @param {LoaderPayload} request - The loader data request
   * @returns {Promise<LoaderApiResponse>} Promise resolving to the API response
   */
  private async fetchData(request: LoaderPayload): Promise<LoaderApiResponse> {
    const key = requestKey(request.loaderId, request.url);
    const endpoint = this.fetchDataEndpoint;
    const reqBody: LoaderPayload = {
      loaderId: request.loaderId,
      url: request.url,
      routeParams: request.routeParams ?? {},
      query: request.query ?? {},
      cacheOptions: request.cacheOptions,
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
        this.prefetchedResponses.set(key, resp);
      } else if (resp.kind === 'redirect') {
        this.prefetchedResponses.set(key, resp);
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
