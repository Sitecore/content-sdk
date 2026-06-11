import { Directive, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import type { LinkField, LinkFieldValue } from '@sitecore-content-sdk/content/layout';
import { ScLinkDirective } from './sc-link.directive';
import { EXTERNAL_HREF_PREFIXES } from './utils';

/**
 * Structural directive that renders a Sitecore link field onto a consumer-supplied `<a>` and
 * routes in-app navigation through `Router.navigateByUrl`. Clicks are left to the browser
 * when `href` is missing/empty, when `target="_blank"`, or when the href uses an external
 * scheme (http(s), mailto, tel, sms, javascript, data, ftp, protocol-relative `//`).
 *
 * Editing chrome + empty-field placeholder behavior is inherited from {@link ScLinkDirective}.
 *
 * Usage:
 * ```html
 * <a *scRouterLink="fields.Link">Optional child content</a>
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

  private readonly router = inject(Router);
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
    }
  }

  private disposeListeners(): void {
    for (const u of this.unlisteners) u();
    this.unlisteners.length = 0;
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

    if (this.sitecoreContext.isEditing()) {
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
