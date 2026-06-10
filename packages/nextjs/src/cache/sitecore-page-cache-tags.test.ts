import { expect } from 'chai';
import type { RouteData } from '@sitecore-content-sdk/content/layout';
import { collectSitecorePageCacheTags } from './sitecore-page-cache-tags';
import { SITECORE_CONTENT_CACHE_TAG_PREFIX } from './sitecore-cache-tags';

describe('collectSitecorePageCacheTags', () => {
  const base = {
    site: 'Website',
    locale: 'en-US',
    route: {
      itemId: '{11111111-1111-1111-1111-111111111111}',
      itemLanguage: 'en-US',
      itemVersion: 1,
      placeholders: {},
    } as RouteData,
  };

  it('uses normalized route segments (strips variant markers from route tag)', () => {
    const tags = collectSitecorePageCacheTags({
      ...base,
      path: '/about/_variantId_hero-a',
    });
    const routeTag = tags.find((t) => t.startsWith(`${SITECORE_CONTENT_CACHE_TAG_PREFIX}:route:`));
    expect(routeTag).to.equal(`${SITECORE_CONTENT_CACHE_TAG_PREFIX}:route:website:en-us:about`);
  });

  it('derives route segments from a pathname string', () => {
    const tags = collectSitecorePageCacheTags({
      ...base,
      path: '/about',
    });
    const routeTag = tags.find((t) => t.startsWith(`${SITECORE_CONTENT_CACHE_TAG_PREFIX}:route:`));
    expect(routeTag).to.equal(`${SITECORE_CONTENT_CACHE_TAG_PREFIX}:route:website:en-us:about`);
  });

  it('uses home route when path is omitted', () => {
    const tags = collectSitecorePageCacheTags({ ...base });
    const routeTag = tags.find((t) => t.startsWith(`${SITECORE_CONTENT_CACHE_TAG_PREFIX}:route:`));
    expect(routeTag).to.equal(`${SITECORE_CONTENT_CACHE_TAG_PREFIX}:route:website:en-us:_`);
  });

  it('uses home route when path is home', () => {
    const tags = collectSitecorePageCacheTags({ ...base, path: '/' });
    const routeTag = tags.find((t) => t.startsWith(`${SITECORE_CONTENT_CACHE_TAG_PREFIX}:route:`));
    expect(routeTag).to.equal(`${SITECORE_CONTENT_CACHE_TAG_PREFIX}:route:website:en-us:_`);
  });

  it('includes route and item tags only (no personalization variant tag)', () => {
    const tags = collectSitecorePageCacheTags({
      ...base,
      path: '/about',
    });
    expect(tags.some((t) => t.startsWith(`${SITECORE_CONTENT_CACHE_TAG_PREFIX}:route:`))).to.equal(true);
    expect(tags.some((t) => t.startsWith(`${SITECORE_CONTENT_CACHE_TAG_PREFIX}:item:`))).to.equal(true);
    expect(tags.some((t) => t.startsWith(`${SITECORE_CONTENT_CACHE_TAG_PREFIX}:pvv:`))).to.equal(false);
  });

  it('does not add a personalization variant tag even when pathname carries variant markers', () => {
    const tags = collectSitecorePageCacheTags({
      ...base,
      path: '/about/_variantId_hero-a',
    });
    expect(tags.some((t) => t.startsWith(`${SITECORE_CONTENT_CACHE_TAG_PREFIX}:pvv:`))).to.equal(false);
  });
});
