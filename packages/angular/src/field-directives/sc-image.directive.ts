import { Directive, ElementRef, inject, input, effect, Renderer2 } from '@angular/core';
import { isFieldValueEmpty } from '@sitecore-content-sdk/content/layout';
import { mediaApi } from '@sitecore-content-sdk/content/media';
import { getClassFromField } from './utils';

/**
 * Image field value shape.
 */
export interface ImageFieldValue {
  [attributeName: string]: unknown;
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
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

      if (!field || isFieldValueEmpty(field)) {
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
      const classValue = getClassFromField(img);
      if (classValue) {
        this.renderer.addClass(element, classValue);
      }

      if (img.alt !== undefined) {
        this.renderer.setAttribute(element, 'alt', img.alt);
      } else {
        this.renderer.removeAttribute(element, 'alt');
      }
      if (img.width !== undefined) {
        this.renderer.setAttribute(element, 'width', String(img.width));
      } else {
        this.renderer.removeAttribute(element, 'width');
      }
      if (img.height !== undefined) {
        this.renderer.setAttribute(element, 'height', String(img.height));
      } else {
        this.renderer.removeAttribute(element, 'height');
      }
    });
  }
}
