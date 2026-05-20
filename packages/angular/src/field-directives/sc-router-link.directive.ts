import { Directive, HostListener, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import type { LinkField, LinkFieldValue } from '@sitecore-content-sdk/content/layout';
import { ScLinkDirective } from './sc-link.directive';

/**
 * Renders a Sitecore link field onto a host `<a>` and calls `Router.navigateByUrl` on click
 * for in-app paths only. Clicks are left to the browser when `href` is missing/empty, when
 * `target="_blank"`, or when `href` uses http(s), mailto, tel, sms, javascript, data, ftp,
 * or protocol-relative (`//`) URLs.
 *
 * Usage:
 * ```html
 * <a [scRouterLink]="fields.Link">Optional child content</a>
 * ```
 * @public
 */
@Directive({
  selector: 'a[scRouterLink]',
})
export class ScRouterLinkDirective extends ScLinkDirective {
  /**
   * Sitecore link field; host attribute `[scRouterLink]` maps to the base {@link ScLinkDirective.scLink} input.
   */
  override readonly scLink = input.required<LinkField | LinkFieldValue>({ alias: 'scRouterLink' });

  private readonly router = inject(Router);

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    const el = this.el.nativeElement;
    const hrefAttr = el.getAttribute('href')?.trim() ?? '';
    const targetAttr = el.getAttribute('target');
    if (this.shouldDeferNavigation(hrefAttr, targetAttr)) {
      return;
    }

    // Early return in editing mode
    // if (this.sitecoreContext.isEditing()) {
    //   return;
    // }

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
    return (
      lower.startsWith('http://') ||
      lower.startsWith('https://') ||
      lower.startsWith('mailto:') ||
      lower.startsWith('tel:') ||
      lower.startsWith('sms:') ||
      lower.startsWith('javascript:') ||
      lower.startsWith('data:') ||
      lower.startsWith('ftp:') ||
      lower.startsWith('//')
    );
  }
}
