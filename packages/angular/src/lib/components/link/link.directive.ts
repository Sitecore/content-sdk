import { Directive, ElementRef, effect, inject, input } from '@angular/core';
import { LinkField, LinkFieldValue } from '../../field-types';
import { buildLinkHref, getLinkFieldValue } from '../../utils/field-utils';

/**
 * Directive alternative to `LinkComponent`. Renders a Sitecore link field by
 * setting `href`, `title`, `target`, and `class` attributes directly on the
 * host `<a>` element.
 *
 * - Accepts both `LinkField` (with `.value`) and bare `LinkFieldValue` (with `.href`).
 * - Builds the final `href` by combining `href`, `querystring`, and `anchor`.
 * - Removes `href` from the host element when the field or `href` is empty.
 * - Inner content (text or child elements) is left unchanged; you control it in the template.
 * @example
 * <!-- link with static text -->
 * <a [scLink]="fields.ctaLink">Read more</a>
 *
 * <!-- link with dynamic text from another field -->
 * <a [scLink]="fields.ctaLink"><span [scText]="fields.ctaLabel"></span></a>
 * @public
 */
@Directive({
  selector: 'a[scLink]',
  standalone: true,
})
export class ScLinkDirective {
  /**
   * The link field data. Accepts `LinkField` or a bare `LinkFieldValue`.
   */
  readonly scLink = input<LinkField | LinkFieldValue | undefined>(undefined);

  private readonly el = inject<ElementRef<HTMLAnchorElement>>(ElementRef);

  constructor() {
    effect(() => {
      const v = getLinkFieldValue(this.scLink());
      const a = this.el.nativeElement;

      if (!v?.href) {
        a.removeAttribute('href');
        return;
      }

      a.href = buildLinkHref(v);
      setOrRemoveAttr(a, 'title', v.title);
      setOrRemoveAttr(a, 'target', v.target);
      setOrRemoveAttr(a, 'class', v.className ?? v.class);
    });
  }
}

function setOrRemoveAttr(el: HTMLElement, attr: string, value: string | undefined): void {
  if (value) {
    el.setAttribute(attr, value);
  } else {
    el.removeAttribute(attr);
  }
}
