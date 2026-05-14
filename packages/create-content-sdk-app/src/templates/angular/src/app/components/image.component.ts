import { Component, computed, inject } from '@angular/core';
import {
  Field,
  ImageField,
  LinkField,
  ScImageDirective,
  ScLinkDirective,
  ScTextDirective,
  SitecoreContextService,
} from '@sitecore-content-sdk/angular';
import { SxaComponent } from './content-sdk/sxa.component';

const DEFAULT_SIZES =
  '(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 90vw, 1200px';

const BANNER_SIZES =
  '(max-width: 640px) 100vw, (max-width: 768px) 768px, (max-width: 1024px) 1024px, (max-width: 1440px) 1280px, 1920px';

interface ImageDefaultFields {
  Image?: ImageField;
  ImageCaption?: Field<string>;
  TargetUrl?: LinkField;
}

interface ImageBannerFields {
  Image?: ImageField;
}

@Component({
  selector: 'app-image-default',
  imports: [ScImageDirective, ScLinkDirective, ScTextDirective],
  template: `
    @if (showEmpty()) {
    <div [attr.class]="('component image ' + styles()).trim()">
      <div class="component-content">
        <span class="is-empty-hint">Image</span>
      </div>
    </div>
    } @else {
    <div [attr.class]="('component image ' + styles()).trim()" [attr.id]="renderingId()">
      <div class="component-content">
        @if (wrapWithLink()) {
        <a [scLink]="targetUrlField()!">
          <img [scImage]="imageField()" [attr.sizes]="defaultSizes" [attr.alt]="imageAlt()" />
        </a>
        } @else {
        <img [scImage]="imageField()" [attr.sizes]="defaultSizes" [attr.alt]="imageAlt()" />
        }
        <span class="image-caption field-imagecaption" [scText]="captionField()"></span>
      </div>
    </div>
    }
  `,
})
class ImageDefaultComponent extends SxaComponent {
  readonly defaultSizes = DEFAULT_SIZES;

  private readonly context = inject(SitecoreContextService);

  readonly imageField = computed(() => (this.fields() as ImageDefaultFields)?.Image);
  readonly captionField = computed(() => (this.fields() as ImageDefaultFields)?.ImageCaption);
  readonly targetUrlField = computed(() => (this.fields() as ImageDefaultFields)?.TargetUrl);

  readonly showEmpty = computed(() => this.fields()?.Image == null);

  readonly wrapWithLink = computed(() => {
    if (this.context.isEditing()) return false;
    const href = this.targetUrlField()?.value?.href;
    return !!href?.trim();
  });

  readonly imageAlt = computed(() => {
    const alt = this.imageField()?.value?.alt;
    return typeof alt === 'string' ? alt : '';
  });
}

@Component({
  selector: 'app-image-banner',
  imports: [ScImageDirective],
  template: `
    <div [attr.class]="('component hero-banner ' + styles()).trim()" [attr.id]="renderingId()">
      <div class="component-content sc-sxa-image-hero-banner">
        <img
          [scImage]="bannerImageField()"
          [attr.sizes]="bannerSizes"
          loading="eager"
          fetchpriority="high"
          [attr.alt]="bannerAlt()"
          [style.object-fit]="'cover'"
          [style.width]="'100%'"
          [style.height]="'100%'"
        />
      </div>
    </div>
  `,
})
class ImageBannerComponent extends SxaComponent {
  readonly bannerSizes = BANNER_SIZES;

  readonly bannerImageField = computed(() => {
    const sourceImage = (this.fields() as ImageBannerFields)?.Image;
    if (!sourceImage?.value) return sourceImage;
    return {
      ...sourceImage,
      value: {
        ...sourceImage.value,
        style: { objectFit: 'cover', width: '100%', height: '100%' },
      },
    } as ImageField;
  });

  readonly bannerAlt = computed(() => {
    const alt = (this.fields() as ImageBannerFields)?.Image?.value?.alt;
    return typeof alt === 'string' ? alt : 'Hero banner';
  });
}

export { ImageDefaultComponent as Default, ImageBannerComponent as Banner };
