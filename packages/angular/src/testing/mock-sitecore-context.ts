/* eslint-disable */
import {
  Component,
  EnvironmentProviders,
  Injectable,
  Provider,
  inject,
  signal,
  computed,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import type { Page } from '@sitecore-content-sdk/content/client';
import { DictionaryPhrases } from '@sitecore-content-sdk/content/i18n';
import { SitecoreContextService } from '../lib/sitecore-context.service';
import { SITECORE_CONFIG_TOKEN } from '../lib/tokens';
import type { AngularSitecoreConfig } from '../config/define-config';
import { splitLocaleFromPath } from '../i18n/locale-utils';

@Component({ standalone: true, template: '', selector: 'mock-router-blank-cmp' })
class MockRouterBlankCmp {}

@Injectable()
class MockSitecoreContextService {
  private readonly config = inject(SITECORE_CONFIG_TOKEN, { optional: true });
  private readonly _page = signal<Page | null>(null);
  private readonly _dictionary = signal<DictionaryPhrases | null>(null);
  private readonly _urlLocale = signal<string | null>(null);

  readonly page = this._page.asReadonly();
  readonly dictionary = this._dictionary.asReadonly();
  readonly urlLocale = this._urlLocale.asReadonly();
  readonly isEditing = computed(() => this._page()?.mode?.isEditing ?? false);
  readonly effectiveLocale = computed(
    () => this._page()?.locale ?? this._urlLocale() ?? this.config?.defaultLanguage ?? 'en'
  );

  setPage(page: Page | null): void {
    this._page.set(page);
  }

  setDictionary(dictionary: DictionaryPhrases | null): void {
    this._dictionary.set(dictionary);
  }

  setUrlLocale(locale: string | null): void {
    this._urlLocale.set(locale);
  }
}

function mockContext(): MockSitecoreContextService {
  return TestBed.inject(MockSitecoreContextService);
}

/**
 * Router stub + mock {@link SitecoreContextService} for unit tests.
 * Spread into `TestBed.configureTestingModule({ providers: [...] })`.
 */
export function provideMockSitecoreContext(options?: {
  config?: AngularSitecoreConfig;
  extraProviders?: Array<Provider | EnvironmentProviders>;
}): Array<Provider | EnvironmentProviders> {
  const providers: Array<Provider | EnvironmentProviders> = [
    provideRouter([{ path: '**', component: MockRouterBlankCmp }]),
    MockSitecoreContextService,
    { provide: SitecoreContextService, useExisting: MockSitecoreContextService },
    ...(options?.extraProviders ?? []),
  ];

  if (options?.config) {
    providers.push({ provide: SITECORE_CONFIG_TOKEN, useValue: options.config });
  }

  return providers;
}

export function setMockContextPage(page: Page | null): void {
  mockContext().setPage(page);
}

export function setMockContextDictionary(dictionary: DictionaryPhrases | null): void {
  mockContext().setDictionary(dictionary);
}

export function setMockContextUrlLocale(locale: string | null): void {
  mockContext().setUrlLocale(locale);
}

/** Align mock urlLocale with a pathname using configured locales from `config`. */
export function setMockContextUrlLocaleFromPathname(pathname: string, locales: string[]): void {
  setMockContextUrlLocale(splitLocaleFromPath(pathname, locales).locale);
}
