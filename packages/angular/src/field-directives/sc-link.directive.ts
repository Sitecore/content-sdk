import { Directive, ElementRef, inject, input, effect, Renderer2 } from '@angular/core';
import { isFieldValueEmpty } from '@sitecore-content-sdk/content/layout';

/**
 * Link field value shape.
 */
export interface LinkFieldValue {
  [attributeName: string]: unknown;
  href?: string;
  className?: string;
  class?: string;
  title?: string;
  target?: string;
  text?: string;
  anchor?: string;
  querystring?: string;
  linktype?: string;
}

/**
 * Link field shape (with optional value wrapper).
 */
export interface LinkField {
  value: LinkFieldValue;
  metadata?: { [key: string]: unknown };
}

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
  standalone: true,
})
export class ScLinkDirective {
  /** The Sitecore link field. */
  readonly scLink = input.required<LinkField | LinkFieldValue | undefined>();

  /** Whether to show link text alongside existing child content. */
  readonly showLinkTextWithChildrenPresent = input<boolean>(false);

  private readonly el = inject(ElementRef<HTMLAnchorElement>);
  private readonly renderer = inject(Renderer2);

  constructor() {
    effect(() => {
      const field = this.scLink();
      const element = this.el.nativeElement;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- link field shapes vary (wrapped / flat)
      if (!field || isFieldValueEmpty(field as any)) {
        this.renderer.removeAttribute(element, 'href');
        return;
      }

      const link = (field as LinkFieldValue).href
        ? (field as LinkFieldValue)
        : (field as LinkField).value;

      if (!link) {
        this.renderer.removeAttribute(element, 'href');
        return;
      }

      const anchor = link.linktype !== 'anchor' && link.anchor ? `#${link.anchor}` : '';
      const querystring = link.querystring ? `?${link.querystring}` : '';

      this.renderer.setAttribute(element, 'href', `${link.href || ''}${querystring}${anchor}`);

      if (link.class || link.className) {
        this.renderer.setAttribute(element, 'class', String(link.class || link.className));
      } else {
        this.renderer.removeAttribute(element, 'class');
      }
      if (link.title) {
        this.renderer.setAttribute(element, 'title', link.title);
      } else {
        this.renderer.removeAttribute(element, 'title');
      }
      if (link.target) {
        this.renderer.setAttribute(element, 'target', link.target);
        if (link.target === '_blank' && !element.getAttribute('rel')) {
          this.renderer.setAttribute(element, 'rel', 'noopener noreferrer');
        }
      } else {
        this.renderer.removeAttribute(element, 'target');
      }

      const hasChildren = element.childNodes.length > 0 && element.textContent?.trim();
      if (this.showLinkTextWithChildrenPresent() || !hasChildren) {
        const text = link.text || link.href || '';
        if (!hasChildren) {
          this.renderer.setProperty(element, 'textContent', text);
        }
      }
    });
  }
}
