/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import type { RouteData } from '@sitecore-content-sdk/content/layout';
import { getPageMetadata, PageMetadataRouteFields } from './page-metadata';

describe('getPageMetadata', () => {
  const route = (fields: PageMetadataRouteFields, extra: Partial<RouteData> = {}) =>
    ({ placeholders: {}, name: 'route', fields, ...extra }) as RouteData<PageMetadataRouteFields>;

  it('falls back to the default title when there is no Title field', () => {
    expect(getPageMetadata(undefined)).to.deep.equal({ title: 'Page' });
    expect(getPageMetadata(route({}), 'Custom Default')).to.deep.equal({ title: 'Custom Default' });
  });

  it('uses Title for <title> and never falls back to baseMetadataTitle', () => {
    const metadata = getPageMetadata(
      route({
        Title: { value: 'Page Title' },
        baseMetadataTitle: { value: 'Meta Title' },
      })
    );
    expect(metadata.title).to.equal('Page Title');
    expect(metadata.other).to.deep.equal({ title: 'Meta Title' });
  });

  it('omits every metadata/OG tag when its own field has no value', () => {
    expect(getPageMetadata(route({ Title: { value: 'Page Title' } }))).to.deep.equal({
      title: 'Page Title',
    });
  });

  it('maps the metadata fields with no cross-fallback', () => {
    const metadata = getPageMetadata(
      route({
        baseMetadataDescription: { value: 'desc' },
        baseMetadataKeywords: { value: 'kw' },
        baseMetadataAuthor: { value: 'author' },
      })
    );
    expect(metadata.description).to.equal('desc');
    expect(metadata.keywords).to.equal('kw');
    expect(metadata.authors).to.deep.equal([{ name: 'author' }]);
  });

  it('builds openGraph.images only when baseOgImage has a src', () => {
    const metadata = getPageMetadata(
      route({
        baseOgTitle: { value: 'og title' },
        baseOgImage: { value: { src: 'https://example.com/img.png', width: '100', height: '200', alt: 'alt' } },
      })
    );
    expect(metadata.openGraph).to.deep.equal({
      title: 'og title',
      images: [{ url: 'https://example.com/img.png', width: '100', height: '200', alt: 'alt' }],
    });
  });

  it('omits openGraph entirely when none of its fields have values', () => {
    const metadata = getPageMetadata(route({ baseMetadataDescription: { value: 'desc' } }));
    expect(metadata.openGraph).to.be.undefined;
  });

  it('renders the correct creation-time field per Open Graph type, from route.published', () => {
    const publishedRoute = route({ baseOgType: { value: 'book' } }, { published: '2020-01-01T00:00:00Z' });
    expect(getPageMetadata(publishedRoute).openGraph).to.deep.equal({
      type: 'book',
      releaseDate: '2020-01-01T00:00:00Z',
    });
  });

  it('only renders modifiedTime for the article type', () => {
    const articleRoute = route(
      { baseOgType: { value: 'article' } },
      { published: '2020-01-01T00:00:00Z', updated: '2021-01-01T00:00:00Z' }
    );
    expect(getPageMetadata(articleRoute).openGraph).to.deep.equal({
      type: 'article',
      publishedTime: '2020-01-01T00:00:00Z',
      modifiedTime: '2021-01-01T00:00:00Z',
    });

    const bookRoute = route(
      { baseOgType: { value: 'book' } },
      { published: '2020-01-01T00:00:00Z', updated: '2021-01-01T00:00:00Z' }
    );
    expect(getPageMetadata(bookRoute).openGraph).to.deep.equal({
      type: 'book',
      releaseDate: '2020-01-01T00:00:00Z',
    });
  });

  it('renders no time tag for Open Graph types without a date field', () => {
    const metadata = getPageMetadata(
      route({ baseOgType: { value: 'website' } }, { published: '2020-01-01T00:00:00Z' })
    );
    expect(metadata.openGraph).to.deep.equal({ type: 'website' });
  });
});
