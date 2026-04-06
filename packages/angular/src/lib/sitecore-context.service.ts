import { Injectable, signal, computed } from '@angular/core';
import type { Page } from '@sitecore-content-sdk/content/client';

/**
 * Provides request-scoped Sitecore context (current page, mode flags) to the Angular component tree.
 * Analogous to React's `SitecoreProvider` / `useSitecore()`.
 *
 * Set once per navigation via `setPage(page)` — typically from the route component
 * after the page loader resolves. All consumers (placeholders, field directives, forms)
 * inject this service to read the current page and editing state.
 *
 * @public
 */
@Injectable({ providedIn: 'root' })
export class SitecoreContextService {
  private readonly _page = signal<Page | null>(null);

  /** Current Sitecore page data (layout + mode). */
  readonly page = this._page.asReadonly();

  /** Whether the current page is in editing mode. */
  readonly isEditing = computed(() => this._page()?.mode?.isEditing ?? false);

  /**
   * Update the current page context. Call this when route data resolves.
   * @param page - The resolved Page from a loader, or null to clear.
   */
  setPage(page: Page | null): void {
    this._page.set(page);
  }
}
