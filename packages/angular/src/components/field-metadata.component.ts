import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetadataKind } from '@sitecore-content-sdk/core/editing';

/**
 * Component that wraps field content with metadata markup for chromes hydration in Pages.
 * This is used internally by field components to support editing mode.
 * @public
 */
@Component({
  selector: 'sc-field-metadata',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <code
      type="text/sitecore"
      chrometype="field"
      class="scpm"
      [attr.kind]="openKind"
      >{{ metadataJson }}</code
    >
    <ng-content></ng-content>
    <code
      type="text/sitecore"
      chrometype="field"
      class="scpm"
      [attr.kind]="closeKind"
    ></code>
  `,
})
export class FieldMetadataComponent {
  /**
   * The metadata object to be serialized and included in the opening code tag
   */
  @Input({ required: true }) metadata!: { [key: string]: unknown };

  /**
   * MetadataKind.Open constant for template
   */
  protected readonly openKind = MetadataKind.Open;

  /**
   * MetadataKind.Close constant for template
   */
  protected readonly closeKind = MetadataKind.Close;

  /**
   * Serialized metadata JSON string
   */
  protected get metadataJson(): string {
    return JSON.stringify(this.metadata);
  }
}

