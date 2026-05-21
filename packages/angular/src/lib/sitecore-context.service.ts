import { Injectable, signal, computed, inject, type Signal, type WritableSignal } from '@angular/core';
import type { Page } from '@sitecore-content-sdk/content/client';
import { DictionaryPhrases } from '@sitecore-content-sdk/content/i18n';
import { SITECORE_CONFIG_TOKEN } from './tokens';

/**
 * Provides request-scoped Sitecore context (current page, mode flags, current locale) to the
 * Angular component tree. Analogous to React's `SitecoreProvider` / `useSitecore()`.
 *
 * Set once per navigation via `setPage(page)` / `setLocale(locale)` — typically from the route
 * component after the page loader resolves, and from the locale bootstrap on navigation events.
 * All consumers (placeholders, field directives, forms, the URL serializer) inject this service
 * to read the current page, editing state, and locale.
 * @public
 */
@Injectable({ providedIn: 'root' })
export class SitecoreContextService {
  /** Current Sitecore page data (layout + mode). */
  readonly page: Signal<Page | null>;

  /** Current Sitecore dictionary data. */
  readonly dictionary: Signal<DictionaryPhrases | null>;

  /** Whether the current page is in editing mode. */
  readonly isEditing: Signal<boolean>;

  /**
   * Locale extracted from the current URL; `null` when the URL has no configured-locale prefix.
   * Use this for link rendering decisions (prefix only when the page itself has a prefix).
   */
  readonly urlLocale: Signal<string | null>;

  /**
   * Effective locale for data fetching: `urlLocale ?? defaultLanguage`. Always concrete.
   */
  readonly effectiveLocale: Signal<string>;

  private readonly _page: WritableSignal<Page | null>;
  private readonly _dictionary: WritableSignal<DictionaryPhrases | null>;
  private readonly _urlLocale: WritableSignal<string | null>;

  constructor() {
    const pageSignal = signal<Page | null>(null);
    this._page = pageSignal;
    this.page = pageSignal.asReadonly();
    this.isEditing = computed(() => pageSignal()?.mode?.isEditing ?? false);
    const dictionarySignal = signal<DictionaryPhrases | null>(null);
    this._dictionary = dictionarySignal;
    this.dictionary = dictionarySignal.asReadonly();

    const defaultLanguage =
      inject(SITECORE_CONFIG_TOKEN, { optional: true })?.defaultLanguage ?? '';
    const urlLocaleSignal = signal<string | null>(null);
    this._urlLocale = urlLocaleSignal;
    this.urlLocale = urlLocaleSignal.asReadonly();
    this.effectiveLocale = computed(() => urlLocaleSignal() ?? defaultLanguage);
  }

  /**
   * Update the current page context. Call this when route data resolves.
   * @param {Page | null} page - The resolved Page from a loader, or null to clear.
   * @returns {void}
   */
  setPage(page: Page | null): void {
    this._page.set(page);
  }

  setDictionary(dictionary: DictionaryPhrases | null): void {
    this._dictionary.set(dictionary);
  }

  /**
   * Update the current URL locale. Called by the locale bootstrap on initial load and on
   * subsequent `NavigationEnd` events.
   * @param {string | null} locale - Configured locale found in the URL, or `null` when absent.
   * @returns {void}
   */
  setLocale(locale: string | null): void {
    this._urlLocale.set(locale);
  }
}
