import { Injectable, signal, computed, type Signal, type WritableSignal } from '@angular/core';
import type { Page } from '@sitecore-content-sdk/content/client';
import { DictionaryPhrases } from '@sitecore-content-sdk/content/i18n';

/**
 * Provides request-scoped Sitecore context (current page, mode flags) to the Angular component tree.
 * Analogous to React's `SitecoreProvider` / `useSitecore()`.
 *
 * Set once per navigation via `setPage(page)` — typically from the route component
 * after the page loader resolves. All consumers (placeholders, field directives, forms)
 * inject this service to read the current page and editing state.
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

  private readonly _page: WritableSignal<Page | null>;
  private readonly _dictionary: WritableSignal<DictionaryPhrases | null>;

  constructor() {
    const pageSignal = signal<Page | null>(null);
    this._page = pageSignal;
    this.page = pageSignal.asReadonly();
    this.isEditing = computed(() => pageSignal()?.mode?.isEditing ?? false);
    const dictionarySignal = signal<DictionaryPhrases | null>(null);
    this._dictionary = dictionarySignal;
    this.dictionary = dictionarySignal.asReadonly();
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
}
