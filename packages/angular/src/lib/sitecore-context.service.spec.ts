/* eslint-disable jsdoc/require-jsdoc */
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Component, PLATFORM_ID, REQUEST } from '@angular/core';
import { provideRouter, Router, RouterOutlet, type ResolveFn } from '@angular/router';
import type { Page } from '@sitecore-content-sdk/content/client';
import { LayoutServicePageState } from '@sitecore-content-sdk/content/layout';
import { DictionaryPhrases } from '@sitecore-content-sdk/content/i18n';
import { SitecoreContextService } from './sitecore-context.service';
import { SITECORE_CONFIG_TOKEN } from './tokens';
import type { AngularSitecoreConfig } from '../config/define-config';
import { scLocaleMatcher } from '../i18n/locale-utils';

@Component({ standalone: true, template: '', selector: 'blank-cmp' })
class BlankCmp {}

@Component({
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
class RouterHostCmp {}

function makePage(overrides?: Partial<Page>): Page {
  return {
    locale: 'en',
    layout: { sitecore: { context: {}, route: null } },
    mode: {
      name: LayoutServicePageState.Normal,
      isNormal: true,
      isPreview: false,
      isEditing: false,
      isDesignLibrary: false,
      designLibrary: { isVariantGeneration: false },
    },
    ...overrides,
  } as Page;
}

const TEST_LOCALES = ['en', 'de'] as const;

function makeConfig(locales: string[], defaultLanguage: string = 'en'): AngularSitecoreConfig {
  return {
    defaultLanguage,
    angular: { locales },
  } as AngularSitecoreConfig;
}

/** Route tree shaped like scaffolded apps: optional top-level routes, then locale matcher + catchall. */
function appLikeRoutes(options?: {
  page?: Page | null;
  dictionary?: DictionaryPhrases | null;
  extraTopLevelRoutes?: Parameters<typeof provideRouter>[0];
}): Parameters<typeof provideRouter>[0] {
  const catchAllResolve: Record<string, ResolveFn<unknown>> = {};
  if (options?.page !== undefined) {
    catchAllResolve.page = () => Promise.resolve(options.page);
  }
  if (options?.dictionary !== undefined) {
    catchAllResolve.dictionary = () => Promise.resolve(options.dictionary);
  }

  return [
    ...(options?.extraTopLevelRoutes ?? []),
    {
      matcher: scLocaleMatcher([...TEST_LOCALES]),
      children: [
        {
          path: '**',
          component: BlankCmp,
          ...(Object.keys(catchAllResolve).length > 0 ? { resolve: catchAllResolve } : {}),
        },
      ],
    },
  ];
}

/**
 * Inject {@link SitecoreContextService} before navigation so `NavigationEnd` updates signals.
 */
async function navigateWithContext(
  url: string,
  hostFixture: ComponentFixture<RouterHostCmp>
): Promise<SitecoreContextService> {
  hostFixture.detectChanges();
  const service = TestBed.inject(SitecoreContextService);
  await TestBed.inject(Router).navigateByUrl(url);
  await hostFixture.whenStable();
  hostFixture.detectChanges();
  return service;
}

describe('SitecoreContextService', () => {
  const mockPage = makePage();
  const mockDictionary = { Welcome: 'Willkommen', Goodbye: 'Auf Wiedersehen' };
  let hostFixture: ComponentFixture<RouterHostCmp>;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [RouterHostCmp, BlankCmp],
      providers: [
        provideRouter(
          appLikeRoutes({ page: mockPage, dictionary: mockDictionary })
        ),
        { provide: SITECORE_CONFIG_TOKEN, useValue: makeConfig([...TEST_LOCALES]) },
        SitecoreContextService,
      ],
    });
    hostFixture = TestBed.createComponent(RouterHostCmp);
  });

  it('should start with null page before navigation', () => {
    expect(TestBed.inject(SitecoreContextService).page()).toBeNull();
  });

  it('should start with null dictionary before navigation', () => {
    expect(TestBed.inject(SitecoreContextService).dictionary()).toBeNull();
  });

  it('should start with isEditing false before navigation', () => {
    expect(TestBed.inject(SitecoreContextService).isEditing()).toBe(false);
  });

  it('should expose page from route resolve data after navigation', async () => {
    const service = await navigateWithContext('/de/about', hostFixture);
    expect(service.page()).toBe(mockPage);
    expect(service.isEditing()).toBe(false);
  });

  it('should expose dictionary from route resolve data after navigation', async () => {
    const service = await navigateWithContext('/de/about', hostFixture);
    expect(service.dictionary()).toBe(mockDictionary);
  });

  it('should reflect editing mode from resolved page', async () => {
    const editingPage = makePage();
    editingPage.mode.isEditing = true;

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [RouterHostCmp, BlankCmp],
      providers: [
        provideRouter(
          appLikeRoutes({ page: editingPage })
        ),
        { provide: SITECORE_CONFIG_TOKEN, useValue: makeConfig([...TEST_LOCALES]) },
        SitecoreContextService,
      ],
    });
    hostFixture = TestBed.createComponent(RouterHostCmp);

    const service = await navigateWithContext('/de/about', hostFixture);
    expect(service.isEditing()).toBe(true);
  });

  it('should clear page when navigating to a route without page resolve data', async () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [RouterHostCmp, BlankCmp],
      providers: [
        provideRouter(
          appLikeRoutes({
            page: mockPage,
            extraTopLevelRoutes: [{ path: 'empty', component: BlankCmp }],
          })
        ),
        { provide: SITECORE_CONFIG_TOKEN, useValue: makeConfig([...TEST_LOCALES]) },
        SitecoreContextService,
      ],
    });
    hostFixture = TestBed.createComponent(RouterHostCmp);

    await navigateWithContext('/de/about', hostFixture);
    const service = await navigateWithContext('/empty', hostFixture);
    expect(service.page()).toBeNull();
    expect(service.isEditing()).toBe(false);
  });

  it('should clear dictionary when navigating to a route without dictionary resolve data', async () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [RouterHostCmp, BlankCmp],
      providers: [
        provideRouter(
          appLikeRoutes({
            dictionary: mockDictionary,
            extraTopLevelRoutes: [{ path: 'empty', component: BlankCmp }],
          })
        ),
        { provide: SITECORE_CONFIG_TOKEN, useValue: makeConfig([...TEST_LOCALES]) },
        SitecoreContextService,
      ],
    });
    hostFixture = TestBed.createComponent(RouterHostCmp);

    await navigateWithContext('/de/about', hostFixture);
    const service = await navigateWithContext('/empty', hostFixture);
    expect(service.dictionary()).toBeNull();
  });

  it('should start with null urlLocale when locales are not configured', () => {
    expect(TestBed.inject(SitecoreContextService).urlLocale()).toBeNull();
  });

  it('should fall back to en for effectiveLocale when no config is provided', () => {
    expect(TestBed.inject(SitecoreContextService).effectiveLocale()).toBe('en');
  });
});

describe('SitecoreContextService urlLocale', () => {
  describe('server (REQUEST)', () => {
    beforeEach(() => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [RouterHostCmp, BlankCmp],
        providers: [
          provideRouter([{ path: '**', component: BlankCmp }]),
          { provide: SITECORE_CONFIG_TOKEN, useValue: makeConfig(['en', 'de']) },
          { provide: PLATFORM_ID, useValue: 'server' },
          {
            provide: REQUEST,
            useValue: new Request('https://example.com/de/about'),
          },
          SitecoreContextService,
        ],
      });
    });

    it('should derive urlLocale from the REQUEST URL pathname on bootstrap', () => {
      expect(TestBed.inject(SitecoreContextService).urlLocale()).toBe('de');
    });

    it('should return null urlLocale when REQUEST URL has no configured locale prefix', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [RouterHostCmp, BlankCmp],
        providers: [
          provideRouter([{ path: '**', component: BlankCmp }]),
          { provide: SITECORE_CONFIG_TOKEN, useValue: makeConfig(['en', 'de'], 'da') },
          { provide: PLATFORM_ID, useValue: 'server' },
          {
            provide: REQUEST,
            useValue: new Request('https://example.com/about'),
          },
          SitecoreContextService,
        ],
      });

      const service = TestBed.inject(SitecoreContextService);
      expect(service.urlLocale()).toBeNull();
      expect(service.effectiveLocale()).toBe('da');
    });
  });

  describe('browser (window.location)', () => {
    let originalPathname: string;
    let hostFixture: ComponentFixture<RouterHostCmp>;

    beforeEach(() => {
      originalPathname = window.location.pathname;
      window.history.replaceState(null, '', '/de/products');
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [RouterHostCmp, BlankCmp],
        providers: [
          provideRouter([
            {
              matcher: scLocaleMatcher(['en', 'de']),
              children: [{ path: '**', component: BlankCmp }],
            },
          ]),
          { provide: SITECORE_CONFIG_TOKEN, useValue: makeConfig(['en', 'de']) },
          { provide: PLATFORM_ID, useValue: 'browser' },
          SitecoreContextService,
        ],
      });
      hostFixture = TestBed.createComponent(RouterHostCmp);
    });

    afterEach(() => {
      window.history.replaceState(null, '', originalPathname);
    });

    it('should derive urlLocale from window.location.pathname on bootstrap', () => {
      expect(TestBed.inject(SitecoreContextService).urlLocale()).toBe('de');
    });

    it('should update urlLocale on NavigationEnd', async () => {
      const service = await navigateWithContext('/en/about', hostFixture);
      expect(service.urlLocale()).toBe('en');
    });

    it('should clear urlLocale when navigating to an unprefixed URL', async () => {
      const service = await navigateWithContext('/about', hostFixture);
      expect(service.urlLocale()).toBeNull();
    });
  });

  describe('when locales are not configured', () => {
    beforeEach(() => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [RouterHostCmp, BlankCmp],
        providers: [
          provideRouter([{ path: '**', component: BlankCmp }]),
          { provide: SITECORE_CONFIG_TOKEN, useValue: makeConfig([]) },
          { provide: PLATFORM_ID, useValue: 'browser' },
          SitecoreContextService,
        ],
      });
    });

    it('should keep urlLocale null', () => {
      expect(TestBed.inject(SitecoreContextService).urlLocale()).toBeNull();
    });
  });
});

describe('SitecoreContextService effectiveLocale', () => {
  let hostFixture: ComponentFixture<RouterHostCmp>;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [RouterHostCmp, BlankCmp],
      providers: [
        provideRouter(
          appLikeRoutes({ page: makePage({ locale: 'fr' }) })
        ),
        {
          provide: SITECORE_CONFIG_TOKEN,
          useValue: makeConfig([...TEST_LOCALES], 'en'),
        },
        { provide: PLATFORM_ID, useValue: 'browser' },
        SitecoreContextService,
      ],
    });
    hostFixture = TestBed.createComponent(RouterHostCmp);
  });

  it('should fall back to defaultLanguage from config when urlLocale is null', () => {
    expect(TestBed.inject(SitecoreContextService).effectiveLocale()).toBe('en');
  });

  it('should prefer urlLocale over defaultLanguage after navigation', async () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [RouterHostCmp, BlankCmp],
      providers: [
        provideRouter(appLikeRoutes()),
        {
          provide: SITECORE_CONFIG_TOKEN,
          useValue: makeConfig([...TEST_LOCALES], 'en'),
        },
        { provide: PLATFORM_ID, useValue: 'browser' },
        SitecoreContextService,
      ],
    });
    hostFixture = TestBed.createComponent(RouterHostCmp);

    window.history.replaceState(null, '', '/');
    const service = await navigateWithContext('/de/about', hostFixture);
    expect(service.effectiveLocale()).toBe('de');
  });

  it('should prefer page locale over urlLocale and defaultLanguage', async () => {
    window.history.replaceState(null, '', '/');
    const service = await navigateWithContext('/de/about', hostFixture);
    expect(service.effectiveLocale()).toBe('fr');
  });

  it('should fall back to defaultLanguage after navigating to an unprefixed URL', async () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [RouterHostCmp, BlankCmp],
      providers: [
        provideRouter([{ path: '**', component: BlankCmp }]),
        {
          provide: SITECORE_CONFIG_TOKEN,
          useValue: makeConfig(['en', 'de'], 'en'),
        },
        { provide: PLATFORM_ID, useValue: 'browser' },
        SitecoreContextService,
      ],
    });
    hostFixture = TestBed.createComponent(RouterHostCmp);

    window.history.replaceState(null, '', '/de/about');
    await navigateWithContext('/de/about', hostFixture);
    const service = await navigateWithContext('/about', hostFixture);
    expect(service.urlLocale()).toBeNull();
    expect(service.effectiveLocale()).toBe('en');
  });
});
