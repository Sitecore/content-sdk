import { Component, input, computed } from '@angular/core';
import { ComponentRendering, ScPlaceholderComponent } from '@sitecore-content-sdk/angular';
import { scComponentRoot, scRenderingId } from '../sitecore/sitecore-component-classes';

@Component({
  selector: 'app-page-content',
  standalone: true,
  imports: [ScPlaceholderComponent],
  template: `
    <div [attr.class]="rootClass()" [id]="renderingId()">
      <div class="component-content">
        @for (phName of placeholderNames(); track phName) {
          <sc-placeholder [name]="phName" [rendering]="rendering()!"></sc-placeholder>
        }
      </div>
    </div>
  `,
})
export class PageContentComponent {
  readonly fields = input<{ [key: string]: unknown }>({});
  readonly params = input<{ [key: string]: string }>({});
  readonly rendering = input<ComponentRendering>();

  readonly placeholderNames = computed(() => {
    const r = this.rendering();
    if (!r?.placeholders) return [];
    return Object.keys(r.placeholders);
  });

  readonly rootClass = computed(() => scComponentRoot('page-content', this.params()));
  readonly renderingId = computed(() => scRenderingId(this.params()));
}
