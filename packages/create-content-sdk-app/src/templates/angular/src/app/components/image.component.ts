import { Component, input, computed } from '@angular/core';
import { ComponentRendering } from '@sitecore-content-sdk/angular';
import { ScImageDirective, ImageField } from '@sitecore-content-sdk/angular';
import { scComponentRoot, scRenderingId } from '../sitecore/sitecore-component-classes';

@Component({
  selector: 'app-image',
  standalone: true,
  imports: [ScImageDirective],
  template: `
    <div [attr.class]="rootClass()" [id]="renderingId()">
      <div class="component-content">
        <span class="sc-image-wrapper">
          <img [scImage]="imageField()" alt="" />
        </span>
      </div>
    </div>
  `,
})
export class ImageComponent {
  readonly fields = input<{ [key: string]: unknown }>({});
  readonly params = input<{ [key: string]: string }>({});
  readonly rendering = input<ComponentRendering>();

  readonly imageField = computed(() => this.fields()?.['Image'] as ImageField | undefined);

  readonly rootClass = computed(() => scComponentRoot('image', this.params()));
  readonly renderingId = computed(() => scRenderingId(this.params()));
}
