import { Directive, ElementRef, computed, effect, inject, input } from '@angular/core';
import { ImageField, ImageFieldValue } from '../../field-types';
import { getImageFieldValue } from '../../utils/field-utils';

/**
 * Directive alternative to `ImageComponent`. Renders a Sitecore image field
 * by setting `src`, `alt`, `width`, and `height` attributes directly on the
 * host `<img>` element.
 *
 * - Accepts both `ImageField` (with `.value`) and bare `ImageFieldValue` (with `.src`).
 * - Removes `src` from the host element when the field or `src` is empty.
 * - Additional attributes (e.g. `class`, `loading`) can be passed via `scImageAttrs`.
 * @example
 * <img [scImage]="fields.heroImage" />
 * <img [scImage]="fields.heroImage" [scImageAttrs]="{ class: 'hero', loading: 'lazy' }" />
 * @public
 */
@Directive({
  selector: 'img[scImage]',
  standalone: true,
})
export class ScImageDirective {
  /**
   * The image field data. Accepts `ImageField` (with `.value`) or a bare `ImageFieldValue`.
   */
  readonly scImage = input<ImageField | ImageFieldValue | undefined>(undefined);

  /**
   * Additional HTML attributes to apply to the host `<img>` element.
   * Supports `class`, `loading`, and `style`.
   */
  readonly scImageAttrs = input<Record<string, unknown>>({});

  private readonly resolvedValue = computed(() => getImageFieldValue(this.scImage()));
  private readonly el = inject<ElementRef<HTMLImageElement>>(ElementRef);

  constructor() {
    effect(() => {
      const v = this.resolvedValue();
      const attrs = this.scImageAttrs();
      const img = this.el.nativeElement;

      if (!v?.src) {
        img.removeAttribute('src');
        return;
      }

      img.src = v.src;
      img.alt = v.alt ?? (attrs['alt'] as string | undefined) ?? '';

      setOrRemoveAttr(img, 'width', v.width ?? (attrs['width'] as string | undefined));
      setOrRemoveAttr(img, 'height', v.height ?? (attrs['height'] as string | undefined));
      setOrRemoveAttr(img, 'class', attrs['class'] as string | undefined);
      setOrRemoveAttr(img, 'loading', attrs['loading'] as string | undefined);
      setOrRemoveAttr(img, 'style', attrs['style'] as string | undefined);
    });
  }
}

function setOrRemoveAttr(el: HTMLElement, attr: string, value: string | number | undefined): void {
  if (value !== undefined && value !== null) {
    el.setAttribute(attr, String(value));
  } else {
    el.removeAttribute(attr);
  }
}
