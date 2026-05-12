import { Directive, ElementRef, inject, input, effect, Renderer2 } from '@angular/core';
import { isFieldValueEmpty, LinkFieldValue, LinkField } from '@sitecore-content-sdk/content/layout';
import { getClassFromField } from './utils';

/**
 * Renders a Sitecore link field onto a host `<a>` element.
 * Sets `href`, `title`, `target`, `class`, and text content from the field data.
 *
 * Usage:
 * ```html
 * <a [scLink]="fields.Link">Optional child content</a>
 * ```
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

      if (!field || isFieldValueEmpty(field)) {
        this.renderer.removeAttribute(element, 'href');
        return;
      }

      const link = (field as LinkFieldValue).href
        ? (field as LinkFieldValue)
        : (field as LinkField).value;

      const anchor = link.linktype !== 'anchor' && link.anchor ? `#${link.anchor}` : '';
      const querystring = link.querystring ? `?${link.querystring}` : '';

      this.renderer.setAttribute(element, 'href', `${link.href || ''}${querystring}${anchor}`);

      const classValue = getClassFromField(link);
      if (classValue) {
        this.renderer.addClass(element, classValue);
      } else {
        this.renderer.removeAttribute(element, 'class');
        if (this.originalClass) {
          this.renderer.addClass(element, this.originalClass);
        }
      }

      if (link.title) {
        this.renderer.setAttribute(element, 'title', link.title);
      } else {
        this.renderer.removeAttribute(element, 'title');
        if (this.originalTitle) {
          this.renderer.setAttribute(element, 'title', this.originalTitle);
        }
      }
      if (link.target) {
        this.renderer.setAttribute(element, 'target', link.target);
        if (link.target === '_blank' && !element.getAttribute('rel')) {
          this.renderer.setAttribute(element, 'rel', 'noopener noreferrer');
        }
      } else {
        this.renderer.removeAttribute(element, 'target');
        if (this.originalTarget) {
          this.renderer.setAttribute(element, 'target', this.originalTarget);
        }
      }

      const hasChildren = element.childNodes.length > 0 && element.textContent?.trim();
      if (!hasChildren) {
        const text = link.text || link.href || '';
        this.renderer.setProperty(element, 'textContent', text);
      } else if (this.preferTextFromField() && link.text) {
        this.renderer.setProperty(element, 'textContent', link.text || '');
      }
    });
  }
}
