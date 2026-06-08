import { Component, computed } from '@angular/core';
import { ScRichTextDirective, TextField } from '@sitecore-content-sdk/angular';
import { SxaComponent } from './content-sdk/sxa.component';

interface RichTextFields {
  Text?: TextField;
}

@Component({
  selector: 'app-rich-text',
  imports: [ScRichTextDirective],
  host: {
    '[attr.class]': "('component rich-text ' + styles().trim())",
    '[attr.id]': 'renderingId()',
  },
  template: `
    <div class="component-content">
      <div *scRichText="contentField()"></div>
    </div>
  `,
})
export class RichTextComponent extends SxaComponent {
  readonly contentField = computed(() => (this.fields() as RichTextFields)?.Text);
}

export default RichTextComponent;
