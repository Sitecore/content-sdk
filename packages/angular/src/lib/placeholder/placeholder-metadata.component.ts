import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ComponentRendering,
  isDynamicPlaceholder,
  getDynamicPlaceholderPattern,
} from '@sitecore-content-sdk/core/layout';
import { MetadataKind, DEFAULT_PLACEHOLDER_UID } from '@sitecore-content-sdk/core/editing';

/**
 * Code block attributes for metadata markers
 * @internal
 */
export interface CodeBlockAttributes {
  type: string;
  chrometype: 'placeholder' | 'rendering';
  class: string;
  kind: MetadataKind;
  id?: string;
}

/**
 * A component to generate metadata code blocks for a placeholder or rendering in editing mode.
 * It creates opening and closing code blocks with appropriate attributes.
 * @public
 */
@Component({
  selector: 'sc-placeholder-metadata',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <code
      type="text/sitecore"
      [attr.chrometype]="chromeType"
      class="scpm"
      [attr.kind]="openKind"
      [attr.id]="computedId"
    ></code>
    <ng-content></ng-content>
    <code
      type="text/sitecore"
      [attr.chrometype]="chromeType"
      class="scpm"
      [attr.kind]="closeKind"
    ></code>
  `,
})
export class PlaceholderMetadataComponent {
  /**
   * The rendering data for this component
   */
  @Input({ required: true }) rendering!: ComponentRendering;

  /**
   * The name of the placeholder (if this is a placeholder chrome)
   */
  @Input() placeholderName?: string;

  /**
   * MetadataKind.Open constant for template
   */
  protected readonly openKind = MetadataKind.Open;

  /**
   * MetadataKind.Close constant for template
   */
  protected readonly closeKind = MetadataKind.Close;

  /**
   * Computed chrome type based on whether this is a placeholder or rendering
   */
  protected get chromeType(): 'placeholder' | 'rendering' {
    return this.placeholderName ? 'placeholder' : 'rendering';
  }

  /**
   * Computed ID for the opening code block
   */
  protected get computedId(): string | undefined {
    if (this.chromeType === 'placeholder' && this.placeholderName) {
      return this.getPlaceholderId();
    }
    return this.rendering.uid;
  }

  /**
   * Get the placeholder ID for the metadata
   */
  private getPlaceholderId(): string {
    const placeholderName = this.placeholderName!;
    const id = this.rendering.uid;

    for (const placeholder of Object.keys(this.rendering.placeholders ?? {})) {
      if (placeholderName === placeholder) {
        return id
          ? `${placeholderName}_${id}`
          : `${placeholderName}_${DEFAULT_PLACEHOLDER_UID}`;
      }

      // Check if the placeholder is a dynamic placeholder
      if (isDynamicPlaceholder(placeholder)) {
        const pattern = getDynamicPlaceholderPattern(placeholder);

        // Check if the placeholder matches the dynamic placeholder pattern
        if (pattern.test(placeholderName)) {
          return id ? `${placeholder}_${id}` : `${placeholder}_${DEFAULT_PLACEHOLDER_UID}`;
        }
      }
    }

    return id
      ? `${placeholderName}_${id}`
      : `${placeholderName}_${DEFAULT_PLACEHOLDER_UID}`;
  }
}

