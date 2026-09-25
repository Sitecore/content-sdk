/* eslint-disable jsdoc/require-jsdoc */
import { Component, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { Page } from '@sitecore-content-sdk/content/client';
import { JsonLdSchemaService } from './json-ld-schema.service';
import { ScJsonLdSchemaComponent } from './sc-json-ld-schema.component';

const organization = { '@context': 'https://schema.org', '@type': 'Organization', name: 'Acme' };
const breadcrumbs = { '@context': 'https://schema.org', '@type': 'BreadcrumbList' };

const makePage = (schemas?: unknown[], isNormal = true): Page =>
  ({
    layout: { sitecore: { context: { schemas }, route: null } },
    mode: { isNormal, isEditing: !isNormal, isPreview: false, isDesignLibrary: false },
  }) as unknown as Page;

describe('JsonLdSchemaService', () => {
  let service: JsonLdSchemaService;
  let doc: Document;

  const scripts = () => doc.head.querySelectorAll('script[type="application/ld+json"]');
  const parsed = () => JSON.parse(scripts()[0].textContent ?? '');

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JsonLdSchemaService);
    doc = TestBed.inject(DOCUMENT);
  });

  afterEach(() => service.clear());

  it('renders all schemas into a single script in head', () => {
    service.apply(makePage([organization, breadcrumbs]));

    expect(scripts().length).toBe(1);
    expect(scripts()[0].hasAttribute('data-sc-json-ld')).toBe(true);
    expect(parsed()).toEqual([organization, breadcrumbs]);
  });

  it('filters out invalid schema entries', () => {
    service.apply(makePage([organization, null, 'string', [breadcrumbs]]));

    expect(parsed()).toEqual([organization]);
  });

  it('escapes the JSON so a schema value cannot break out of the script', () => {
    service.apply(makePage([{ ...organization, name: '</script><script>alert(1)</script>' }]));

    const text = scripts()[0].textContent ?? '';
    expect(text).not.toContain('</script>');
    expect(parsed()[0].name).toBe('</script><script>alert(1)</script>');
  });

  it('renders nothing when there are no valid schemas', () => {
    service.apply(makePage(undefined));
    expect(scripts().length).toBe(0);

    service.apply(makePage([null]));
    expect(scripts().length).toBe(0);

    service.apply(null);
    expect(scripts().length).toBe(0);
  });

  it('renders nothing when the page is not in normal mode', () => {
    service.apply(makePage([organization], false));

    expect(scripts().length).toBe(0);
  });

  it('reuses an existing managed script instead of duplicating it', () => {
    const existing = doc.createElement('script');
    existing.setAttribute('data-sc-json-ld', '');
    existing.setAttribute('type', 'application/ld+json');
    existing.textContent = '[]';
    doc.head.appendChild(existing);

    service.apply(makePage([organization]));

    expect(scripts().length).toBe(1);
    expect(scripts()[0]).toBe(existing);
    expect(parsed()).toEqual([organization]);
  });

  it('replaces and removes the script on subsequent applies', () => {
    service.apply(makePage([organization]));
    service.apply(makePage([breadcrumbs]));
    expect(scripts().length).toBe(1);
    expect(parsed()).toEqual([breadcrumbs]);

    service.apply(makePage([]));
    expect(scripts().length).toBe(0);
  });

  it('removes the script on clear', () => {
    service.apply(makePage([organization]));
    service.clear();

    expect(scripts().length).toBe(0);
  });
});

@Component({
  imports: [ScJsonLdSchemaComponent],
  template: `@if (show()) {
    <sc-json-ld-schema [page]="page()" />
  }`,
})
class HostComponent {
  readonly show = signal(true);
  readonly page = signal<Page | null>(makePage([organization]));
}

describe('ScJsonLdSchemaComponent', () => {
  let doc: Document;

  const scripts = () => doc.head.querySelectorAll('script[data-sc-json-ld]');

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    doc = TestBed.inject(DOCUMENT);
  });

  afterEach(() => TestBed.inject(JsonLdSchemaService).clear());

  it('applies the script, re-applies on page change and cleans up on destroy', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    expect(scripts().length).toBe(1);

    fixture.componentInstance.page.set(makePage([organization], false));
    fixture.detectChanges();
    expect(scripts().length).toBe(0);

    fixture.componentInstance.page.set(makePage([breadcrumbs]));
    fixture.detectChanges();
    expect(JSON.parse(scripts()[0].textContent ?? '')).toEqual([breadcrumbs]);

    fixture.componentInstance.show.set(false);
    fixture.detectChanges();
    expect(scripts().length).toBe(0);
  });
});
