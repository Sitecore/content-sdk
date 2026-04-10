import { Component, input, computed } from '@angular/core';
import { ComponentRendering, Field } from '@sitecore-content-sdk/angular';
import {
  ScTextDirective,
  ScRichTextDirective,
  ScImageDirective,
  ScLinkDirective,
  ImageField,
  LinkField,
} from '@sitecore-content-sdk/angular';
import { scComponentRoot, scRenderingId } from '../sitecore/sitecore-component-classes';

@Component({
  selector: 'app-promo',
  standalone: true,
  imports: [ScTextDirective, ScRichTextDirective, ScImageDirective, ScLinkDirective],
  template: `
    <div [attr.class]="rootClass()" [id]="renderingId()">
      <div class="component-content">
        @if (imageField()) {
          <div class="field-promoicon">
            <img [scImage]="imageField()" alt="" />
          </div>
        }
        <div class="promo-text">
          <div class="field-promotext">
            <h2 [scText]="titleField()"></h2>
            <div [scRichText]="descriptionField()"></div>
          </div>
          @if (linkField()) {
            <div class="field-promolink">
              <a [scLink]="linkField()"></a>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class PromoComponent {
  readonly fields = input<{ [key: string]: unknown }>({});
  readonly params = input<{ [key: string]: string }>({});
  readonly rendering = input<ComponentRendering>();

  readonly titleField = computed(() => this.fields()?.['Title'] as Field<string> | undefined);
  readonly descriptionField = computed(
    () => this.fields()?.['Description'] as Field<string> | undefined
  );
  readonly imageField = computed(() => this.fields()?.['Image'] as ImageField | undefined);
  readonly linkField = computed(() => this.fields()?.['Link'] as LinkField | undefined);

  readonly rootClass = computed(() => scComponentRoot('promo', this.params()));
  readonly renderingId = computed(() => scRenderingId(this.params()));
}
