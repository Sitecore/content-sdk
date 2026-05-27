/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect } from 'vitest';
import type { RouteData } from '@sitecore-content-sdk/content/layout';
import {
  SITECORE_CONTENT_CACHE_TAG_PREFIX,
  buildSitecoreItemCacheTag,
  buildSitecoreDictionaryCacheTag,
  buildSitecoreItemCacheTagFromRouteData,
  buildLoaderDictionaryCacheTagsFromSites,
  buildLoaderDictionaryCacheTag,
  buildSitecoreSiteCacheTag,
  buildSitecoreLocaleCacheTag,
  buildLoaderCacheTags,
} from './cache-tags';
import type { CacheKeyDimensions } from './models';

const pageDimensions: CacheKeyDimensions = {
  site: 'Demo Site',
  locale: 'en-US',
  variantId: 'default',
  loaderId: 'page',
  pathKey: 'about',
};

describe('buildSitecoreItemCacheTag', () => {
  it('normalizes item id and builds latest version tag by default', () => {
    expect(
      buildSitecoreItemCacheTag({ itemId: '{ABC-123}', locale: 'en-US', version: undefined })
    ).toBe(`${SITECORE_CONTENT_CACHE_TAG_PREFIX}:item:abc-123:en-us:latest`);
  });

  it('includes numeric version when provided', () => {
    expect(buildSitecoreItemCacheTag({ itemId: 'abc', locale: 'en', version: 3.7 })).toBe(
      `${SITECORE_CONTENT_CACHE_TAG_PREFIX}:item:abc:en:v3`
    );
  });
});

describe('buildSitecoreDictionaryCacheTag', () => {
  it('sanitizes site and locale segments', () => {
    expect(buildSitecoreDictionaryCacheTag({ site: 'Demo Site', locale: 'en US' })).toBe(
      `${SITECORE_CONTENT_CACHE_TAG_PREFIX}:dict:demo_site:en_us`
    );
  });
});

describe('buildSitecoreItemCacheTagFromRouteData', () => {
  it('returns null when route has no itemId', () => {
    expect(buildSitecoreItemCacheTagFromRouteData(null, 'en')).toBeNull();
    expect(buildSitecoreItemCacheTagFromRouteData({} as RouteData, 'en')).toBeNull();
  });

  it('uses route language and version when present', () => {
    const route = {
      itemId: '{GUID}',
      itemLanguage: 'de',
      itemVersion: 5,
    } as RouteData;

    expect(buildSitecoreItemCacheTagFromRouteData(route, 'en')).toBe(
      `${SITECORE_CONTENT_CACHE_TAG_PREFIX}:item:guid:de:v5`
    );
  });

  it('falls back to provided locale when route language is absent', () => {
    const route = { itemId: 'item-1' } as RouteData;
    expect(buildSitecoreItemCacheTagFromRouteData(route, 'fr-CA')).toBe(
      `${SITECORE_CONTENT_CACHE_TAG_PREFIX}:item:item-1:fr-ca:latest`
    );
  });
});

describe('buildLoaderDictionaryCacheTagsFromSites', () => {
  it('dedupes tags and falls back to base locale', () => {
    const tags = buildLoaderDictionaryCacheTagsFromSites({
      sites: [
        { name: 'shop', language: 'en' },
        { name: 'shop', language: 'en' },
        { name: 'blog', language: '   ' },
      ],
      baseLocale: 'de',
    });

    expect(tags).toEqual([
      `${SITECORE_CONTENT_CACHE_TAG_PREFIX}:loader:dictionary:shop:en`,
      `${SITECORE_CONTENT_CACHE_TAG_PREFIX}:loader:dictionary:blog:de`,
    ]);
  });
});

describe('buildLoaderDictionaryCacheTag', () => {
  it('builds loader dictionary self-tag', () => {
    expect(buildLoaderDictionaryCacheTag({ site: 'demo', locale: 'en' })).toBe(
      `${SITECORE_CONTENT_CACHE_TAG_PREFIX}:loader:dictionary:demo:en`
    );
  });
});

describe('buildSitecoreSiteCacheTag / buildSitecoreLocaleCacheTag', () => {
  it('sanitizes site and locale fan-out tags', () => {
    expect(buildSitecoreSiteCacheTag('My Site')).toBe(
      `${SITECORE_CONTENT_CACHE_TAG_PREFIX}:site:my_site`
    );
    expect(buildSitecoreLocaleCacheTag('en US')).toBe(
      `${SITECORE_CONTENT_CACHE_TAG_PREFIX}:locale:en_us`
    );
  });
});

describe('buildLoaderCacheTags', () => {
  const cacheKey = 'sc:loader:page:demo:en:default:about';

  it('includes site, locale, self-key, and custom tags', () => {
    const tags = buildLoaderCacheTags('footer', pageDimensions, cacheKey, undefined, [
      'custom:tag',
      cacheKey,
    ]);

    expect(tags).toContain(cacheKey);
    expect(tags).toContain(`${SITECORE_CONTENT_CACHE_TAG_PREFIX}:site:demo_site`);
    expect(tags).toContain(`${SITECORE_CONTENT_CACHE_TAG_PREFIX}:locale:en-us`);
    expect(tags).toContain('custom:tag');
    expect(tags.length).toBe(new Set(tags).size);
  });

  it('adds item tag for page loader when layout route has itemId', () => {
    const pageValue = {
      layout: {
        sitecore: {
          route: {
            itemId: '{ITEM-1}',
            itemLanguage: 'en',
          },
        },
      },
    };

    const tags = buildLoaderCacheTags('page', pageDimensions, cacheKey, pageValue);

    expect(tags).toContain(`${SITECORE_CONTENT_CACHE_TAG_PREFIX}:item:item-1:en:latest`);
  });

  it('skips item tag for page loader when value is not a page shape', () => {
    const tags = buildLoaderCacheTags('page', pageDimensions, cacheKey, 'not-a-page');
    expect(tags.some((tag) => tag.includes(':item:'))).toBe(false);
  });

  it('adds dictionary tag for dictionary loader', () => {
    const dictDimensions: CacheKeyDimensions = {
      ...pageDimensions,
      loaderId: 'dictionary',
    };
    const dictKey = 'sc:loader:dictionary:demo:en';

    const tags = buildLoaderCacheTags('dictionary', dictDimensions, dictKey);

    expect(tags).toContain(`${SITECORE_CONTENT_CACHE_TAG_PREFIX}:dict:demo_site:en-us`);
  });
});
