import { Component, computed, input } from '@angular/core';
import { MetadataKind } from '@sitecore-content-sdk/content/editing';
import { ComponentRendering } from '@sitecore-content-sdk/content/layout';
import { computePlaceholderChromeId } from './placeholder-utils';

export type CodeBlockAttributes = {
  chrometype: string;
  kind: string;
  id?: string;
};

/**
 * Renders Sitecore Metadata-mode chrome markers around projected content.
 *
 * When `placeholderName` is provided, emits placeholder chrome
 * (`chrometype="placeholder"`); otherwise emits rendering chrome
 * (`chrometype="rendering"`). The open marker carries the computed `id`;
 * the close marker never has one.
 * @public
 */
@Component({
  selector: 'sc-placeholder-metadata',
  template: `
    <code
      type="text/sitecore"
      class="scpm"
      [attr.chrometype]="chrometype()"
      [attr.kind]="MetadataKind.Open"
      [attr.id]="openId()"
    ></code>
    <ng-content></ng-content>
    <code
      type="text/sitecore"
      class="scpm"
      [attr.chrometype]="chrometype()"
      [attr.kind]="MetadataKind.Close"
    ></code>
  `,
})
export class ScPlaceholderMetadata {
  readonly rendering = input.required<ComponentRendering>();
  readonly placeholderName = input<string>();

  protected readonly MetadataKind = MetadataKind;

  protected readonly chrometype = computed(() =>
    this.placeholderName() ? 'placeholder' : 'rendering'
  );

  protected readonly openId = computed((): string | null => {
    const placeholderName = this.placeholderName();
    const rendering = this.rendering();
    if (!placeholderName) return rendering.uid ?? null;
    return computePlaceholderChromeId(rendering, placeholderName, rendering.uid) || null;
  });
}
