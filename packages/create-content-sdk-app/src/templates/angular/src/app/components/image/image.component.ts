import { Component, OnInit, ViewChild, TemplateRef, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  EditMode,
  ImageField,
  SitecoreContextService,
  ImageComponent as CSDKImageComponent,
  TextComponent,
  LinkComponent,
} from '@sitecore-content-sdk/angular';
import { SxaComponent } from '../sxa.component';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  standalone: true,
  imports: [CommonModule, CSDKImageComponent, TextComponent, LinkComponent],
})
export class ImageComponent extends SxaComponent implements OnInit {
  @ViewChild('default', { static: true }) defaultVariant!: TemplateRef<unknown>;
  @ViewChild('banner', { static: true }) bannerVariant!: TemplateRef<unknown>;
  classHeroBannerEmpty = '';
  backgroundStyle: Record<string, string> = {};
  modifyImageProps: ImageField | Record<string, unknown> = {};
  isEditing = false;

  constructor() {
    super();
    const sitecoreContext = inject(SitecoreContextService);
    // React to context changes using effect
    effect(() => {
      const page = sitecoreContext.page();
      this.isEditing = page?.mode?.isEditing ?? false;
      this.updateImageProps(page?.layout?.sitecore?.context?.editMode);
    });
  }

  override ngOnInit() {
    super.ngOnInit();

    const imageField = this.rendering.fields?.Image as ImageField | undefined;
    this.backgroundStyle = imageField?.value?.src
      ? { 'background-image': `url('${imageField.value.src}')` }
      : {};
  }

  private updateImageProps(editMode?: unknown): void {
    const imageField = this.rendering.fields?.Image as ImageField | undefined;

    if (imageField) {
      this.classHeroBannerEmpty =
        this.isEditing && imageField.value?.class === 'scEmptyImage' ? 'hero-banner-empty' : '';

      const isMetadataMode = (editMode as EditMode | undefined) === EditMode.Metadata;
      this.modifyImageProps = isMetadataMode
        ? {
            ...imageField,
            value: {
              ...imageField.value,
              style: { width: '100%', height: '100%' },
            },
          }
        : imageField;
    }
  }

  public get variant(): TemplateRef<unknown> {
    return this.rendering.params?.FieldNames === 'Banner'
      ? this.bannerVariant
      : this.defaultVariant;
  }
}
