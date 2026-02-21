import { computed, inject, Injectable, signal } from '@angular/core';
import { Page } from '@sitecore-content-sdk/content/client';
import { SitecoreConfig } from '@sitecore-content-sdk/content/config';
import { SITECORE_CONFIG_TOKEN } from '../tokens';

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
  readonly _api = signal<SitecoreConfig['api'] | undefined>(
    inject(SITECORE_CONFIG_TOKEN, { optional: true }) ?? undefined
  );

  /**
   * Read-only signal for the current Sitecore page.
   * Emits `null` until the first page is set by `SitecoreProviderComponent`.
   */
  readonly page = this._page.asReadonly();

  /**
   * Read-only signal for the Sitecore API configuration.
   */
  readonly api = this._api.asReadonly();

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

  /**
   * Sets the Sitecore API configuration. Overrides any value supplied via `SITECORE_CONFIG_TOKEN`.
   * @param {SitecoreConfig['api']} api The API configuration.
   */
  setApi(api: SitecoreConfig['api']): void {
    this._api.set(api);
  }
}
