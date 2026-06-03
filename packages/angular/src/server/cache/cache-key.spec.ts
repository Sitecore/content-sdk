/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect } from 'vitest';
import type { LoaderContext } from '../../loaders/models';
import {
  buildCacheKey,
  buildPageCacheKey,
  buildDictionaryCacheKey,
  CACHE_KEY_PREFIX,
  serializeLoaderCacheKey,
} from './cache-key';
import type { CacheKeyDimensions } from './models';

function makeContext(overrides: Partial<LoaderContext> = {}): LoaderContext {
  return {
    url: '/about',
    params: { site: 'mysite', locale: 'en' },
    query: {},
    ...overrides,
  };
}

describe('buildCacheKey', () => {
  it('builds sc:loader:page key from site, locale, variant, and pathKey', () => {
    const { key, dimensions } = buildCacheKey('page', makeContext({ url: '/about?preview=1' }));

    expect(dimensions).toEqual({
      site: 'mysite',
      locale: 'en',
      variantId: 'default',
      loaderId: 'page',
      pathKey: 'about',
    });
    expect(key).toBe('sc:loader:page:mysite:en:default:about');
  });

  it('uses _ pathKey for home route', () => {
    const { dimensions } = buildCacheKey('page', makeContext({ url: '/' }));
    expect(dimensions.pathKey).toBe('_');
  });

  it('strips locale prefix from url when it matches params.locale', () => {
    const { dimensions } = buildCacheKey(
      'page',
      makeContext({ url: '/en/about', params: { site: 'mysite', locale: 'en' } })
    );
    expect(dimensions.pathKey).toBe('about');
  });

  it('builds dictionary key without variant or path', () => {
    const { key } = buildCacheKey('dictionary', makeContext());
    expect(key).toBe('sc:loader:dictionary:mysite:en');
  });

  it('defaults site and locale when params omit them', () => {
    const { dimensions } = buildCacheKey('page', makeContext({ params: {}, url: '/home' }));
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
      variantId: 'default',
      loaderId: 'page',
      pathKey: 'products/shoes',
    };
    const dictDims: CacheKeyDimensions = {
      site: 'demo',
      locale: 'de',
      variantId: 'default',
      loaderId: 'dictionary',
      pathKey: '_',
    };

    expect(buildPageCacheKey(pageDims)).toBe(
      `${CACHE_KEY_PREFIX}:page:demo:de:default:products/shoes`
    );
    expect(buildDictionaryCacheKey(dictDims)).toBe(`${CACHE_KEY_PREFIX}:dictionary:demo:de`);
    expect(serializeLoaderCacheKey(pageDims)).toBe(buildPageCacheKey(pageDims));
  });
});
