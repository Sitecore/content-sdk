import { Directive, ElementRef, inject, input, effect, Renderer2 } from '@angular/core';
import { LinkFieldValue, LinkField } from '@sitecore-content-sdk/content/layout';
import { applyLinkFieldToAnchor, resolveLinkFromField } from './link-field-utils';

/**
 * Renders a Sitecore link field onto a host `<a>` element.
 * Sets `href`, `title`, `target`, `class`, and text content from the field data.
 *
 * Usage:
 * ```html
 * <a [scLink]="fields.Link">Optional child content</a>
 * ```
 *
 * @public
 */
@Directive({
  selector: 'a[scLink]',
})
export class ScLinkDirective {
  /** The Sitecore link field. */
  readonly scLink = input.required<LinkField | LinkFieldValue>();

  /** Whether to show link text alongside existing child content. */
  readonly preferTextFromField = input<boolean>(false);

  private readonly el = inject(ElementRef<HTMLAnchorElement>);
  private readonly renderer = inject(Renderer2);
  private readonly originalClass: string | undefined;
  private readonly originalTitle: string | undefined;
  private readonly originalTarget: string | undefined;

  constructor() {
    this.originalClass = (this.el.nativeElement as HTMLAnchorElement).className;
    this.originalTitle = (this.el.nativeElement as HTMLAnchorElement).title;
    this.originalTarget = (this.el.nativeElement as HTMLAnchorElement).target;
    effect(() => {
      const field = this.scLink();
      const element = this.el.nativeElement;

      const link = resolveLinkFromField(field);
      if (!link) {
        this.renderer.removeAttribute(element, 'href');
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
}
