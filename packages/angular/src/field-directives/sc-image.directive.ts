import { Directive, ElementRef, inject, input, effect, Renderer2 } from '@angular/core';
import { isFieldValueEmpty } from '@sitecore-content-sdk/content/layout';
import { mediaApi } from '@sitecore-content-sdk/content/media';

/**
 * Image field value shape.
 */
export interface ImageFieldValue {
  [attributeName: string]: unknown;
  src?: string;
}

/**
 * Image field shape (with optional value wrapper).
 */
export interface ImageField {
  value?: ImageFieldValue;
  metadata?: { [key: string]: unknown };
}

/**
 * Renders a Sitecore image field onto a host `<img>` element.
 * Sets `src`, `alt`, and other attributes from the field data.
 *
 * Usage:
 * ```html
 * <img [scImage]="fields.Image" />
 * ```
 *
 * @public
 */
@Directive({
  selector: 'img[scImage]',
  standalone: true,
})
export class ScImageDirective {
  /** The Sitecore image field. */
  readonly scImage = input.required<ImageField | ImageFieldValue | undefined>();

  /** Optional image params for media URL transformation. */
  readonly imageParams = input<{ [paramName: string]: string | number }>();

  /** Optional media URL prefix regexp. */
  readonly mediaUrlPrefix = input<RegExp>();

  private readonly el = inject(ElementRef<HTMLImageElement>);
  private readonly renderer = inject(Renderer2);

  constructor() {
    effect(() => {
      const field = this.scImage();
      const element = this.el.nativeElement;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- image field shapes vary (wrapped / flat)
      if (!field || isFieldValueEmpty(field as any)) {
        this.renderer.removeAttribute(element, 'src');
        return;
      }

      const img = (field as ImageFieldValue).src
        ? (field as ImageFieldValue)
        : (field as ImageField).value;

      if (!img?.src) {
        this.renderer.removeAttribute(element, 'src');
        return;
      }

      const params = this.imageParams();
      const prefix = this.mediaUrlPrefix();
      const resolvedSrc = mediaApi.updateImageUrl(img.src, params, prefix);
      this.renderer.setAttribute(element, 'src', resolvedSrc);

      if (img.alt !== undefined) {
        this.renderer.setAttribute(element, 'alt', String(img.alt));
      } else {
        this.renderer.removeAttribute(element, 'alt');
      }
      if (img.width !== undefined) {
        this.renderer.setAttribute(element, 'width', String(Number(img.width)));
      } else {
        this.renderer.removeAttribute(element, 'width');
      }
      if (img.height !== undefined) {
        this.renderer.setAttribute(element, 'height', String(Number(img.height)));
      } else {
        this.renderer.removeAttribute(element, 'height');
      }
    });
  }
}
