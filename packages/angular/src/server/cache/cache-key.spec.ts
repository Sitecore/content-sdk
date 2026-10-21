/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect } from 'vitest';
import { DEFAULT_VARIANT } from '@sitecore-content-sdk/content/personalize';
import {
  buildCacheKey,
  buildPageCacheKey,
  buildDictionaryCacheKey,
  CACHE_KEY_PREFIX,
  serializeLoaderCacheKey,
} from './cache-key';
import type { CacheKeyDimensions } from './models';
import { makeLoaderContext } from '../../testing/loader-spec-helpers';
import type { CsdkRequestParams } from '../../loaders/models';

const setDefaultScParams = (scParams: Partial<CsdkRequestParams>) => {
  return {
    componentVariantIds: [],
    siteName: 'default',
    variantId: DEFAULT_VARIANT,
    ...scParams,
  };
};

describe('buildCacheKey', () => {
  it('builds sc:loader:page key from site, locale, variant, and pathKey', () => {
    const { key, dimensions } = buildCacheKey(
      'page',
      makeLoaderContext({
        url: '/about?preview=1',
        scParams: setDefaultScParams({ siteName: 'mysite' }),
      })
    );

    expect(dimensions).toEqual({
      site: 'mysite',
      locale: 'en',
      variantId: DEFAULT_VARIANT,
      loaderId: 'page',
      pathKey: 'about',
      componentVariantIds: [],
    });
    expect(key).toBe(`sc:loader:page:mysite:en:${DEFAULT_VARIANT}:about`);
  });

  it('uses _ pathKey for home route', () => {
    const { dimensions } = buildCacheKey(
      'page',
      makeLoaderContext({ url: '/', scParams: setDefaultScParams({ siteName: 'mysite' }) })
    );
    expect(dimensions.pathKey).toBe('_');
  });

  it('strips locale prefix from url when it matches params.locale', () => {
    const { dimensions } = buildCacheKey(
      'page',
      makeLoaderContext({
        url: '/en/about',
        routeParams: { locale: 'en' },
        scParams: setDefaultScParams({ siteName: 'mysite' }),
      })
    );
    expect(dimensions.pathKey).toBe('about');
  });

  it('builds dictionary key without variant or path', () => {
    const { key } = buildCacheKey(
      'dictionary',
      makeLoaderContext({ scParams: setDefaultScParams({ siteName: 'mysite' }) })
    );
    expect(key).toBe('sc:loader:dictionary:mysite:en');
  });

  it('defaults site and locale when params omit them', () => {
    const { dimensions } = buildCacheKey(
      'page',
      makeLoaderContext({
        routeParams: {},
        url: '/home',
        scParams: setDefaultScParams({ siteName: 'default' }),
      })
    );
    expect(dimensions.site).toBe('default');
    expect(dimensions.locale).toBe('en');
    expect(dimensions.pathKey).toBe('home');
  });
});

describe('serializeLoaderCacheKey', () => {
  it('dispatches page and dictionary shapes', () => {
    const pageDims: CacheKeyDimensions = {
      site: 'demo',
      locale: 'de',
      variantId: DEFAULT_VARIANT,
      loaderId: 'page',
      pathKey: 'products/shoes',
    };
    const dictDims: CacheKeyDimensions = {
      site: 'demo',
      locale: 'de',
      variantId: DEFAULT_VARIANT,
      loaderId: 'dictionary',
      pathKey: '_',
    };

    expect(buildPageCacheKey(pageDims)).toBe(
      `${CACHE_KEY_PREFIX}:page:demo:de:${DEFAULT_VARIANT}:products/shoes`
    );
    expect(buildDictionaryCacheKey(dictDims)).toBe(`${CACHE_KEY_PREFIX}:dictionary:demo:de`);
    expect(serializeLoaderCacheKey(pageDims)).toBe(buildPageCacheKey(pageDims));
  });
});
