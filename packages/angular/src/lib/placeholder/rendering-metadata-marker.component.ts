import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetadataKind } from '@sitecore-content-sdk/core/editing';

@Component({
  // Attribute selector to avoid capturing all ng-container elements
  selector: 'code[scRenderingMetaMarker]',
  standalone: true,
  imports: [CommonModule],
  // Skip hydration only for this small wrapper since it contains dynamic content
  host: {
    type: 'text/sitecore',
    chrometype: 'rendering',
    class: 'scpm',
    '[attr.kind]': 'kind()',
    '[attr.id]': 'uid()',
  },
  template: '',
})
export class RenderingMetadataMarkerComponent {
  /**
   * The unique ID for the rendering (used in the open code tag)
   */
  public uid = input<string>();

  public kind = input.required<MetadataKind>();
}
