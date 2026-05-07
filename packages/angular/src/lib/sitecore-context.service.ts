import { Injectable, signal, computed, type Signal, type WritableSignal } from '@angular/core';
import type { Page } from '@sitecore-content-sdk/content/client';

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

  /** Whether the current page is in editing mode. */
  readonly isEditing: Signal<boolean>;

  private readonly _page: WritableSignal<Page | null>;

  constructor() {
    const pageSignal = signal<Page | null>(null);
    this._page = pageSignal;
    this.page = pageSignal.asReadonly();
    this.isEditing = computed(() => pageSignal()?.mode?.isEditing ?? false);
  }

  /**
   * Update the current page context. Call this when route data resolves.
   * @param {Page | null} page - The resolved Page from a loader, or null to clear.
   * @returns {void}
   */
  setPage(page: Page | null): void {
    this._page.set(page);
  }
}
