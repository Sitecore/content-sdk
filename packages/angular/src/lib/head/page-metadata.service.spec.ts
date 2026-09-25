/* eslint-disable jsdoc/require-jsdoc */
import { Component, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, RouterOutlet } from '@angular/router';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { PageMetadataRouteFields, RouteData } from '@sitecore-content-sdk/content/layout';
import { PageMetadataService } from './page-metadata.service';
import { ScPageMetaTagsComponent } from './sc-page-meta-tags.component';

const route = (fields: PageMetadataRouteFields, extra: Partial<RouteData> = {}) =>
  ({ placeholders: {}, name: 'route', fields, ...extra }) as RouteData<PageMetadataRouteFields>;

const fullRoute = route(
  {
    Title: { value: 'Page Title' },
    baseMetadataTitle: { value: 'Meta Title' },
    baseMetadataDescription: { value: 'desc' },
    baseMetadataKeywords: { value: 'kw' },
    baseMetadataAuthor: { value: 'author' },
    baseOgTitle: { value: 'og title' },
    baseOgDescription: { value: 'og desc' },
    baseOgImage: { value: { src: '/og.png', width: '1200', height: '630', alt: 'alt' } },
    baseOgType: { value: 'article' },
  },
  { published: '2026-01-01T00:00:00Z', updated: '2026-02-01T00:00:00Z' }
);

describe('PageMetadataService', () => {
  let service: PageMetadataService;
  let doc: Document;

  const content = (selector: string) =>
    doc.head.querySelector(`meta[${selector}]`)?.getAttribute('content') ?? null;
  const count = (selector: string) => doc.head.querySelectorAll(`meta[${selector}]`).length;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PageMetadataService);
    doc = TestBed.inject(DOCUMENT);
  });

  afterEach(() => service.clear());

  it('sets the title from the Title field, falling back to the default title', () => {
    service.apply(fullRoute);
    expect(doc.title).toBe('Page Title');

    service.apply(route({ baseMetadataTitle: { value: 'Meta Title' } }));
    expect(doc.title).toBe('Page');

    service.apply(null, 'Custom');
    expect(doc.title).toBe('Custom');
  });

  it('renders every metadata and Open Graph tag', () => {
    service.apply(fullRoute);

    expect(content('name="title"')).toBe('Meta Title');
    expect(content('name="description"')).toBe('desc');
    expect(content('name="keywords"')).toBe('kw');
    expect(content('name="author"')).toBe('author');
    expect(content('property="og:title"')).toBe('og title');
    expect(content('property="og:description"')).toBe('og desc');
    expect(content('property="og:image"')).toBe('/og.png');
    expect(content('property="og:image:width"')).toBe('1200');
    expect(content('property="og:image:height"')).toBe('630');
    expect(content('property="og:image:alt"')).toBe('alt');
    expect(content('property="og:type"')).toBe('article');
    expect(content('property="article:published_time"')).toBe('2026-01-01T00:00:00Z');
    expect(content('property="article:modified_time"')).toBe('2026-02-01T00:00:00Z');
  });

  it('omits tags whose field has no value', () => {
    service.apply(route({ Title: { value: 'Page Title' } }));

    expect(doc.head.querySelectorAll('meta[name="title"], meta[property^="og:"]').length).toBe(0);
    expect(content('name="description"')).toBeNull();
  });

  it('omits og:image attributes when baseOgImage has no src', () => {
    service.apply(route({ baseOgImage: { value: { width: '1200', alt: 'alt' } } }));

    expect(content('property="og:image"')).toBeNull();
    expect(content('property="og:image:width"')).toBeNull();
    expect(content('property="og:image:alt"')).toBeNull();
  });

  it('renders the release date tag for non-article types, without a modified time tag', () => {
    service.apply(
      route(
        { baseOgType: { value: 'video.movie' } },
        { published: '2026-01-01T00:00:00Z', updated: '2026-02-01T00:00:00Z' }
      )
    );

    expect(content('property="video:release_date"')).toBe('2026-01-01T00:00:00Z');
    expect(content('property="article:modified_time"')).toBeNull();
  });

  it('updates tags in place and removes stale tags when applied again', () => {
    service.apply(fullRoute);
    service.apply(route({ baseMetadataDescription: { value: 'new desc' } }));

    expect(count('name="description"')).toBe(1);
    expect(content('name="description"')).toBe('new desc');
    expect(content('name="keywords"')).toBeNull();
    expect(content('property="og:image"')).toBeNull();
    expect(content('property="article:published_time"')).toBeNull();
  });

  it('removes the managed tags on clear', () => {
    service.apply(fullRoute);
    service.clear();

    expect(content('name="description"')).toBeNull();
    expect(content('property="og:title"')).toBeNull();
  });
});

@Component({
  imports: [ScPageMetaTagsComponent],
  template: `@if (show()) {
    <sc-page-meta-tags [route]="route()" />
  }`,
})
class HostComponent {
  readonly show = signal(true);
  readonly route = signal<RouteData<PageMetadataRouteFields> | null>(fullRoute);
}

describe('ScPageMetaTagsComponent', () => {
  let doc: Document;

  const content = (selector: string) =>
    doc.head.querySelector(`meta[${selector}]`)?.getAttribute('content') ?? null;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    doc = TestBed.inject(DOCUMENT);
  });

  afterEach(() => TestBed.inject(PageMetadataService).clear());

  it('applies the tags, re-applies on route change and cleans up on destroy', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    expect(doc.title).toBe('Page Title');
    expect(content('name="description"')).toBe('desc');

    fixture.componentInstance.route.set(route({ Title: { value: 'Other' } }));
    fixture.detectChanges();
    expect(doc.title).toBe('Other');
    expect(content('name="description"')).toBeNull();

    fixture.componentInstance.route.set(fullRoute);
    fixture.detectChanges();
    expect(content('name="description"')).toBe('desc');

    fixture.componentInstance.show.set(false);
    fixture.detectChanges();
    expect(content('name="description"')).toBeNull();
  });

});

@Component({
  imports: [ScPageMetaTagsComponent],
  template: `<sc-page-meta-tags [route]="route" />`,
})
class PageAComponent {
  readonly route = route({ baseMetadataDescription: { value: 'A' } });
}

@Component({
  imports: [ScPageMetaTagsComponent],
  template: `<sc-page-meta-tags [route]="route" />`,
})
class PageBComponent {
  readonly route = route({ baseMetadataDescription: { value: 'B' } });
}

@Component({ imports: [RouterOutlet], template: `<router-outlet />` })
class RootComponent {}

describe('ScPageMetaTagsComponent with router navigation', () => {
  afterEach(() => TestBed.inject(PageMetadataService).clear());

  it('keeps the next page tags when navigating between pages', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'a', component: PageAComponent },
          { path: 'b', component: PageBComponent },
        ]),
      ],
    });
    const doc = TestBed.inject(DOCUMENT);
    const description = () =>
      doc.head.querySelector('meta[name="description"]')?.getAttribute('content') ?? null;
    const fixture = TestBed.createComponent(RootComponent);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/a');
    await fixture.whenStable();
    expect(description()).toBe('A');

    await router.navigateByUrl('/b');
    await fixture.whenStable();
    expect(description()).toBe('B');
  });
});
