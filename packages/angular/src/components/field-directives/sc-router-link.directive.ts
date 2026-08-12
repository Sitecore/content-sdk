import { Directive, inject, input, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import type { LinkField, LinkFieldValue } from '@sitecore-content-sdk/content/layout';
import { ScLinkDirective } from './sc-link.directive';
import { EXTERNAL_HREF_PREFIXES } from './utils';
import { attachHoverPrefetch } from './link-hover-prefetch';
import { ClientPreLoaderDataService } from '../../loaders/pre-loader-data.service';
import { SITECORE_CONFIG_TOKEN } from '../../lib/tokens';
import type { LinkPrefetchMode } from '../../config/define-config';

/** Ultimate fallback when no `SITECORE_CONFIG_TOKEN` is provided. Mirrors `DEFAULT_LINK_PREFETCH` in `config/define-config.ts`. */
const FALLBACK_PREFETCH_MODE: LinkPrefetchMode = 'eager';
const FALLBACK_PREFETCH_DELAY_MS = 100;

/**
 * Structural directive that renders a Sitecore link field onto a consumer-supplied `<a>` and
 * routes in-app navigation through `Router.navigateByUrl`. Clicks are left to the browser
 * when `href` is missing/empty, when `target="_blank"`, or when the href uses an external
 * scheme (http(s), mailto, tel, sms, javascript, data, ftp, protocol-relative `//`).
 *
 * Internal links (browser only) prefetch the loaders that apply to them via
 * {@link ClientPreLoaderDataService.prefetchForUrl}, per `sitecore.config`'s
 * `angular.linkPrefetch.mode` (default `'eager'`):
 * - `'eager'` (default) — prefetch as soon as the link renders.
 * - `'hover'` — prefetch once the pointer dwells on the link for `angular.linkPrefetch.delayMs`.
 * - `'off'` — never prefetch.
 *
 * Override per link with `scRouterLinkPrefetch`.
 *
 * Editing chrome + empty-field placeholder behavior is inherited from {@link ScLinkDirective}.
 *
 * Usage:
 * ```html
 * <a *scRouterLink="fields.Link">Optional child content</a>
 * <!-- scRouterLinkPrefetch is another input of *this same* structural directive, so
 *      overrides must use the microsyntax key:value form (not a separate
 *      [scRouterLinkPrefetch] binding, which would bind to the inner <a> — where this
 *      directive isn't present after structural desugaring). -->
 * <a *scRouterLink="fields.Link; prefetch: 'eager'">Prefetch eagerly on render</a>
 * <a *scRouterLink="fields.Link; prefetch: 'off'">Never prefetch this link</a>
 * ```
 * @public
 */
@Directive({
  selector: '[scRouterLink]',
})
export class ScRouterLinkDirective extends ScLinkDirective {
  /** Sitecore link field; aliases the base {@link ScLinkDirective.field} input to `scRouterLink`. */
  override readonly field = input.required<LinkField | LinkFieldValue | undefined>({
    alias: 'scRouterLink',
  });
  /** Per-link override for loader prefetch. See {@link LinkPrefetchMode}. Falls back to `angular.linkPrefetch.mode` when unset. */
  readonly prefetch = input<LinkPrefetchMode | undefined>(undefined, {
    alias: 'scRouterLinkPrefetch',
  });

  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly preLoaderData = inject(ClientPreLoaderDataService);
  private readonly linkPrefetchConfig = inject(SITECORE_CONFIG_TOKEN, { optional: true })?.angular
    ?.linkPrefetch;
  private readonly unlisteners: (() => void)[] = [];

  protected override applyValue(): void {
    this.disposeListeners();
    super.applyValue();
    if (!this.viewRef) return;
    for (const node of this.viewRef.rootNodes) {
      if (!(node instanceof HTMLAnchorElement)) continue;
      const unlisten = this.renderer.listen(node, 'click', (event: MouseEvent) =>
        this.onClick(event, node)
      );
      this.unlisteners.push(unlisten);
      this.applyPrefetch(node);
    }
  }

  private disposeListeners(): void {
    for (const u of this.unlisteners) u();
    this.unlisteners.length = 0;
  }

  /**
   * Applies the resolved prefetch mode to `anchor` when running in the browser, the page isn't
   * in editing/preview mode, and the href isn't one the browser handles directly (external,
   * `target="_blank"`, empty). `'hover'` attaches a debounced listener; `'eager'` prefetches
   * immediately; `'off'` does nothing.
   * @param {HTMLAnchorElement} anchor - Anchor element to observe/prefetch.
   */
  private applyPrefetch(anchor: HTMLAnchorElement): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.sitecoreContext.isEditing() || this.sitecoreContext.isPreview()) return;

    const hrefAttr = anchor.getAttribute('href')?.trim() ?? '';
    const targetAttr = anchor.getAttribute('target');
    if (this.shouldDeferNavigation(hrefAttr, targetAttr)) return;

    const mode = this.prefetch() ?? this.linkPrefetchConfig?.mode ?? FALLBACK_PREFETCH_MODE;
    if (mode === 'off') return;

    if (mode === 'hover') {
      const delayMs = this.linkPrefetchConfig?.delayMs ?? FALLBACK_PREFETCH_DELAY_MS;
      const unlisten = attachHoverPrefetch(this.renderer, anchor, {
        delayMs,
        onPrefetch: (href) => this.preLoaderData.prefetchForUrl(href, { force: true }),
      });
      this.unlisteners.push(unlisten);
      return;
    }

    // mode === 'eager'
    this.preLoaderData.prefetchForUrl(hrefAttr);
  }

  /**
   * Click handler attached to the freshly rendered anchor. Defers to the browser for external
   * URLs and `target="_blank"`; routes everything else via Angular Router. Calls
   * `event.preventDefault()` only when the in-app navigation has no hash fragment.
   * @param {MouseEvent} event - Native click event.
   * @param {HTMLAnchorElement} anchor - Anchor element receiving the click.
   */
  private onClick(event: MouseEvent, anchor: HTMLAnchorElement): void {
    const hrefAttr = anchor.getAttribute('href')?.trim() ?? '';
    const targetAttr = anchor.getAttribute('target');
    if (this.shouldDeferNavigation(hrefAttr, targetAttr)) {
      return;
    }

    if (this.sitecoreContext.isEditing() || this.sitecoreContext.isPreview()) {
      return;
    }

    void this.router.navigateByUrl(hrefAttr);
    if (!hrefAttr.includes('#')) {
      event.preventDefault();
    }
  }

  /**
   * Returns true when the browser should handle navigation (no in-app Router navigation).
   * @param {string | null} hrefAttr - Raw `href` attribute from the anchor.
   * @param {string | null} targetAttr - Raw `target` attribute from the anchor.
   * @returns {boolean} Whether to skip `Router.navigateByUrl`.
   */
  private shouldDeferNavigation(hrefAttr: string | null, targetAttr: string | null): boolean {
    if (!hrefAttr || hrefAttr === '') {
      return true;
    }
    if (targetAttr === '_blank') {
      return true;
    }
    const lower = hrefAttr.toLowerCase();
    return EXTERNAL_HREF_PREFIXES.some((prefix) => lower.startsWith(prefix));
  }
}
