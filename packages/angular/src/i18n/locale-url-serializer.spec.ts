/* eslint-disable jsdoc/require-jsdoc */
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  Component,
  EnvironmentProviders,
  input,
  PLATFORM_ID,
  Provider,
  REQUEST,
} from '@angular/core';
import { Router, RouterLink, UrlSerializer, UrlTree } from '@angular/router';
import type { LinkField } from '@sitecore-content-sdk/content/layout';
import { LocaleUrlSerializer } from './locale-url-serializer';
import { ScRouterLinkDirective } from '../components';
import type { AngularSitecoreConfig } from '../config/define-config';
import {
  provideMockSitecoreContext,
  setMockContextUrlLocaleFromPathname,
} from '../testing/mock-sitecore-context';

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
  template: `<a *scRouterLink="field()">ScRouterLink</a>`,
})
class TestScRouterLinkHost {
  readonly field = input<LinkField>({ value: { href: '/about', text: 'About' } });
}

const TEST_CONFIG = {
  defaultLanguage: 'en',
  angular: { locales: ['en', 'de', 'da'] },
} as AngularSitecoreConfig;

const TEST_LOCALES = TEST_CONFIG.angular!.locales!;

function configureTestBed(options?: {
  requestUrl?: string;
  platformId?: string;
  pathname?: string;
}) {
  TestBed.resetTestingModule();
  if (options?.pathname !== undefined) {
    window.history.replaceState(null, '', options.pathname);
  }

  const extraProviders: Array<Provider | EnvironmentProviders> = [
    { provide: UrlSerializer, useClass: LocaleUrlSerializer },
    { provide: PLATFORM_ID, useValue: options?.platformId ?? 'browser' },
  ];

  if (options?.requestUrl) {
    extraProviders.push({ provide: REQUEST, useValue: new Request(options.requestUrl) });
  }

  TestBed.configureTestingModule({
    imports: [TestRouterLinkHost, TestScRouterLinkHost],
    providers: [
      ...provideMockSitecoreContext({
        config: TEST_CONFIG,
        extraProviders: extraProviders,
      }),
    ],
  });

  if (options?.pathname !== undefined) {
    setMockContextUrlLocaleFromPathname(options.pathname, TEST_LOCALES);
  }
}

describe('LocaleUrlSerializer unit', () => {
  let serializer: LocaleUrlSerializer;
  let originalPathname: string;

  beforeEach(() => {
    originalPathname = window.location.pathname;
  });

  afterEach(() => {
    window.history.replaceState(null, '', originalPathname);
  });

  it('should prepend the current locale to the serialized URL', () => {
    configureTestBed({ pathname: '/en/current' });
    serializer = TestBed.inject(UrlSerializer) as LocaleUrlSerializer;
    const tree = serializer.parse('/about');
    expect(serializer.serialize(tree)).toBe('/en/about');
  });

  it('should leave the serialized URL unchanged when the current pathname has no locale prefix', () => {
    configureTestBed({ pathname: '/about' });
    serializer = TestBed.inject(UrlSerializer) as LocaleUrlSerializer;
    const tree = serializer.parse('/about');
    expect(serializer.serialize(tree)).toBe('/about');
  });

  it('should produce /<locale> when serializing the root tree', () => {
    configureTestBed({ pathname: '/de/current' });
    serializer = TestBed.inject(UrlSerializer) as LocaleUrlSerializer;
    const tree = serializer.parse('/');
    expect(serializer.serialize(tree)).toBe('/de');
  });

  it('should preserve query string when prepending locale', () => {
    configureTestBed({ pathname: '/en/current' });
    serializer = TestBed.inject(UrlSerializer) as LocaleUrlSerializer;
    const tree = serializer.parse('/about?foo=bar');
    expect(serializer.serialize(tree)).toBe('/en/about?foo=bar');
  });

  it('should preserve fragment when prepending locale', () => {
    configureTestBed({ pathname: '/en/current' });
    serializer = TestBed.inject(UrlSerializer) as LocaleUrlSerializer;
    const tree = serializer.parse('/about#section');
    expect(serializer.serialize(tree)).toBe('/en/about#section');
  });

  it('should not double-prefix when the serialized URL already has a locale segment', () => {
    configureTestBed({ pathname: '/en/current' });
    serializer = TestBed.inject(UrlSerializer) as LocaleUrlSerializer;
    const tree: UrlTree = serializer.parse('/en/about');
    expect(serializer.serialize(tree)).toBe('/en/about');
  });

  it('should not double-prefix a locale-only path', () => {
    configureTestBed({ pathname: '/da/current' });
    serializer = TestBed.inject(UrlSerializer) as LocaleUrlSerializer;
    const tree: UrlTree = serializer.parse('/da');
    expect(serializer.serialize(tree)).toBe('/da');
  });

  it('should derive locale from REQUEST on the server', () => {
    configureTestBed({
      platformId: 'server',
      requestUrl: 'https://example.com/de/about',
    });
    serializer = TestBed.inject(UrlSerializer) as LocaleUrlSerializer;
    const tree = serializer.parse('/products');
    expect(serializer.serialize(tree)).toBe('/de/products');
  });
});

describe('LocaleUrlSerializer integration with built-in [routerLink]', () => {
  let originalPathname: string;

  beforeEach(() => {
    originalPathname = window.location.pathname;
  });

  afterEach(() => {
    window.history.replaceState(null, '', originalPathname);
  });

  async function createFixture(pathname: string): Promise<ComponentFixture<TestRouterLinkHost>> {
    configureTestBed({ pathname });
    const fixture = TestBed.createComponent(TestRouterLinkHost);
    const router = TestBed.inject(Router);
    await router.navigateByUrl(pathname);
    fixture.detectChanges();
    return fixture;
  }

  it('should render href with locale prefix when pathname includes a locale', async () => {
    const fixture = await createFixture('/en/current');
    const a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(a.getAttribute('href')).toBe('/en/about');
  });

  it('should render href without prefix when pathname has no locale', async () => {
    const fixture = await createFixture('/about');
    const a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(a.getAttribute('href')).toBe('/about');
  });

  it('should reflect pathname locale changes on subsequent change-detection cycles', async () => {
    let fixture = await createFixture('/en/current');
    let a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(a.getAttribute('href')).toBe('/en/about');

    fixture = await createFixture('/de/current');
    a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(a.getAttribute('href')).toBe('/de/about');
  });
});

describe('LocaleUrlSerializer parity with [scRouterLink]', () => {
  let originalPathname: string;

  beforeEach(() => {
    originalPathname = window.location.pathname;
  });

  afterEach(() => {
    window.history.replaceState(null, '', originalPathname);
  });

  async function renderBoth(
    pathname: string
  ): Promise<{ routerHref: string | null; scHref: string | null }> {
    configureTestBed({ pathname });
    const router = TestBed.inject(Router);
    await router.navigateByUrl(pathname);

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

  it('should render identical locale-prefixed hrefs in both directives when pathname has a locale', async () => {
    const { routerHref, scHref } = await renderBoth('/en/current');
    expect(routerHref).toBe('/en/about');
    expect(scHref).toBe('/en/about');
  });

  it('should render identical unprefixed hrefs in both directives when pathname has no locale', async () => {
    const { routerHref, scHref } = await renderBoth('/about');
    expect(routerHref).toBe('/about');
    expect(scHref).toBe('/about');
  });
});
