import { Component, input, computed } from '@angular/core';
import { ComponentRendering, Field } from '@sitecore-content-sdk/angular';
import { ScRichTextDirective } from '@sitecore-content-sdk/angular';
import { scComponentRoot, scRenderingId } from '../sitecore/sitecore-component-classes';

@Component({
  selector: 'app-rich-text',
  standalone: true,
  imports: [ScRichTextDirective],
  template: `
    <div [attr.class]="rootClass()" [id]="renderingId()">
      <div class="component-content">
        <div class="rich-text" [scRichText]="contentField()"></div>
      </div>
    </div>
  `,
})
export class RichTextComponent {
  readonly fields = input<{ [key: string]: unknown }>({});
  readonly params = input<{ [key: string]: string }>({});
  readonly rendering = input<ComponentRendering>();

  readonly contentField = computed(() => this.fields()?.['Text'] as Field<string> | undefined);

  readonly rootClass = computed(() => scComponentRoot('rich-text', this.params()));
  readonly renderingId = computed(() => scRenderingId(this.params()));
}
