import { expect } from 'chai';
import type { RouteData } from '@sitecore-content-sdk/content/layout';
import {
  buildSitecoreDictionaryCacheTag,
  buildSitecoreDictionaryCacheTagsFromSites,
  buildSitecoreItemCacheTag,
  buildSitecoreItemCacheTagFromRouteData,
  buildSitecoreRouteCacheTag,
  dedupeSitecoreCacheTags,
  normalizeSitecoreItemIdForCacheTag,
  sanitizeSitecoreCacheTagSegment,
  SITECORE_CONTENT_CACHE_TAG_PREFIX,
} from './sitecore-cache-tags';

describe('sitecore-cache-tags', () => {
  describe('sanitizeSitecoreCacheTagSegment', () => {
    it('lowercases and replaces reserved characters', () => {
      expect(sanitizeSitecoreCacheTagSegment('  MySite  ')).to.equal('mysite');
      expect(sanitizeSitecoreCacheTagSegment('a/b:c')).to.equal('a_b_c');
      expect(sanitizeSitecoreCacheTagSegment('x y\tz')).to.equal('x_y_z');
    });
  });

  describe('normalizeSitecoreItemIdForCacheTag', () => {
    it('strips braces and lowercases', () => {
      expect(normalizeSitecoreItemIdForCacheTag('{52961EEA-BAFD-5287-A532-A72E36BD8A36}')).to.equal(
        '52961eea-bafd-5287-a532-a72e36bd8a36'
      );
    });
  });

  describe('buildSitecoreRouteCacheTag', () => {
    it('builds home path key when segments omitted', () => {
      expect(buildSitecoreRouteCacheTag({ site: 'Website', locale: 'en-US' })).to.equal(
        `${SITECORE_CONTENT_CACHE_TAG_PREFIX}:route:website:en-us:_`
      );
    });

    it('joins path segments', () => {
      expect(
        buildSitecoreRouteCacheTag({
          site: 'Website',
          locale: 'en-US',
          pathSegments: ['About', 'Team'],
        })
      ).to.equal(`${SITECORE_CONTENT_CACHE_TAG_PREFIX}:route:website:en-us:about/team`);
    });
  });

  describe('buildSitecoreItemCacheTag', () => {
    it('uses latest when version omitted', () => {
      expect(
        buildSitecoreItemCacheTag({
          itemId: '{52961EEA-BAFD-5287-A532-A72E36BD8A36}',
          locale: 'en-US',
        })
      ).to.equal(
        `${SITECORE_CONTENT_CACHE_TAG_PREFIX}:item:52961eea-bafd-5287-a532-a72e36bd8a36:en-us:latest`
      );
    });

    it('includes integer version', () => {
      expect(
        buildSitecoreItemCacheTag({
          itemId: '52961eea-bafd-5287-a532-a72e36bd8a36',
          locale: 'en-US',
          version: 4,
        })
      ).to.equal(
        `${SITECORE_CONTENT_CACHE_TAG_PREFIX}:item:52961eea-bafd-5287-a532-a72e36bd8a36:en-us:v4`
      );
    });
  });

  describe('buildSitecoreDictionaryCacheTag', () => {
    it('scopes by site and locale', () => {
      expect(buildSitecoreDictionaryCacheTag({ site: 'Website', locale: 'da-DK' })).to.equal(
        `${SITECORE_CONTENT_CACHE_TAG_PREFIX}:dict:website:da-dk`
      );
    });
  });

  describe('buildSitecoreDictionaryCacheTagsFromSites', () => {
    it('dedupes duplicate site locale combinations', () => {
      expect(
        buildSitecoreDictionaryCacheTagsFromSites({
          sites: [
            { name: 'Website', language: 'en' },
            { name: 'Website', language: 'en' },
          ],
          baseLocale: 'en',
        })
      ).to.deep.equal([`${SITECORE_CONTENT_CACHE_TAG_PREFIX}:dict:website:en`]);
    });

    it('uses baseLocale when site language is empty', () => {
      expect(
        buildSitecoreDictionaryCacheTagsFromSites({
          sites: [{ name: 'Solo', language: '' }],
          baseLocale: 'fr-FR',
        })
      ).to.deep.equal([`${SITECORE_CONTENT_CACHE_TAG_PREFIX}:dict:solo:fr-fr`]);
    });
  });

  describe('buildSitecoreItemCacheTagFromRouteData', () => {
    it('returns null when route is undefined', () => {
      expect(buildSitecoreItemCacheTagFromRouteData(undefined, 'en-US')).to.equal(null);
    });

    it('returns null when itemId is missing', () => {
      expect(
        buildSitecoreItemCacheTagFromRouteData({ placeholders: {} } as RouteData, 'en-US')
      ).to.equal(null);
    });

    it('uses itemLanguage from route when set', () => {
      expect(
        buildSitecoreItemCacheTagFromRouteData(
          {
            itemId: '{A1111111-1111-1111-1111-111111111111}',
            itemLanguage: 'fr-FR',
            itemVersion: 2,
            placeholders: {},
          } as RouteData,
          'en-US'
        )
      ).to.equal(
        `${SITECORE_CONTENT_CACHE_TAG_PREFIX}:item:a1111111-1111-1111-1111-111111111111:fr-fr:v2`
      );
    });

    it('falls back to fallbackLocale', () => {
      expect(
        buildSitecoreItemCacheTagFromRouteData(
          { itemId: 'a1111111111111111111111111111111', placeholders: {} } as RouteData,
          'en-US'
        )
      ).to.equal(
        `${SITECORE_CONTENT_CACHE_TAG_PREFIX}:item:a1111111111111111111111111111111:en-us:latest`
      );
    });
  });

  describe('dedupeSitecoreCacheTags', () => {
    it('preserves order and removes duplicates', () => {
      expect(dedupeSitecoreCacheTags(['a', 'b', 'a', 'c', 'b'])).to.deep.equal(['a', 'b', 'c']);
    });
  });
});
