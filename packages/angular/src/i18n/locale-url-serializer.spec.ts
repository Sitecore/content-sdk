/* eslint-disable jsdoc/require-jsdoc */
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { Component, input } from '@angular/core';
import { provideRouter, Router, RouterLink, UrlSerializer, UrlTree } from '@angular/router';
import type { LinkField } from '@sitecore-content-sdk/content/layout';
import { LocaleUrlSerializer } from './locale-url-serializer';
import { SitecoreContextService } from '../lib/sitecore-context.service';
import { SITECORE_CONFIG_TOKEN } from '../lib/tokens';
import { ScRouterLinkDirective } from '../field-directives/sc-router-link.directive';
import type { AngularSitecoreConfig } from '../config/define-config';

@Component({
  selector: 'test-router-link',
  imports: [RouterLink],
  template: `<a [routerLink]="commands()">RouterLink</a>`,
})
class TestRouterLinkHost {
  readonly commands = input<unknown[]>(['/about']);
}

@Component({
  selector: 'test-sc-router-link',
  imports: [ScRouterLinkDirective],
  template: `<a [scRouterLink]="field()">ScRouterLink</a>`,
})
class TestScRouterLinkHost {
  readonly field = input<LinkField>({ value: { href: '/about', text: 'About' } });
}

@Component({ selector: 'blank-cmp', template: '' })
class BlankCmp {}

function configureTestBed() {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    imports: [TestRouterLinkHost, TestScRouterLinkHost, BlankCmp],
    providers: [
      provideRouter([{ path: '**', component: BlankCmp }]),
      { provide: UrlSerializer, useClass: LocaleUrlSerializer },
      {
        provide: SITECORE_CONFIG_TOKEN,
        useValue: { defaultLanguage: 'en', angular: { locales: ['en', 'de'] } } as AngularSitecoreConfig,
      },
    ],
  });
}

describe('LocaleUrlSerializer unit', () => {
  let serializer: LocaleUrlSerializer;
  let context: SitecoreContextService;

  beforeEach(() => {
    configureTestBed();
    serializer = TestBed.inject(UrlSerializer) as LocaleUrlSerializer;
    context = TestBed.inject(SitecoreContextService);
  });

  it('should prepend the current locale to the serialized URL', () => {
    context.setLocale('en');
    const tree = serializer.parse('/about');
    expect(serializer.serialize(tree)).toBe('/en/about');
  });

  it('should leave the serialized URL unchanged when urlLocale is null', () => {
    context.setLocale(null);
    const tree = serializer.parse('/about');
    expect(serializer.serialize(tree)).toBe('/about');
  });

  it('should produce /<locale> when serializing the root tree', () => {
    context.setLocale('de');
    const tree = serializer.parse('/');
    expect(serializer.serialize(tree)).toBe('/de');
  });

  it('should preserve query string when prepending locale', () => {
    context.setLocale('en');
    const tree = serializer.parse('/about?foo=bar');
    expect(serializer.serialize(tree)).toBe('/en/about?foo=bar');
  });

  it('should preserve fragment when prepending locale', () => {
    context.setLocale('en');
    const tree = serializer.parse('/about#section');
    expect(serializer.serialize(tree)).toBe('/en/about#section');
  });

  it('should not double-prefix when the serialized URL already has a locale segment', () => {
    context.setLocale('en');
    const tree: UrlTree = serializer.parse('/en/about');
    expect(serializer.serialize(tree)).toBe('/en/about');
  });

  it('should not double-prefix a locale-only path', () => {
    context.setLocale('da');
    const tree: UrlTree = serializer.parse('/da');
    expect(serializer.serialize(tree)).toBe('/da');
  });
});

describe('LocaleUrlSerializer integration with built-in [routerLink]', () => {
  async function createFixture(): Promise<{
    fixture: ComponentFixture<TestRouterLinkHost>;
    context: SitecoreContextService;
    router: Router;
  }> {
    configureTestBed();
    const fixture = TestBed.createComponent(TestRouterLinkHost);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/');
    fixture.detectChanges();
    return { fixture, context: TestBed.inject(SitecoreContextService), router };
  }

  it('should render href with locale prefix when urlLocale is en', async () => {
    const { fixture, context } = await createFixture();
    context.setLocale('en');
    fixture.detectChanges();
    const a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(a.getAttribute('href')).toBe('/en/about');
  });

  it('should render href without prefix when urlLocale is null', async () => {
    const { fixture, context } = await createFixture();
    context.setLocale(null);
    fixture.detectChanges();
    const a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(a.getAttribute('href')).toBe('/about');
  });

  it('should reflect locale changes on subsequent change-detection cycles', async () => {
    const { fixture, context } = await createFixture();
    context.setLocale('en');
    fixture.detectChanges();
    let a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(a.getAttribute('href')).toBe('/en/about');

    context.setLocale('de');
    fixture.detectChanges();
    a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(a.getAttribute('href')).toBe('/de/about');
  });
});

describe('LocaleUrlSerializer parity with [scRouterLink]', () => {
  async function renderBoth(
    locale: string | null
  ): Promise<{ routerHref: string | null; scHref: string | null }> {
    configureTestBed();
    const context = TestBed.inject(SitecoreContextService);
    context.setLocale(locale);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/');

    const routerFixture = TestBed.createComponent(TestRouterLinkHost);
    routerFixture.detectChanges();
    const scFixture = TestBed.createComponent(TestScRouterLinkHost);
    scFixture.detectChanges();

    return {
      routerHref:
        (routerFixture.nativeElement.querySelector('a') as HTMLAnchorElement | null)?.getAttribute(
          'href'
        ) ?? null,
      scHref:
        (scFixture.nativeElement.querySelector('a') as HTMLAnchorElement | null)?.getAttribute(
          'href'
        ) ?? null,
    };
  }

  it('should render identical locale-prefixed hrefs in both directives when locale is en', async () => {
    const { routerHref, scHref } = await renderBoth('en');
    expect(routerHref).toBe('/en/about');
    expect(scHref).toBe('/en/about');
  });

  it('should render identical unprefixed hrefs in both directives when locale is null', async () => {
    const { routerHref, scHref } = await renderBoth(null);
    expect(routerHref).toBe('/about');
    expect(scHref).toBe('/about');
  });
});
