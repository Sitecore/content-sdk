import { Injectable, signal, computed, Signal } from '@angular/core';
import { Page, RouteData } from '@sitecore-content-sdk/angular';
/**
 * Service that provides access to the current Sitecore page context.
 * Use this service to set the current page data and access it throughout the application.
 * @public
 */
@Injectable({
  providedIn: 'root',
})
export class SitecoreContextService {
  /**
   * Read-only signal for the current page.
   * Subscribe to this to react to page changes.
   */
  readonly page: Signal<Page | null>;

  /**
   * Computed signal indicating whether editing mode is active.
   */
  readonly isEditing: Signal<boolean>;

  /**
   * Computed signal indicating whether preview mode is active.
   */
  readonly isPreview: Signal<boolean>;

  /**
   * Computed signal indicating whether the page is in normal mode.
   */
  readonly isNormal: Signal<boolean>;

  /**
   * Computed signal for the current route data.
   */
  readonly route: Signal<RouteData | null>;

  /**
   * Computed signal for the current site name.
   */
  readonly siteName: Signal<string | null>;

  /**
   * Computed signal for the current locale.
   */
  readonly locale: Signal<string | null>;

  /**
   * Internal signal holding the current page
   */
  private readonly _page = signal<Page | null>(null);

  constructor() {
    this.page = this._page.asReadonly();
    this.isEditing = computed(() => this._page()?.mode?.isEditing ?? false);
    this.isPreview = computed(() => this._page()?.mode?.isPreview ?? false);
    this.isNormal = computed(() => this._page()?.mode?.isNormal ?? true);
    this.route = computed(() => this._page()?.layout?.sitecore?.route ?? null);
    this.siteName = computed(() => this._page()?.siteName ?? null);
    this.locale = computed(() => this._page()?.locale ?? null);
  }

  /**
   * Set the current page context.
   * Call this when the page data is loaded (e.g., in a route resolver or page component).
   * @param page - The page data to set as current context
   */
  setPage(page: Page | null): void {
    this._page.set(page);
  }

  /**
   * Get the current page synchronously.
   * @returns The current page or null if not set
   */
  getPage(): Page | null {
    return this._page();
  }
}
