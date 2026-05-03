import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
  effect,
  Renderer2,
} from '@angular/core';
import { Router } from '@angular/router';
import { LinkFieldValue, LinkField } from '@sitecore-content-sdk/content/layout';
import {
  applyLinkFieldToAnchor,
  clearLinkHrefOnAnchor,
  resolveLinkFromField,
} from './link-field-binding';

/**
 * Renders a Sitecore link field onto a host `<a>` and calls `Router.navigateByUrl` on click,
 * following the Sitecore JSS Angular `RouterLinkDirective` pattern (sitecore-jss-angular).
 *
 * Usage:
 * ```html
 * <a [scRouterLink]="fields.Link">Optional child content</a>
 * ```
 *
 * @public
 */
@Directive({
  selector: 'a[scRouterLink]',
})
export class ScRouterLinkDirective {
  /** The Sitecore link field. */
  readonly scRouterLink = input.required<LinkField | LinkFieldValue>();

  /** Whether to show link text alongside existing child content. */
  readonly preferTextFromField = input<boolean>(false);

  private readonly el = inject(ElementRef<HTMLAnchorElement>);
  private readonly renderer = inject(Renderer2);
  private readonly router = inject(Router);
  private readonly originalClass: string | undefined;
  private readonly originalTitle: string | undefined;
  private readonly originalTarget: string | undefined;

  constructor() {
    this.originalClass = (this.el.nativeElement as HTMLAnchorElement).className;
    this.originalTitle = (this.el.nativeElement as HTMLAnchorElement).title;
    this.originalTarget = (this.el.nativeElement as HTMLAnchorElement).target;
    effect(() => {
      const field = this.scRouterLink();
      const element = this.el.nativeElement;

      const link = resolveLinkFromField(field);
      if (!link) {
        clearLinkHrefOnAnchor(this.renderer, element);
        return;
      }

      applyLinkFieldToAnchor(this.renderer, element, link, {
        preferTextFromField: this.preferTextFromField(),
        originalClass: this.originalClass,
        originalTitle: this.originalTitle,
        originalTarget: this.originalTarget,
      });
    });
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    const hrefAttr = this.el.nativeElement.getAttribute('href');
    if (hrefAttr == null || hrefAttr === '') {
      return;
    }

    // Early return in editing mode
    // if (this.sitecoreContext.isEditing()) {
    //   return;
    // }

    void this.router.navigateByUrl(hrefAttr);
    // Match JSS: allow default handling when the URL includes a fragment (hash navigation).
    if (!hrefAttr.includes('#')) {
      event.preventDefault();
    }
  }
}
