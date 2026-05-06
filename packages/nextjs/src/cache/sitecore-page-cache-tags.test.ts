import { expect } from 'chai';
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
    },
  };

  it('includes personalization variant tag from pathname', () => {
    const tags = collectSitecorePageCacheTags({
      ...base,
      personalizedPathname: '/about/_variantId_hero-a',
    });
    expect(tags.some((t) => t.startsWith(`${SITECORE_CONTENT_CACHE_TAG_PREFIX}:pvv:`))).to.equal(true);
    expect(tags.some((t) => t.includes('hero-a'))).to.equal(true);
  });

  it('includes default variant tag when no rewrite segments', () => {
    const tags = collectSitecorePageCacheTags({
      ...base,
      personalizedPathname: '/about',
    });
    expect(tags.some((t) => t === `${SITECORE_CONTENT_CACHE_TAG_PREFIX}:pvv:_default`)).to.equal(true);
  });

  it('uses normalized route segments (strips variant markers from route tag)', () => {
    const tags = collectSitecorePageCacheTags({
      ...base,
      personalizedPathname: '/about/_variantId_hero-a',
    });
    const routeTag = tags.find((t) => t.startsWith(`${SITECORE_CONTENT_CACHE_TAG_PREFIX}:route:`));
    expect(routeTag).to.equal(`${SITECORE_CONTENT_CACHE_TAG_PREFIX}:route:website:en-us:about`);
  });

  it('includes route, dict, and item tags', () => {
    const tags = collectSitecorePageCacheTags({
      ...base,
      personalizedPathname: '/about',
    });
    expect(tags.some((t) => t.startsWith(`${SITECORE_CONTENT_CACHE_TAG_PREFIX}:route:`))).to.equal(true);
    expect(tags.some((t) => t.startsWith(`${SITECORE_CONTENT_CACHE_TAG_PREFIX}:dict:`))).to.equal(true);
    expect(tags.some((t) => t.startsWith(`${SITECORE_CONTENT_CACHE_TAG_PREFIX}:item:`))).to.equal(true);
  });
});
