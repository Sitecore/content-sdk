import { Component, computed, input } from '@angular/core';
import { FileField, FileFieldValue } from '../../field-types';

/**
 * Renders a Sitecore file field as a download `<a>` link.
 *
 * - Accepts both `FileField` (with `.value`) and bare `FileFieldValue` (with `.src`).
 * - Uses `title` or `displayName` as link text when no child content is provided.
 * - Returns nothing when the field value or `src` is empty.
 *
 * @example
 * <sc-file [field]="fields.brochure" />
 * @public
 */
@Component({
  selector: 'sc-file',
  standalone: true,
  template: `
    @if (fileValue()?.src) {
      <a [href]="fileValue()!.src">
        <ng-content>{{ fileValue()!.title ?? fileValue()!.displayName ?? '' }}</ng-content>
      </a>
    }
  `,
})
export class FileComponent {
  /**
   * The file field data. Accepts `FileField` or a bare `FileFieldValue`.
   */
  readonly field = input<FileField | FileFieldValue | undefined>(undefined);

  readonly fileValue = computed<FileFieldValue | null>(() => {
    const f = this.field();
    if (!f) return null;
    const asValue = f as FileFieldValue;
    const asField = f as FileField;
    if (asValue.src !== undefined) return asValue;
    if (asField.value?.src) return asField.value;
    return null;
  });
}
