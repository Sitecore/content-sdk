/* eslint-disable jsdoc/require-jsdoc */
import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Component, PLATFORM_ID, REQUEST } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { SitecoreContextService } from '../lib/sitecore-context.service';
import { SITECORE_CONFIG_TOKEN } from '../lib/tokens';
import type { AngularSitecoreConfig } from '../config/define-config';
import { provideLocaleBootstrap } from './locale-bootstrap';
import { createLocaleMatcher } from './locale-utils';

@Component({ standalone: true, template: '', selector: 'blank-cmp' })
class BlankCmp {}

function makeConfig(locales: string[]): AngularSitecoreConfig {
  return {
    defaultLanguage: 'en',
    angular: { locales },
  } as AngularSitecoreConfig;
}

describe('provideLocaleBootstrap', () => {
  describe('server (REQUEST)', () => {
    beforeEach(() => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          provideRouter([]),
          { provide: SITECORE_CONFIG_TOKEN, useValue: makeConfig(['en', 'de']) },
          { provide: PLATFORM_ID, useValue: 'server' },
          {
            provide: REQUEST,
            useValue: new Request('https://example.com/de/about'),
          },
          provideLocaleBootstrap(),
        ],
      });
    });

    it('should set urlLocale from the REQUEST URL pathname on bootstrap', async () => {
      const context = TestBed.inject(SitecoreContextService);
      await TestBed.runInInjectionContext(async () => {});
      expect(context.urlLocale()).toBe('de');
    });

    it('should leave urlLocale null when REQUEST URL has no configured locale prefix', async () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          provideRouter([]),
          { provide: SITECORE_CONFIG_TOKEN, useValue: makeConfig(['en', 'de']) },
          { provide: PLATFORM_ID, useValue: 'server' },
          {
            provide: REQUEST,
            useValue: new Request('https://example.com/about'),
          },
          provideLocaleBootstrap(),
        ],
      });
      const context = TestBed.inject(SitecoreContextService);
      await TestBed.runInInjectionContext(async () => {});
      expect(context.urlLocale()).toBeNull();
    });
  });

  describe('browser (window.location)', () => {
    let originalPathname: string;

    beforeEach(() => {
      originalPathname = window.location.pathname;
      window.history.replaceState(null, '', '/de/products');
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [BlankCmp],
        providers: [
          provideRouter([
            {
              matcher: createLocaleMatcher(['en', 'de']),
              children: [{ path: '**', component: BlankCmp }],
            },
          ]),
          { provide: SITECORE_CONFIG_TOKEN, useValue: makeConfig(['en', 'de']) },
          { provide: PLATFORM_ID, useValue: 'browser' },
          provideLocaleBootstrap(),
        ],
      });
    });

    afterEach(() => {
      window.history.replaceState(null, '', originalPathname);
    });

    it('should set urlLocale from window.location.pathname on bootstrap', () => {
      const context = TestBed.inject(SitecoreContextService);
      expect(context.urlLocale()).toBe('de');
    });

    it('should update urlLocale to the navigated locale on NavigationEnd', async () => {
      const context = TestBed.inject(SitecoreContextService);
      const router = TestBed.inject(Router);

      await router.navigateByUrl('/en/about');
      expect(context.urlLocale()).toBe('en');
    });

    it('should clear urlLocale when navigating to an unprefixed URL', async () => {
      const context = TestBed.inject(SitecoreContextService);
      const router = TestBed.inject(Router);

      await router.navigateByUrl('/about');
      expect(context.urlLocale()).toBeNull();
    });
  });

  describe('no-op when locales are not configured', () => {
    beforeEach(() => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          provideRouter([]),
          { provide: SITECORE_CONFIG_TOKEN, useValue: makeConfig([]) },
          { provide: PLATFORM_ID, useValue: 'browser' },
          provideLocaleBootstrap(),
        ],
      });
    });

    it('should leave urlLocale null', () => {
      const setSpy = vi.spyOn(SitecoreContextService.prototype, 'setLocale');
      const context = TestBed.inject(SitecoreContextService);
      expect(context.urlLocale()).toBeNull();
      expect(setSpy).not.toHaveBeenCalled();
      setSpy.mockRestore();
    });
  });
});
