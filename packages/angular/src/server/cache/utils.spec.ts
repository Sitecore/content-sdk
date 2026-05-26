/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect } from 'vitest';
import { approxByteSize, dimensionsFromContext, resolveConfig } from './utils';
import { DEFAULT_CACHE_TTL } from './models';

describe('dimensionsFromContext', () => {
  describe('when building cache dimensions from a loader context', () => {
    it('reads site and locale from route params and strips query strings from the url', () => {
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
        route: '/articles/1',
      });
    });
  });

  describe('when params are missing', () => {
    it('falls back to default site, locale, and root route', () => {
      const dimensions = dimensionsFromContext('page', {
        url: '',
        params: {},
        query: {},
      });

      expect(dimensions.site).toBe('default');
      expect(dimensions.locale).toBe('en');
      expect(dimensions.route).toBe('/');
    });
  });
});

describe('resolveConfig', () => {
  describe('when the app passes a partial cache config', () => {
    it('applies defaults for ttl, enabled flag, namespace, and default site name', () => {
      expect(resolveConfig({})).toEqual({
        revalidate: DEFAULT_CACHE_TTL,
        enabled: true,
        namespace: '',
        defaultSiteName: 'default',
        loaders: {},
      });
    });
  });

  describe('when the app overrides cache settings', () => {
    it('keeps the supplied values intact', () => {
      expect(
        resolveConfig({
          revalidate: 60,
          enabled: false,
          namespace: 'preview',
          defaultSiteName: 'shop',
          loaders: { page: { revalidate: 120 } },
        })
      ).toEqual({
        revalidate: 60,
        enabled: false,
        namespace: 'preview',
        defaultSiteName: 'shop',
        loaders: { page: { revalidate: 120 } },
      });
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
