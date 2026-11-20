/* eslint-disable jsdoc/require-jsdoc */
import { TestBed } from '@angular/core/testing';
import { RESPONSE_INIT } from '@angular/core';
import { describe, it, expect, beforeEach } from 'vitest';
import { PERSONALIZE_TOKENS_HEADER } from '@sitecore-content-sdk/content/personalize';
import { provideServerLoaderRunner } from './provide-server-loader-runner';
import { LOADER_REGISTRY } from '../loaders/loader-registry.token';
import { SERVER_LOADER_RUNNER } from '../loaders/server-loader-runner.token';
import { SITECORE_CONFIG_TOKEN } from '../lib/tokens';
import { mockAngularSitecoreConfig } from '../testing/loader-spec-helpers';
import type { LoaderFn, LoaderRunnerInit } from '../loaders/models';

describe('provideServerLoaderRunner', () => {
  let responseInit: ResponseInit;

  beforeEach(() => {
    responseInit = { headers: { 'x-existing': '1' } };
    TestBed.configureTestingModule({
      providers: [
        provideServerLoaderRunner(),
        { provide: LOADER_REGISTRY, useValue: { page: (async () => ({ ok: true })) as LoaderFn } },
        { provide: SITECORE_CONFIG_TOKEN, useValue: mockAngularSitecoreConfig() },
        { provide: RESPONSE_INIT, useValue: responseInit },
      ],
    });
  });

  const resolve = (headers?: Record<string, string>) =>
    TestBed.runInInjectionContext(() =>
      TestBed.inject(SERVER_LOADER_RUNNER).resolve({
        loaderId: 'page',
        url: '/about',
        routeParams: {},
        query: {},
        csdkRequestData: headers ? { headers } : null,
      } as LoaderRunnerInit)
    );

  it('marks the SSR response private and not cacheable when the request carries tokens', async () => {
    await resolve({ [PERSONALIZE_TOKENS_HEADER]: 'encoded' });

    const headers = new Headers(responseInit.headers);
    expect(headers.get('Cache-Control')).toBe('private, no-store');
    expect(headers.get('x-existing')).toBe('1');
  });

  it('leaves the SSR response headers unchanged without tokens', async () => {
    await resolve();

    expect(new Headers(responseInit.headers).get('Cache-Control')).toBeNull();
  });
});
