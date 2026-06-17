/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable jsdoc/require-param */
import type { AngularSitecoreConfig } from '../config/define-config';
import type { CsdkRequestParams, LoaderContext, LoaderPayload } from '../loaders/models';

/** Minimal resolved Angular sitecore config for unit tests. */
export function mockAngularSitecoreConfig(
  overrides: Partial<AngularSitecoreConfig> = {}
): AngularSitecoreConfig {
  return {
    defaultSite: 'default',
    defaultLanguage: 'en',
    angular: {
      locales: ['en'],
      loadersCache: { enabled: true, revalidate: 300 },
    },
    ...overrides,
  } as AngularSitecoreConfig;
}

/** Default Content SDK request params for loader/cache tests. */
export function mockScParams(overrides: Partial<CsdkRequestParams> = {}) {
  return {
    siteName: 'default',
    ...overrides,
  };
}

/** Build a {@link LoaderContext} with post-refactor field names and defaults. */
export function makeLoaderContext(overrides: Partial<LoaderContext> = {}): LoaderContext {
  const { scParams, ...rest } = overrides;
  return {
    url: '/about',
    routeParams: { locale: 'en' },
    query: {},
    scParams: mockScParams(scParams),
    ...rest,
  };
}

/** Build a {@link LoaderPayload} with required fields for client loader tests. */
export function makeLoaderPayload(overrides: Partial<LoaderPayload> = {}): LoaderPayload {
  return {
    loaderId: 'page',
    url: '/test',
    routeParams: {},
    query: {},
    ...overrides,
  };
}
