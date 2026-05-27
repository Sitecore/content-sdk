/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect } from 'vitest';
import { approxByteSize, dimensionsFromContext, resolveConfig, applyLoaderCacheConfigDefaults, urlToPathKey } from './utils';
import { DEFAULT_CACHE_TTL } from './models';

describe('urlToPathKey', () => {
  it('sanitizes path segments and uses _ for home', () => {
    expect(urlToPathKey('/')).toBe('_');
    expect(urlToPathKey('/About Us')).toBe('about_us');
    expect(urlToPathKey('/products/shoes')).toBe('products/shoes');
  });

  it('strips locale prefix when provided', () => {
    expect(urlToPathKey('/en/about', 'en')).toBe('about');
  });
});

describe('dimensionsFromContext', () => {
  it('reads site and locale from route params and derives pathKey', () => {
    const dimensions = dimensionsFromContext('page', {
      url: '/articles/1?ref=email',
      params: { site: 'blog', locale: 'de' },
      query: {},
    });

    expect(dimensions).toEqual({
      site: 'blog',
      locale: 'de',
      variantId: 'default',
      loaderId: 'page',
      pathKey: 'articles/1',
    });
  });

  it('falls back to default site, locale, and home pathKey', () => {
    const dimensions = dimensionsFromContext('page', {
      url: '',
      params: {},
      query: {},
    });

    expect(dimensions.site).toBe('default');
    expect(dimensions.locale).toBe('en');
    expect(dimensions.pathKey).toBe('_');
  });
});

describe('resolveConfig', () => {
  it('strips driver from global cache config', () => {
    expect(resolveConfig({ driver: {} as never, revalidate: 60 })).toEqual({ revalidate: 60 });
  });
});

describe('applyLoaderCacheConfigDefaults', () => {
  it('applies defaults for every config field', () => {
    expect(applyLoaderCacheConfigDefaults({})).toEqual({
      revalidate: DEFAULT_CACHE_TTL,
      enabled: true,
      defaultSiteName: 'default',
      tags: [],
      sites: [],
      defaultLocale: 'en',
    });
  });
});

describe('approxByteSize', () => {
  it('returns the JSON string length for serializable values', () => {
    expect(approxByteSize({ title: 'Home' })).toBe(JSON.stringify({ title: 'Home' }).length);
  });

  it('returns zero when the value cannot be serialized', () => {
    const circular: { self?: unknown } = {};
    circular.self = circular;
    expect(approxByteSize(circular)).toBe(0);
  });
});
