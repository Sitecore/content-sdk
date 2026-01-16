import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnChanges,
  SimpleChanges,
  inject,
  EmbeddedViewRef,
  Renderer2,
  inputBinding,
} from '@angular/core';
import { FieldMetadata, isFieldValueEmpty } from '@sitecore-content-sdk/core/layout';
import { mediaApi } from '@sitecore-content-sdk/core/media';
import { MetadataKind } from '@sitecore-content-sdk/core/editing';
import { SitecoreContextService } from '../lib/sitecore-context.service';
import { FieldMetadataMarkerComponent } from './field-metadata-marker.component';

/**
 * The interface for the Image field value.
 * @public
 */
export interface ImageFieldValue {
  [attributeName: string]: unknown;
  src?: string;
  alt?: string;
  width?: string | number;
  height?: string | number;
}

/**
 * The interface for the Image field.
 * @public
 */
export interface ImageField extends FieldMetadata {
  value?: ImageFieldValue;
}

/**
 * The interface for the Image size parameters.
 * @public
 */
export interface ImageSizeParameters {
  [attr: string]: string | number | undefined;
  w?: number;
  h?: number;
  mw?: number;
  mh?: number;
  iar?: 1 | 0;
  as?: 1 | 0;
  sc?: number;
}

/**
 * Context provided to the template when using *scImage directive
 * @public
 */
export interface ScImageContext {
  $implicit: ImageField | ImageFieldValue | undefined;
}

/**
 * Empty image SVG for editing mode
 */
const EMPTY_IMAGE_SVG =
  'data:image/svg+xml,%3Csvg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"%3E%3Crect fill="%23969696" x="20" y="20" width="200" height="200"/%3E%3Ccircle fill="%23FFFFFF" cx="174" cy="67" r="14"/%3E%3Cpolyline fill="%23FFFFFF" points="29.5,179.25 81.32,122.25 95.41,137.75 137.23,91.75 209.5,179.75"/%3E%3C/svg%3E';

/**
 * Structural directive for rendering image fields.
 * Renders the image with proper src and attributes on the host img element.
 *
 * @example
 * ```html
 * <img *scImage="fields.heroImage" />
 * <img *scImage="fields.heroImage; imageParams: { w: 800, h: 600 }" />
 * ```
 *
 * @public
 */
@Directive({
  selector: '[scImage]',
  standalone: true,
})
export class ScImageDirective implements OnChanges {
  /**
   * The image field data.
   */
  @Input('scImage') field?: ImageField | ImageFieldValue;

  /**
   * Parameters that will be attached to Sitecore media URLs.
   */
  @Input('scImageImageParams') imageParams?: { [paramName: string]: string | number };

  /**
   * Array of srcSet parameters for responsive images.
   */
  @Input('scImageSrcSet') srcSet?: ImageSizeParameters[];

  /**
   * Custom regexp that finds media URL prefix.
   */
  @Input('scImageMediaUrlPrefix') mediaUrlPrefix?: RegExp;

  /**
   * Whether the field is editable.
   * @default true
   */
  @Input('scImageEditable') editable = true;

  private readonly templateRef = inject(TemplateRef<ScImageContext>);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly renderer = inject(Renderer2);
  private readonly sitecoreContext = inject(SitecoreContextService);

  private viewRef: EmbeddedViewRef<ScImageContext> | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['field'] || changes['imageParams'] || changes['srcSet'] || changes['editable']) {
      this.updateView();
    }
  }

  private updateView(): void {
    this.viewContainer.clear();
    this.viewRef = null;

    const isEditing = this.sitecoreContext.getPage()?.mode?.isEditing ?? false;
    const hasMetadata = this.editable && isEditing && !!(this.field as ImageField)?.metadata;
    const isEmpty = isFieldValueEmpty(this.field);
    const shouldShowEmptyEditing = hasMetadata && isEmpty;

    // Don't render if empty (non-editing mode)
    if (isEmpty && !shouldShowEmptyEditing) {
      return;
    }

    if (hasMetadata) {
      this.renderWithMetadata(shouldShowEmptyEditing);
    } else {
      this.renderWithoutMetadata();
    }
  }

  private getImageAttrs(): {
    src?: string;
    srcSet?: string;
    alt?: string;
    width?: string | number;
    height?: string | number;
  } | null {
    const dynamicMedia = this.field as ImageField | ImageFieldValue;

    // Handle raw image object value (ImageFieldValue) vs wrapped (ImageField)
    const img = (dynamicMedia as ImageFieldValue).src
      ? (this.field as ImageFieldValue)
      : ((dynamicMedia as ImageField).value as ImageFieldValue);

    if (!img || !img.src) {
      return null;
    }

    const result: {
      src?: string;
      srcSet?: string;
      alt?: string;
      width?: string | number;
      height?: string | number;
    } = {};

    const resolvedSrc = mediaApi.updateImageUrl(img.src, this.imageParams, this.mediaUrlPrefix);
    result.src = resolvedSrc;

    if (this.srcSet) {
      result.srcSet = mediaApi.getSrcSet(
        resolvedSrc,
        this.srcSet,
        this.imageParams,
        this.mediaUrlPrefix
      );
    }

    result.alt = img.alt as string | undefined;
    result.width = img.width;
    result.height = img.height;

    return result;
  }

  private applyImageAttrs(imgElement: HTMLImageElement, isEmpty: boolean): void {
    if (isEmpty) {
      this.renderer.setAttribute(imgElement, 'src', EMPTY_IMAGE_SVG);
      this.renderer.setAttribute(imgElement, 'alt', '');
      this.renderer.addClass(imgElement, 'scEmptyImage');
      this.renderer.setStyle(imgElement, 'minWidth', '48px');
      this.renderer.setStyle(imgElement, 'minHeight', '48px');
      this.renderer.setStyle(imgElement, 'maxWidth', '400px');
      this.renderer.setStyle(imgElement, 'maxHeight', '400px');
      this.renderer.setStyle(imgElement, 'cursor', 'pointer');
      return;
    }

    const imageAttrs = this.getImageAttrs();
    if (!imageAttrs) return;

    this.renderer.setAttribute(imgElement, 'src', imageAttrs.src || '');
    if (imageAttrs.srcSet) {
      this.renderer.setAttribute(imgElement, 'srcset', imageAttrs.srcSet);
    }
    if (imageAttrs.alt !== undefined) {
      this.renderer.setAttribute(imgElement, 'alt', imageAttrs.alt);
    }
    if (imageAttrs.width !== undefined) {
      this.renderer.setAttribute(imgElement, 'width', String(imageAttrs.width));
    }
    if (imageAttrs.height !== undefined) {
      this.renderer.setAttribute(imgElement, 'height', String(imageAttrs.height));
    }
  }

  private renderWithMetadata(isEmpty: boolean): void {
    const metadata = (this.field as ImageField)?.metadata;

    // Create opening metadata marker
    this.viewContainer.createComponent(FieldMetadataMarkerComponent, {
      bindings: [
        inputBinding('metadata', () => metadata),
        inputBinding('kind', () => MetadataKind.Open),
      ],
    });

    // Create the content view
    this.viewRef = this.viewContainer.createEmbeddedView(this.templateRef, {
      $implicit: this.field,
    });

    const imgElement = this.viewRef.rootNodes[0] as HTMLImageElement;
    if (imgElement) {
      this.applyImageAttrs(imgElement, isEmpty);
    }

    // Create closing metadata marker
    this.viewContainer.createComponent(FieldMetadataMarkerComponent, {
      bindings: [inputBinding('kind', () => MetadataKind.Close)],
    });
  }

  private renderWithoutMetadata(): void {
    this.viewRef = this.viewContainer.createEmbeddedView(this.templateRef, {
      $implicit: this.field,
    });

    const imgElement = this.viewRef.rootNodes[0] as HTMLImageElement;
    if (imgElement) {
      this.applyImageAttrs(imgElement, false);
    }
  }
}
