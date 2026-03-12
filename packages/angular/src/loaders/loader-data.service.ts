import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Params } from '@angular/router';
import { LoaderApiRequest, LoaderApiResponse } from './models';
import { LOADER_DATA_ENDPOINT } from '../server/constants';
import { FETCH_DATA_ENDPOINT } from './loader-registry.token';

/**
 * Cache key generator for loader data
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
  private readonly cache = new Map<string, LoaderApiResponse>();
  private readonly pending = new Map<string, Promise<LoaderApiResponse>>();
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly fetchDataEndpoint =
    inject(FETCH_DATA_ENDPOINT, { optional: true }) ?? LOADER_DATA_ENDPOINT;

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

    // Make new request
    return this.fetchData(request);
  }

  /**
   * Fetch data from the configured data endpoint.
   * Stores result in cache and handles pending request tracking.
   * @param {LoaderDataRequest} request - The loader data request
   * @returns {Promise<LoaderApiResponse>} Promise resolving to the API response
   */
  private async fetchData(request: LoaderDataRequest): Promise<LoaderApiResponse> {
    const key = cacheKey(request.loaderId, request.url);
    const endpoint = this.fetchDataEndpoint;

    const reqBody: LoaderApiRequest = {
      loaderId: request.loaderId,
      url: request.url,
      params: request.params ?? {},
      query: request.query ?? {},
    };
    console.log('DEBUG: LoaderDataService fetchData', endpoint, reqBody);

    const fetchPromise = firstValueFrom(
      this.http.post<LoaderApiResponse>(endpoint, reqBody, {
        cache: 'no-store',
      })
    )
      .then((resp) => {
        this.pending.delete(key);

        if (!resp) {
          const message = `No response from ${endpoint}`;
          console.log(`DEBUG: LoaderDataService fetchData: ${message}`);
          return {
            kind: 'error',
            status: 500,
            message,
          } as LoaderApiResponse;
        }

        if (resp.kind === 'data') {
          console.log('DEBUG: LoaderDataService fetchData: data', resp.data);
          this.cache.set(key, resp);
        } else if (resp.kind === 'redirect') {
          this.cache.set(key, resp);
        }

        return resp;
      })
      .catch((error) => {
        console.log('DEBUG: LoaderDataService fetchData: error', error);
        this.pending.delete(key);

        const message = error instanceof Error ? error.message : 'Fetch failed';
        return { kind: 'error', status: 500, message } as LoaderApiResponse;
      });

    this.pending.set(key, fetchPromise);

    console.log('DEBUG: LoaderDataService fetchData: fetchPromise', fetchPromise);
    return fetchPromise;
  }
}
