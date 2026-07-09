import { Component, computed, input } from '@angular/core';
import { MetadataKind } from '@sitecore-content-sdk/content/editing';

/**
 * Component that renders a field' metadata chrome element.
 */
@Component({
  selector: 'code[scFieldMetadataMarker]',
  template: '{{ metadataString() }}',
  host: {
    '[attr.type]': '"text/sitecore"',
    '[attr.chrometype]': '"field"',
    '[class]': '"scpm"',
    '[attr.kind]': 'kind()',
  },
})
export class FieldMetadataMarkerComponent {
  readonly metadata = input<Record<string, unknown>>();

  readonly kind = input<MetadataKind>(MetadataKind.Open);

  readonly metadataString = computed(() => {
    const metadata = this.metadata();
    return metadata ? JSON.stringify(metadata) : '';
  });
}
