import { Component, computed } from '@angular/core';
import { ScRichTextDirective, TextField } from '@sitecore-content-sdk/angular';
import { SxaComponent } from './content-sdk/sxa.component';

interface RichTextFields {
  Text?: TextField;
}

@Component({
  selector: 'app-rich-text',
  imports: [ScRichTextDirective],
  template: `
    <div [attr.class]="('component rich-text ' + styles()).trim()" [attr.id]="renderingId()">
      <div class="component-content">
        @if (contentField(); as content) {
        <div [scRichText]="content"></div>
        } @else {
        <span class="is-empty-hint">Rich text</span>
        }
      </div>
    </div>
  `,
})
export class RichTextComponent extends SxaComponent {
  readonly contentField = computed(() => (this.fields() as RichTextFields)?.Text);
}
