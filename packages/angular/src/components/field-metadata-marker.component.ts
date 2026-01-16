import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetadataKind } from '@sitecore-content-sdk/core/editing';

/**
 * Component that renders a single metadata code element for field chromes hydration in Pages.
 * Used by field directives to insert open/close metadata markers via viewContainer.createComponent.
 * @public
 */
@Component({
  selector: 'code[scFieldMetaMarker]',
  standalone: true,
  imports: [CommonModule],
  host: {
    type: 'text/sitecore',
    chrometype: 'field',
    class: 'scpm',
    '[attr.kind]': 'kind()',
  },
  template: '{{ metadataJson() }}',
})
export class FieldMetadataMarkerComponent {
  /**
   * The metadata object to be serialized (only used for open markers)
   */
  public metadata = input<{ [key: string]: unknown }>();

  /**
   * The kind of metadata marker (open or close)
   */
  public kind = input.required<MetadataKind>();

  /**
   * Serialized metadata JSON string (empty for close markers)
   */
  protected metadataJson = () => {
    const meta = this.metadata();
    return meta ? JSON.stringify(meta) : '';
  };
}
