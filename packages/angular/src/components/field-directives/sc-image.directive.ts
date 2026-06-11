import { Directive, TemplateRef, Type, input } from '@angular/core';
import { isFieldValueEmpty } from '@sitecore-content-sdk/content/layout';
import { mediaApi } from '@sitecore-content-sdk/content/media';
import { BaseFieldDirective } from './base-field.directive';
import { DefaultEmptyImageFieldEditingComponent } from '../default-empty-image-field.component';
import { getClassFromField } from './utils';
import { MetadataKind } from '@sitecore-content-sdk/content/editing';

/**
 * Image field value shape.
 */
export interface ImageFieldValue {
  [attributeName: string]: unknown;
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  srcSet?: Array<{ [key: string]: string | number | undefined }>;
}

/**
 * Image field shape (with optional value wrapper).
 */
export interface ImageField {
  value?: ImageFieldValue;
  metadata?: Record<string, unknown>;
}

/**
 * Structural directive that renders a Sitecore image field onto a consumer-supplied `<img>`
 * element.
 *
 * Editing flow:
 *   - field has a renderable src → emit opening chrome marker, embed the consumer's `<img>`
 *     template, write `src/alt/width/height/class` onto it, emit closing chrome marker.
 *   - field is empty in editing mode + has `metadata` → render the empty-image placeholder
 *     between markers (overridable via `scImageEmptyFieldEditingTemplate`).
 *
 * Usage:
 * ```html
 * <img *scImage="fields.Image" />
 * <img *scImage="fields.Image; imageParams: { mw: 800 }" />
 * ```
 * @public
 */
@Directive({
  selector: '[scImage]',
})
export class ScImageDirective extends BaseFieldDirective<ImageField | ImageFieldValue | undefined> {
  /** The Sitecore image field (raw value or `{ value }` wrapper). */
  readonly field = input.required<ImageField | ImageFieldValue | undefined>({ alias: 'scImage' });

  /** Optional image params for media URL transformation. */
  readonly imageParams = input<{ [paramName: string]: string | number } | undefined>();

  /** Optional media URL prefix regexp. */
  readonly mediaUrlPrefix = input<RegExp | undefined>();

  /** Consumer-supplied template rendered between chrome markers when the field is empty in editing mode. */
  readonly emptyFieldEditingTemplate = input<TemplateRef<unknown> | undefined>();

  protected readonly defaultEmptyComponent: Type<unknown> = DefaultEmptyImageFieldEditingComponent;

  protected updateView(): void {
    this.viewContainer.clear();
    this.viewRef = undefined;

    if (!this.shouldRender()) {
      this.renderEmpty();
      return;
    }

    this.renderEditingChrome(MetadataKind.Open);
    this.viewRef = this.viewContainer.createEmbeddedView(this.templateRef);
    this.applyValue();
    this.renderEditingChrome(MetadataKind.Close);
  }

  protected shouldRender(): boolean {
    const field = this.field();
    if (!field || isFieldValueEmpty(field)) return false;
    const img = (field as ImageFieldValue).src
      ? (field as ImageFieldValue)
      : (field as ImageField).value;
    return !!img?.src;
  }

  private applyValue(): void {
    const field = this.field();
    if (!field || !this.viewRef) return;

    const img = (field as ImageFieldValue).src
      ? (field as ImageFieldValue)
      : (field as ImageField).value;
    if (!img?.src) return;

    const params = this.imageParams();
    const prefix = this.mediaUrlPrefix();
    const resolvedSrc = mediaApi.updateImageUrl(img.src, params, prefix);

    for (const node of this.viewRef.rootNodes) {
      if (!(node instanceof Element)) continue;
      const el = node as HTMLImageElement;
      this.renderer.setAttribute(el, 'src', resolvedSrc);

      if (Array.isArray(img.srcSet) && img.srcSet.length > 0) {
        const srcSetValue = mediaApi.getSrcSet(resolvedSrc, img.srcSet, params, prefix);
        if (srcSetValue) {
          this.renderer.setAttribute(el, 'srcset', srcSetValue);
        }
      } else {
        this.renderer.removeAttribute(el, 'srcset');
      }

      const classValue = getClassFromField(img);
      if (classValue) {
        this.renderer.addClass(el, classValue);
      }

      if (img.alt !== undefined) {
        this.renderer.setAttribute(el, 'alt', img.alt);
      } else {
        this.renderer.removeAttribute(el, 'alt');
      }
      if (img.width !== undefined) {
        this.renderer.setAttribute(el, 'width', String(img.width));
      } else {
        this.renderer.removeAttribute(el, 'width');
      }
      if (img.height !== undefined) {
        this.renderer.setAttribute(el, 'height', String(img.height));
      } else {
        this.renderer.removeAttribute(el, 'height');
      }
    }
  }
}
