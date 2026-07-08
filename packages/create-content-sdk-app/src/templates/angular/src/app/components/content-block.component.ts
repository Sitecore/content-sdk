import { Component, computed } from '@angular/core';
import { Field } from '@sitecore-content-sdk/angular';
import { ScTextDirective, ScRichTextDirective, TextField } from '@sitecore-content-sdk/angular';
import { SxaComponent } from './content-sdk/sxa.component';

/**
 * Parity with kit-nextjs-skate-park ContentBlock (minimal section, no Sitecore chrome wrapper).
 */
@Component({
  selector: 'app-content-block',
  imports: [ScTextDirective, ScRichTextDirective],
  template: `
    <div class="contentBlock">
      <h2 class="contentTitle" *scText="headingField()"></h2>
      <div class="contentDescription">
        @if (contentField(); as content) {
        <div *scRichText="content"></div>
        }
      </div>
    </div>
  `,
})
export class ContentBlockComponent extends SxaComponent {
  readonly headingField = computed((): Field<string> | undefined => {
    const all = this.fields();
    if (!all || Object.keys(all).length === 0) return undefined;
    return (all.heading ?? all.Heading) as Field<string> | undefined;
  });

  readonly contentField = computed((): TextField | undefined => {
    const all = this.fields();
    if (!all || Object.keys(all).length === 0) return undefined;
    return (all.content ?? all.Content) as TextField | undefined;
  });
}

export default ContentBlockComponent;
