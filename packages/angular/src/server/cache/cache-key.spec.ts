/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect } from 'vitest';
import type { LoaderContext } from '../../loaders/models';
import {
  buildCacheKey,
  buildDefaultTags,
  CACHE_KEY_PREFIX,
  resolveTagsToInvalidate,
  serializeKey,
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
  describe('when a loader runs for a localized page route', () => {
    it('builds a composite key from site, locale, loader id, and path', () => {
      const { key, dimensions } = buildCacheKey('page', makeContext({ url: '/about?preview=1' }));

      expect(dimensions).toEqual({
        site: 'mysite',
        locale: 'en',
        variantId: 'default',
        loaderId: 'page',
        route: '/about',
      });
      expect(key).toBe(
        `${CACHE_KEY_PREFIX}:mysite:en:default:page:${encodeURIComponent('/about')}`
      );
    });
  });

  describe('when route params omit site or locale', () => {
    it('defaults site to "default" and locale to "en"', () => {
      const { dimensions } = buildCacheKey(
        'page',
        makeContext({ params: {}, url: '/home' })
      );

      expect(dimensions.site).toBe('default');
      expect(dimensions.locale).toBe('en');
      expect(dimensions.route).toBe('/home');
    });
  });
});

describe('serializeKey', () => {
  it('joins identity dimensions with the scLoader prefix', () => {
    const dimensions: CacheKeyDimensions = {
      site: 'demo',
      locale: 'de',
      variantId: 'default',
      loaderId: 'page',
      route: '/products/shoes',
    };

    expect(serializeKey(dimensions)).toBe(
      `${CACHE_KEY_PREFIX}:demo:de:default:page:${encodeURIComponent('/products/shoes')}`
    );
  });
});

describe('buildDefaultTags', () => {
  it('mirrors each cache dimension as a tag for grouped invalidation', () => {
    const dimensions: CacheKeyDimensions = {
      site: 'demo',
      locale: 'fr',
      variantId: 'default',
      loaderId: 'page',
      route: '/news',
    };

    expect(buildDefaultTags(dimensions)).toEqual([
      'site:demo',
      'locale:fr',
      'variant:default',
      'loader:page',
      `route:${encodeURIComponent('/news')}`,
    ]);
  });
});

describe('resolveTagsToInvalidate', () => {
  const defaultSite = 'corporate';

  describe('when invalidating a single route on the default site', () => {
    it('requires both the default site tag and the route tag', () => {
      expect(resolveTagsToInvalidate({ route: '/about' }, defaultSite)).toEqual([
        `site:${encodeURIComponent('corporate')}`,
        `route:${encodeURIComponent('/about')}`,
      ]);
    });
  });

  describe('when invalidating across every site', () => {
    it('omits the site tag when site is "*"', () => {
      expect(resolveTagsToInvalidate({ route: '/about', site: '*' }, defaultSite)).toEqual([
        `route:${encodeURIComponent('/about')}`,
      ]);
    });
  });

  describe('when narrowing by language, loader, or variant', () => {
    it('adds a tag for each supplied dimension', () => {
      expect(
        resolveTagsToInvalidate(
          {
            route: '/products',
            site: 'shop',
            language: 'de',
            loaderId: 'page',
            variantId: 'personalized-a',
          },
          defaultSite
        )
      ).toEqual([
        `site:${encodeURIComponent('shop')}`,
        `locale:${encodeURIComponent('de')}`,
        `variant:${encodeURIComponent('personalized-a')}`,
        `loader:${encodeURIComponent('page')}`,
        `route:${encodeURIComponent('/products')}`,
      ]);
    });
  });

  describe('when invalidating by custom tags', () => {
    it('passes custom tags through without adding a prefix', () => {
      expect(
        resolveTagsToInvalidate({ tags: ['featured', 'category:news'] }, defaultSite)
      ).toEqual(['site:corporate', 'featured', 'category:news']);
    });
  });
});
