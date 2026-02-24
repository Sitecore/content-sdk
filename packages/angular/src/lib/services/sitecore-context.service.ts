import { computed, Injectable, signal } from '@angular/core';
import { Page } from '@sitecore-content-sdk/content/client';

/**
 * Service that holds and exposes the current Sitecore page context as Angular signals.
 *
 * This service is provided at the root level (`providedIn: 'root'`), guaranteeing a single
 * shared instance across the entire Angular application — including any lazy-loaded modules
 * or standalone routes. The `SitecoreProviderComponent` writes to this service; all other
 * components and directives read from it via injection.
 * @example
 * // Read current page in a component
 * export class MyComponent {
 *   private ctx = inject(SitecoreContextService);
 *   readonly isEditing = this.ctx.isEditing;
 * }
 * @public
 */
@Injectable({ providedIn: 'root' })
export class SitecoreContextService {
  readonly _page = signal<Page | null>(null);

  /**
   * Read-only signal for the current Sitecore page.
   * Emits `null` until the first page is set by `SitecoreProviderComponent`.
   */
  public page = this._page;

  /**
   * Derived signal: `true` when the page is currently open in Sitecore Pages editor.
   */
  readonly isEditing = computed(() => this._page()?.mode?.isEditing ?? false);

  /**
   * Derived signal: `true` when the page is in preview mode.
   */
  readonly isPreview = computed(() => this._page()?.mode?.isPreview ?? false);

  /**
   * Sets the current page. Called internally by `SitecoreProviderComponent`.
   * @param {Page} page The new page value.
   */
  setPage(page: Page): void {
    this._page.set(page);
  }
}
