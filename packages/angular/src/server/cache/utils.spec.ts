/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect } from 'vitest';
import { DEFAULT_VARIANT } from '@sitecore-content-sdk/content/personalize';
import {
  approxByteSize,
  dimensionsFromContext,
  resolveConfig,
  applyLoaderCacheConfigDefaults,
  urlToPathKey,
  evaluateCacheRead,
  sanitizeSitecoreCacheSegment,
  normalizeSitecoreItemIdForCacheKey,
  dedupeCacheStrings,
} from './utils';
import { DEFAULT_CACHE_TTL } from './models';
import { mockScParams } from '../../testing/loader-spec-helpers';

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
      routeParams: { locale: 'de' },
      query: {},
      scParams: mockScParams({ siteName: 'blog' }),
    });

    expect(dimensions).toEqual({
      site: 'blog',
      locale: 'de',
      variantId: DEFAULT_VARIANT,
      componentVariantIds: [],
      loaderId: 'page',
      pathKey: 'articles/1',
    });
  });

  it('falls back to default site, locale, and home pathKey', () => {
    const dimensions = dimensionsFromContext('page', {
      url: '',
      routeParams: {},
      query: {},
      scParams: mockScParams({ siteName: 'default' }),
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

describe('evaluateCacheRead', () => {
  it('returns miss when entry is absent', () => {
    expect(evaluateCacheRead('sc:key', null)).toEqual({ kind: 'miss', cacheKey: 'sc:key' });
  });

  it('returns hit for fresh non-stale entries', () => {
    const now = 1_000_000;
    expect(
      evaluateCacheRead(
        'sc:key',
        { value: { ok: true }, tags: [], storedAt: now, expiresAt: now + 60_000, stale: false },
        now
      )
    ).toEqual({ kind: 'hit', value: { ok: true }, cacheKey: 'sc:key' });
  });

  it('returns stale when entry is flagged stale or past expiry', () => {
    const now = 1_000_000;
    expect(
      evaluateCacheRead(
        'sc:key',
        {
          value: { old: true },
          tags: [],
          storedAt: now - 120_000,
          expiresAt: now - 1,
          stale: false,
        },
        now
      )
    ).toEqual({ kind: 'stale', value: { old: true }, cacheKey: 'sc:key' });

    expect(
      evaluateCacheRead(
        'sc:key',
        { value: { flagged: true }, tags: [], storedAt: now, expiresAt: null, stale: true },
        now
      )
    ).toEqual({ kind: 'stale', value: { flagged: true }, cacheKey: 'sc:key' });
  });
});

describe('sanitizeSitecoreCacheSegment', () => {
  it('lowercases and replaces separators with underscores', () => {
    expect(sanitizeSitecoreCacheSegment(' Demo/Site ')).toBe('demo_site');
  });
});

describe('normalizeSitecoreItemIdForCacheKey', () => {
  it('strips braces and lowercases item ids', () => {
    expect(normalizeSitecoreItemIdForCacheKey(' {ABC-123} ')).toBe('abc-123');
  });
});

describe('dedupeCacheStrings', () => {
  it('preserves first-seen order while removing duplicates', () => {
    expect(dedupeCacheStrings(['a', 'b', 'a', 'c', 'b'])).toEqual(['a', 'b', 'c']);
  });
});
