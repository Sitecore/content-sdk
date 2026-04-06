import { Component, input, computed } from '@angular/core';
import { ComponentRendering, Field } from '@sitecore-content-sdk/angular';
import { ScTextDirective, ScRichTextDirective } from '@sitecore-content-sdk/angular';
import { scComponentRoot, scRenderingId } from '../sitecore/sitecore-component-classes';

@Component({
  selector: 'app-content-block',
  standalone: true,
  imports: [ScTextDirective, ScRichTextDirective],
  template: `
    <div [attr.class]="rootClass()" [id]="renderingId()">
      <div class="component-content">
        <div>
          <h2 [scText]="titleField()"></h2>
          <div [scRichText]="contentField()"></div>
        </div>
      </div>
    </div>
  `,
})
export class ContentBlockComponent {
  readonly fields = input<{ [key: string]: unknown }>({});
  readonly params = input<{ [key: string]: string }>({});
  readonly rendering = input<ComponentRendering>();

  readonly titleField = computed(() => this.fields()?.['Title'] as Field<string> | undefined);
  readonly contentField = computed(() => this.fields()?.['Content'] as Field<string> | undefined);

  readonly rootClass = computed(() => scComponentRoot('content rich-text', this.params()));
  readonly renderingId = computed(() => scRenderingId(this.params()));
}
