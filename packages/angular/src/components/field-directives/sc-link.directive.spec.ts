/* eslint-disable jsdoc/require-jsdoc */
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { Component, input } from '@angular/core';
import { ScLinkDirective } from './sc-link.directive';
import type { LinkField } from '@sitecore-content-sdk/content/layout';
import { getClassFromField } from './utils';
import type { AngularSitecoreConfig } from '../../config/define-config';
import {
  provideMockSitecoreContext,
  setMockContextPage,
  setMockContextUrlLocale,
} from '../../testing/mock-sitecore-context';

afterEach(() => {
  vi.restoreAllMocks();
});

function sortedClassTokens(el: HTMLElement): string[] {
  return (el.className || '').split(/\s+/).filter(Boolean).sort();
}

@Component({
  selector: 'test-link',
  imports: [ScLinkDirective],
  template: `<a *scLink="field()"></a>`,
})
class TestHostComponent {
  readonly field = input<LinkField | undefined>(undefined);
}

@Component({
  selector: 'test-link-host-class',
  imports: [ScLinkDirective],
  template: `<a class="host-base" *scLink="field()"></a>`,
})
class TestHostWithHostClassComponent {
  readonly field = input<LinkField | undefined>(undefined);
}

@Component({
  selector: 'test-link-host-title',
  imports: [ScLinkDirective],
  template: `<a title="Host title" *scLink="field()"></a>`,
})
class TestHostWithHostTitleComponent {
  readonly field = input<LinkField | undefined>(undefined);
}

@Component({
  selector: 'test-link-host-target',
  imports: [ScLinkDirective],
  template: `<a target="_self" *scLink="field()"></a>`,
})
class TestHostWithHostTargetComponent {
  readonly field = input<LinkField | undefined>(undefined);
}

describe('ScLinkDirective', () => {
  function createFixture(): ComponentFixture<TestHostComponent> {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [TestHostComponent] });
    return TestBed.createComponent(TestHostComponent);
  }

  function createFixtureWithHostClass(): ComponentFixture<TestHostWithHostClassComponent> {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [TestHostWithHostClassComponent] });
    return TestBed.createComponent(TestHostWithHostClassComponent);
  }

  function createFixtureWithHostTitle(): ComponentFixture<TestHostWithHostTitleComponent> {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [TestHostWithHostTitleComponent] });
    return TestBed.createComponent(TestHostWithHostTitleComponent);
  }

  function createFixtureWithHostTarget(): ComponentFixture<TestHostWithHostTargetComponent> {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [TestHostWithHostTargetComponent] });
    return TestBed.createComponent(TestHostWithHostTargetComponent);
  }

  it('should set href and text from link field', () => {
    const fixture = createFixture();
    fixture.componentRef.setInput('field', {
      value: { href: '/about', text: 'About' },
    });
    fixture.detectChanges();

    const a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(a.getAttribute('href')).toContain('/about');
    expect(a.textContent).toBe('About');
  });

  it('should add noopener for _blank target', () => {
    const fixture = createFixture();
    fixture.componentRef.setInput('field', {
      value: { href: 'https://x.com', target: '_blank', text: 'X' },
    });
    fixture.detectChanges();

    const a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(a.target).toBe('_blank');
    expect(a.rel).toBe('noopener noreferrer');
  });

  it('should use combined class and className from field when both present', () => {
    expect(
      getClassFromField({
        href: '/a',
        className: 'from-className',
        class: 'from-class',
      })
    ).toBe('from-className from-class');
  });

  it('should use className only when class is absent', () => {
    const fixture = createFixture();
    fixture.componentRef.setInput('field', {
      value: { href: '/a', className: 'only-className' },
    });
    fixture.detectChanges();

    const a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(sortedClassTokens(a)).toEqual(['only-className']);
  });

  it('should use class only when className is absent', () => {
    const fixture = createFixture();
    fixture.componentRef.setInput('field', {
      value: { href: '/a', class: 'only-class' },
    });
    fixture.detectChanges();

    const a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(sortedClassTokens(a)).toEqual(['only-class']);
  });

  it('should preserve original host class when applying class from field', () => {
    const fixture = createFixtureWithHostClass();
    fixture.componentRef.setInput('field', {
      value: { href: '/a', className: 'from-field' },
    });
    fixture.detectChanges();

    const a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(sortedClassTokens(a)).toEqual(['from-field', 'host-base'].sort());
  });

  it('should apply class from field then restore original host class when field class is cleared', () => {
    const fixture = createFixtureWithHostClass();
    fixture.componentRef.setInput('field', {
      value: { href: '/a', className: 'temporary' },
    });
    fixture.detectChanges();

    let a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(sortedClassTokens(a)).toEqual(['host-base', 'temporary'].sort());

    fixture.componentRef.setInput('field', {
      value: { href: '/a' },
    });
    fixture.detectChanges();

    a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(sortedClassTokens(a)).toEqual(['host-base']);
  });

  it('should apply title from field then restore original host title when field title is cleared', () => {
    const fixture = createFixtureWithHostTitle();
    fixture.componentRef.setInput('field', {
      value: { href: '/a', title: 'From field' },
    });
    fixture.detectChanges();

    let a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(a.getAttribute('title')).toBe('From field');

    fixture.componentRef.setInput('field', {
      value: { href: '/a' },
    });
    fixture.detectChanges();

    a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(a.getAttribute('title')).toBe('Host title');
  });

  it('should apply target from field then restore original host target when field target is cleared', () => {
    const fixture = createFixtureWithHostTarget();
    fixture.componentRef.setInput('field', {
      value: { href: '/a', target: '_blank' },
    });
    fixture.detectChanges();

    let a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(a.target).toBe('_blank');
    expect(a.rel).toBe('noopener noreferrer');

    fixture.componentRef.setInput('field', {
      value: { href: '/a' },
    });
    fixture.detectChanges();

    a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(a.target).toBe('_self');
  });
});

describe('ScLinkDirective editing mode', () => {
  function createEditingFixture(): ComponentFixture<TestHostComponent> {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: provideMockSitecoreContext(),
    });
    setMockContextPage({ mode: { isEditing: true } } as any);
    return TestBed.createComponent(TestHostComponent);
  }

  it('should wrap rendered anchor in chrome markers when metadata is present', () => {
    const fixture = createEditingFixture();
    fixture.componentRef.setInput('field', {
      value: { href: '/about', text: 'About' },
      metadata: { contextItem: { id: 'x' }, fieldId: 'link' },
    });
    fixture.detectChanges();

    const markers = fixture.nativeElement.querySelectorAll('code.scpm');
    expect(markers.length).toBe(2);
    expect(fixture.nativeElement.querySelector('a')?.getAttribute('href')).toContain('/about');
  });

  it('should render the default empty placeholder when field is empty + metadata present', () => {
    const fixture = createEditingFixture();
    fixture.componentRef.setInput('field', {
      metadata: { contextItem: { id: 'x' }, fieldId: 'link' },
    } as unknown as LinkField);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('code.scpm').length).toBe(2);
    expect(fixture.nativeElement.textContent).toContain('[No text in field]');
    expect(fixture.nativeElement.querySelector('a')).toBeNull();
  });

  it('should keep chrome markers and render the text without an href for a javascript: link', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const fixture = createEditingFixture();
    fixture.componentRef.setInput('field', {
      value: { href: 'javascript:alert(1)', text: 'Click', title: 'My link' },
      metadata: { contextItem: { id: 'x' }, fieldId: 'link' },
    });
    fixture.detectChanges();

    const a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(fixture.nativeElement.querySelectorAll('code.scpm').length).toBe(2);
    expect(a.hasAttribute('href')).toBe(false);
    expect(a.textContent).toBe('Click');
    expect(a.getAttribute('title')).toBe('My link');
    expect(errorSpy).toHaveBeenCalledOnce();
    errorSpy.mockRestore();
  });
});

describe('ScLinkDirective javascript: URLs', () => {
  function createFixture(): ComponentFixture<TestHostComponent> {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [TestHostComponent] });
    return TestBed.createComponent(TestHostComponent);
  }

  it('should render the text without an href, log once, and not log again on change detection', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const fixture = createFixture();
    fixture.componentRef.setInput('field', { value: { href: 'javascript:alert(1)', text: 'Click' } });
    fixture.detectChanges();
    fixture.detectChanges();

    const a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(a.hasAttribute('href')).toBe(false);
    expect(a.textContent).toBe('Click');
    expect(errorSpy).toHaveBeenCalledOnce();
    expect(errorSpy.mock.calls[0][0]).toContain('javascript:alert(1)');
    errorSpy.mockRestore();
  });

  it('should drop a previous safe href when the field changes to a javascript: URL', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const fixture = createFixture();
    fixture.componentRef.setInput('field', { value: { href: '/about', text: 'About' } });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('a')?.getAttribute('href')).toBe('/about');

    fixture.componentRef.setInput('field', { value: { href: 'javascript:void(0)', text: 'About' } });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('a')?.hasAttribute('href')).toBe(false);
    errorSpy.mockRestore();
  });

  it('should not log again for a new field object with the same URL, but log a different URL', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const fixture = createFixture();
    fixture.componentRef.setInput('field', { value: { href: 'javascript:alert(1)', text: 'A' } });
    fixture.detectChanges();
    fixture.componentRef.setInput('field', { value: { href: 'javascript:alert(1)', text: 'A' } });
    fixture.detectChanges();
    expect(errorSpy).toHaveBeenCalledOnce();

    fixture.componentRef.setInput('field', { value: { href: 'javascript:alert(2)', text: 'A' } });
    fixture.detectChanges();
    expect(errorSpy).toHaveBeenCalledTimes(2);
    expect(errorSpy.mock.calls[1][0]).toContain('javascript:alert(2)');
  });
});

describe('ScLinkDirective locale-aware href', () => {
  function createFixtureWithLocales(
    locales: string[],
    urlLocale: string | null
  ): ComponentFixture<TestHostComponent> {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: provideMockSitecoreContext({
        config: {
          defaultLanguage: 'en',
          angular: { locales },
        } as AngularSitecoreConfig,
      }),
    });
    setMockContextUrlLocale(urlLocale);
    return TestBed.createComponent(TestHostComponent);
  }

  function hrefFor(field: LinkField, locales: string[], urlLocale: string | null): string | null {
    const fixture = createFixtureWithLocales(locales, urlLocale);
    fixture.componentRef.setInput('field', field);
    fixture.detectChanges();
    const a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    return a.getAttribute('href');
  }

  it('should prefix an internal href with the current locale (en)', () => {
    expect(hrefFor({ value: { href: '/about' } }, ['en', 'de'], 'en')).toBe('/en/about');
  });

  it('should not prefix an internal href when current locale is null', () => {
    expect(hrefFor({ value: { href: '/about' } }, ['en', 'de'], null)).toBe('/about');
  });

  it('should not double-prefix when the field href already contains the current locale', () => {
    expect(hrefFor({ value: { href: '/en/about' } }, ['en', 'de'], 'en')).toBe('/en/about');
  });

  it('should preserve an authored cross-locale href even when current locale differs', () => {
    expect(hrefFor({ value: { href: '/de/about' } }, ['en', 'de'], 'en')).toBe('/de/about');
  });

  it('should prefix an internal href with a non-default locale (de)', () => {
    expect(hrefFor({ value: { href: '/about' } }, ['en', 'de'], 'de')).toBe('/de/about');
  });

  it('should leave an external https href untouched even when it contains a locale-like segment', () => {
    expect(hrefFor({ value: { href: 'https://example.com/en/foo' } }, ['en', 'de'], 'en')).toBe(
      'https://example.com/en/foo'
    );
  });

  it('should leave a mailto href untouched', () => {
    expect(hrefFor({ value: { href: 'mailto:user@example.com' } }, ['en', 'de'], 'en')).toBe(
      'mailto:user@example.com'
    );
  });

  it('should leave a tel href untouched', () => {
    expect(hrefFor({ value: { href: 'tel:+15551234567' } }, ['en', 'de'], 'en')).toBe(
      'tel:+15551234567'
    );
  });

  it('should not locale-prefix a javascript: href, and should omit it', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(hrefFor({ value: { href: 'java\nscript:alert(1)' } }, ['en', 'de'], 'en')).toBe(null);
    expect(hrefFor({ value: { href: 'JAVASCRIPT:alert(1)' } }, ['en', 'de'], 'en')).toBe(null);
    expect(errorSpy).toHaveBeenCalledTimes(2);
    errorSpy.mockRestore();
  });

  it('should leave a protocol-relative href untouched', () => {
    expect(hrefFor({ value: { href: '//cdn.example.com/asset.js' } }, ['en', 'de'], 'en')).toBe(
      '//cdn.example.com/asset.js'
    );
  });

  it('should be idempotent across change-detection cycles', () => {
    const fixture = createFixtureWithLocales(['en', 'de'], 'en');
    fixture.componentRef.setInput('field', { value: { href: '/about' } });
    fixture.detectChanges();
    let a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(a.getAttribute('href')).toBe('/en/about');

    fixture.detectChanges();
    fixture.detectChanges();

    a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(a.getAttribute('href')).toBe('/en/about');
  });
});
