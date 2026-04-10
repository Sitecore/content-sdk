import { Component, input, computed } from '@angular/core';
import { ComponentRendering, ScPlaceholderComponent } from '@sitecore-content-sdk/angular';
import { scRenderingId } from '../sitecore/sitecore-component-classes';

@Component({
  selector: 'app-column-splitter',
  standalone: true,
  imports: [ScPlaceholderComponent],
  template: `
    <div [attr.class]="rowClass()" [id]="renderingId()">
      @for (phName of placeholderNames(); track phName) {
        <div>
          <sc-placeholder [name]="phName" [rendering]="rendering()!"></sc-placeholder>
        </div>
      }
    </div>
  `,
})
export class ColumnSplitterComponent {
  readonly fields = input<{ [key: string]: unknown }>({});
  readonly params = input<{ [key: string]: string }>({});
  readonly rendering = input<ComponentRendering>();

  readonly placeholderNames = computed(() => {
    const r = this.rendering();
    if (!r?.placeholders) return [];
    return Object.keys(r.placeholders);
  });

  readonly rowClass = computed(() => {
    const s = this.params()?.['styles']?.trim();
    const base = 'row column-splitter';
    return s ? `${base} ${s}` : base;
  });

  readonly renderingId = computed(() => scRenderingId(this.params()));
}
