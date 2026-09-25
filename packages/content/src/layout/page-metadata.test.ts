/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { resolvePageMetadataFields, PageMetadataRouteFields } from './page-metadata';
import { RouteData } from './models';

describe('resolvePageMetadataFields', () => {
  const route = (fields: PageMetadataRouteFields, extra: Partial<RouteData> = {}) =>
    ({ placeholders: {}, name: 'route', fields, ...extra }) as RouteData<PageMetadataRouteFields>;

  it('falls back to the default title when there is no route or Title field', () => {
    expect(resolvePageMetadataFields(undefined, 'Page').title).to.equal('Page');
    expect(resolvePageMetadataFields(null, 'Page').title).to.equal('Page');
    expect(resolvePageMetadataFields(route({}), 'Custom').title).to.equal('Custom');
  });

  it('uses Title for title and resolves baseMetadataTitle to metaTitle only', () => {
    const result = resolvePageMetadataFields(
      route({ Title: { value: 'Page Title' }, baseMetadataTitle: { value: 'Meta Title' } }),
      'Page'
    );
    expect(result.title).to.equal('Page Title');
    expect(result.metaTitle).to.equal('Meta Title');
  });

  it('does not fall back to baseMetadataTitle when Title is missing', () => {
    const result = resolvePageMetadataFields(
      route({ baseMetadataTitle: { value: 'Meta Title' } }),
      'Page'
    );
    expect(result.title).to.equal('Page');
  });

  it('resolves every metadata/OG field with no cross-fallback', () => {
    const ogImage = { src: '/og.png', width: '1200', height: '630', alt: 'alt' };
    const result = resolvePageMetadataFields(
      route({
        baseMetadataDescription: { value: 'desc' },
        baseMetadataKeywords: { value: 'kw' },
        baseMetadataAuthor: { value: 'author' },
        baseOgTitle: { value: 'og title' },
        baseOgDescription: { value: 'og desc' },
        baseOgImage: { value: ogImage },
      }),
      'Page'
    );
    expect(result).to.deep.include({
      description: 'desc',
      keywords: 'kw',
      author: 'author',
      ogTitle: 'og title',
      ogDescription: 'og desc',
      ogImage,
      ogImageSrc: '/og.png',
    });
    expect(result.metaTitle).to.be.undefined;
    expect(result.ogType).to.be.undefined;
  });

  it('leaves each field undefined when it has no value', () => {
    const result = resolvePageMetadataFields(route({ baseOgTitle: { value: 'og title' } }), 'Page');
    expect(result.description).to.be.undefined;
    expect(result.ogDescription).to.be.undefined;
    expect(result.ogImageSrc).to.be.undefined;
  });

  it('resolves article creation and modified time tags from route dates', () => {
    const result = resolvePageMetadataFields(
      route(
        { baseOgType: { value: 'article' } },
        { published: '2026-01-01T00:00:00Z', updated: '2026-02-01T00:00:00Z' }
      ),
      'Page'
    );
    expect(result.ogType).to.equal('article');
    expect(result.creationTimeTag).to.equal('article:published_time');
    expect(result.creationTime).to.equal('2026-01-01T00:00:00Z');
    expect(result.modifiedTimeTag).to.equal('article:modified_time');
    expect(result.modifiedTime).to.equal('2026-02-01T00:00:00Z');
  });

  it('resolves release date only for types without a modified time tag', () => {
    const result = resolvePageMetadataFields(
      route(
        { baseOgType: { value: 'book' } },
        { published: '2026-01-01T00:00:00Z', updated: '2026-02-01T00:00:00Z' }
      ),
      'Page'
    );
    expect(result.creationTimeTag).to.equal('book:release_date');
    expect(result.creationTime).to.equal('2026-01-01T00:00:00Z');
    expect(result.modifiedTimeTag).to.be.undefined;
    expect(result.modifiedTime).to.be.undefined;
  });

  it('ignores route dates for OG types without time tags', () => {
    const result = resolvePageMetadataFields(
      route({ baseOgType: { value: 'website' } }, { published: '2026-01-01T00:00:00Z' }),
      'Page'
    );
    expect(result.creationTimeTag).to.be.undefined;
    expect(result.creationTime).to.be.undefined;
  });
});
