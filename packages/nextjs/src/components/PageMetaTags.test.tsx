/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { render, cleanup } from '@testing-library/react';
import React from 'react';
import { HeadManagerContext } from 'next/dist/shared/lib/head-manager-context.shared-runtime';
import type { RouteData } from '@sitecore-content-sdk/content/layout';
import { PageMetaTags, PageMetaTagsProps } from './PageMetaTags';
import type { PageMetadataRouteFields } from '../metadata/page-metadata';

/**
 * `next/head` only writes to `document.head` when a `HeadManagerContext` is present (normally
 * supplied by the Next.js Pages Router client runtime). This is a minimal, spec-equivalent stand-in
 * for that runtime piece so `<PageMetaTags>` can be exercised through the real `next/head` component.
 */
function createTestHeadManager() {
  return {
    mountedInstances: new Set(),
    updateHead: (headElements: { type: string; props: Record<string, unknown> }[]) => {
      document.head.querySelectorAll('meta[data-test-head]').forEach((el) => el.remove());
      let title = '';
      headElements.forEach((el) => {
        if (el.type === 'title') {
          const { children } = el.props as { children?: unknown };
          title = typeof children === 'string' ? children : '';
          return;
        }
        if (el.type === 'meta') {
          const props = el.props as Record<string, unknown>;
          // Skip next/head's own default charset/viewport tags - only track ours.
          if (props.charSet !== undefined || props.name === 'viewport') return;
          const meta = document.createElement('meta');
          Object.entries(props).forEach(([key, value]) => {
            if (key !== 'children' && value !== undefined) meta.setAttribute(key, String(value));
          });
          meta.setAttribute('data-test-head', '');
          document.head.appendChild(meta);
        }
      });
      document.title = title;
    },
  };
}

describe('<PageMetaTags />', () => {
  afterEach(() => {
    cleanup();
    document.title = '';
    document.head.querySelectorAll('meta').forEach((meta) => meta.remove());
  });

  const route = (
    fields: PageMetadataRouteFields,
    extra: Partial<RouteData> = {}
  ): RouteData<PageMetadataRouteFields> =>
    ({ placeholders: {}, name: 'route', fields, ...extra }) as RouteData<PageMetadataRouteFields>;

  const renderTags = (props: PageMetaTagsProps) =>
    render(
      <HeadManagerContext.Provider value={createTestHeadManager()}>
        <PageMetaTags {...props} />
      </HeadManagerContext.Provider>
    );
  const metaContent = (property: string) =>
    document.head
      .querySelector(`meta[name="${property}"], meta[property="${property}"]`)
      ?.getAttribute('content');

  it('falls back to the default title when there is no Title field', () => {
    renderTags({ route: undefined });
    expect(document.title).to.equal('Page');
  });

  it('uses Title for <title> and never falls back to baseMetadataTitle', () => {
    renderTags({
      route: route({
        Title: { value: 'Page Title' },
        baseMetadataTitle: { value: 'Meta Title' },
      }),
    });
    expect(document.title).to.equal('Page Title');
    expect(metaContent('title')).to.equal('Meta Title');
  });

  it('omits every metadata/OG tag when its own field has no value', () => {
    renderTags({ route: route({ Title: { value: 'Page Title' } }) });
    // next/head always injects its own default charset/viewport meta tags; only ours should be absent.
    expect(document.head.querySelectorAll('meta[data-test-head]')).to.have.lengthOf(0);
  });

  it('maps the metadata fields with no cross-fallback', () => {
    renderTags({
      route: route({
        baseMetadataDescription: { value: 'desc' },
        baseMetadataKeywords: { value: 'kw' },
        baseMetadataAuthor: { value: 'author' },
      }),
    });
    expect(metaContent('description')).to.equal('desc');
    expect(metaContent('keywords')).to.equal('kw');
    expect(metaContent('author')).to.equal('author');
  });

  it('renders og:image dimensions/alt only when baseOgImage has a src', () => {
    renderTags({
      route: route({
        baseOgTitle: { value: 'og title' },
        baseOgImage: {
          value: { src: 'https://example.com/img.png', width: '100', height: '200', alt: 'alt' },
        },
      }),
    });
    expect(metaContent('og:title')).to.equal('og title');
    expect(metaContent('og:image')).to.equal('https://example.com/img.png');
    expect(metaContent('og:image:width')).to.equal('100');
    expect(metaContent('og:image:height')).to.equal('200');
    expect(metaContent('og:image:alt')).to.equal('alt');
  });

  it('renders the correct creation-time tag per Open Graph type, from route.published', () => {
    renderTags({
      route: route({ baseOgType: { value: 'book' } }, { published: '2020-01-01T00:00:00Z' }),
    });
    expect(metaContent('og:type')).to.equal('book');
    expect(metaContent('book:release_date')).to.equal('2020-01-01T00:00:00Z');
  });

  it('only renders article:modified_time for the article type', () => {
    renderTags({
      route: route(
        { baseOgType: { value: 'article' } },
        { published: '2020-01-01T00:00:00Z', updated: '2021-01-01T00:00:00Z' }
      ),
    });
    expect(metaContent('article:published_time')).to.equal('2020-01-01T00:00:00Z');
    expect(metaContent('article:modified_time')).to.equal('2021-01-01T00:00:00Z');
  });

  it('renders no time tag for Open Graph types without a date field', () => {
    renderTags({
      route: route({ baseOgType: { value: 'website' } }, { published: '2020-01-01T00:00:00Z' }),
    });
    expect(metaContent('og:type')).to.equal('website');
    expect(document.head.querySelectorAll('meta[property$="_time"], meta[property$="_date"]')).to
      .have.lengthOf(0);
  });
});
