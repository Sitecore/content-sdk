import { Component, input, computed } from '@angular/core';
import { ComponentRendering, Field } from '@sitecore-content-sdk/angular';
import { ScTextDirective } from '@sitecore-content-sdk/angular';
import { scComponentRoot, scRenderingId } from '../sitecore/sitecore-component-classes';

@Component({
  selector: 'app-title',
  standalone: true,
  imports: [ScTextDirective],
  template: `
    <div [attr.class]="rootClass()" [id]="renderingId()">
      <div class="component-content">
        <div class="field-title">
          <h1 [scText]="titleField()"></h1>
        </div>
      </div>
    </div>
  `,
})
export class TitleComponent {
  readonly fields = input<{ [key: string]: unknown }>({});
  readonly params = input<{ [key: string]: string }>({});
  readonly rendering = input<ComponentRendering>();

  readonly titleField = computed(() => this.fields()?.['Title'] as Field<string> | undefined);

  readonly rootClass = computed(() => scComponentRoot('title', this.params()));
  readonly renderingId = computed(() => scRenderingId(this.params()));
}
