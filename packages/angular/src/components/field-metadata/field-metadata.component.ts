import { Component, input } from '@angular/core';
import { MetadataKind } from '@sitecore-content-sdk/content/editing';
import { ComponentRendering } from '@sitecore-content-sdk/content/layout';

/**
 * Wraps a rendered component with Sitecore Pages metadata `<code>` tags so the editor
 * can identify the component in the DOM. Only rendered when the page is in editing mode.
 * @internal
 */
@Component({
  selector: 'sc-field-metadata',
  standalone: true,
  template: `
    <code
      type="text/sitecore"
      chrometype="rendering"
      class="scpm"
      [attr.kind]="openKind"
      [attr.data]="renderingData"
    ></code>
    <ng-content />
    <code
      type="text/sitecore"
      chrometype="rendering"
      class="scpm"
      [attr.kind]="closeKind"
    ></code>
  `,
})
export class FieldMetadataComponent {
  /**
   * The rendering whose metadata will be serialised into the open code tag.
   */
  readonly rendering = input.required<Partial<ComponentRendering>>();

  readonly openKind = MetadataKind.Open;
  readonly closeKind = MetadataKind.Close;

  get renderingData(): string {
    const { componentName, dataSource, uid, fields, params } = this.rendering() as ComponentRendering;
    return JSON.stringify({ componentName, dataSource, uid, fields, params });
  }
}
