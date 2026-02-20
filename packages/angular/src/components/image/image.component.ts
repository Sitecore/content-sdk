import { Component, computed, inject, input, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { ImageField, ImageFieldValue } from '../../field-types';

/**
 * Renders a Sitecore image field as an `<img>` element.
 *
 * - Accepts both a bare `ImageFieldValue` (with `.src`) and a wrapped `ImageField` (with `.value.src`).
 * - Passes through all standard `<img>` HTML attributes via the `imageAttrs` input.
 * - Returns nothing when the field or `src` is empty.
 *
 * SSR note: On the server the component renders the `<img>` with the same attributes as on
 * the browser; no browser-only APIs are used.
 *
 * @example
 * <sc-image [field]="fields.heroImage" [imageAttrs]="{ class: 'hero-img', loading: 'lazy' }" />
 * @public
 */
@Component({
  selector: 'sc-image',
  standalone: true,
  template: `
    @if (imgSrc()) {
      <img
        [src]="imgSrc()"
        [attr.alt]="imgAlt()"
        [attr.width]="imgWidth()"
        [attr.height]="imgHeight()"
        [attr.class]="extraAttrs()['class'] ?? null"
        [attr.loading]="extraAttrs()['loading'] ?? null"
        [attr.style]="extraAttrs()['style'] ?? null"
      />
    }
  `,
})
export class ImageComponent {
  /**
   * The image field data. Accepts `ImageField` (with `.value`) or a bare `ImageFieldValue`.
   */
  readonly field = input<ImageField | ImageFieldValue | undefined>(undefined);

  /**
   * Additional HTML attributes to spread onto the `<img>` element.
   */
  readonly imageAttrs = input<Record<string, unknown>>({});

  private readonly platformId = inject(PLATFORM_ID);
  readonly isServer = isPlatformServer(this.platformId);

  readonly resolvedValue = computed<ImageFieldValue | null>(() => {
    const f = this.field();
    if (!f) return null;
    const asValue = f as ImageFieldValue;
    const asField = f as ImageField;
    if (asValue.src !== undefined) return asValue;
    if (asField.value?.src) return asField.value;
    return null;
  });

  readonly imgSrc = computed(() => this.resolvedValue()?.src ?? null);
  readonly imgAlt = computed(() => {
    const v = this.resolvedValue();
    return v?.alt ?? (this.imageAttrs()['alt'] as string | undefined) ?? null;
  });
  readonly imgWidth = computed(() => {
    const v = this.resolvedValue();
    return v?.width ?? (this.imageAttrs()['width'] as string | undefined) ?? null;
  });
  readonly imgHeight = computed(() => {
    const v = this.resolvedValue();
    return v?.height ?? (this.imageAttrs()['height'] as string | undefined) ?? null;
  });
  readonly extraAttrs = computed(() => this.imageAttrs());
}
