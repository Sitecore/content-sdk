import { Component, computed, input } from '@angular/core';
import { isFieldValueEmpty } from '@sitecore-content-sdk/content/layout';
import { DateFieldType } from '../../field-types';

/**
 * Renders a Sitecore date field value.
 *
 * - The raw ISO-8601 string is passed to an optional `render` function for custom formatting.
 * - When no `render` function is provided the raw value is displayed as-is.
 * - Wraps the output in an optional HTML tag.
 * - Returns nothing when the field value is empty.
 * @example
 * <!-- Raw ISO value -->
 * <sc-date [field]="fields.publishDate" />
 * @example
 * <!-- Custom formatted date -->
 * <sc-date [field]="fields.publishDate" [render]="formatDate" />
 * <!-- Where: formatDate = (d: Date | null) => d?.toLocaleDateString() ?? '' -->
 * @public
 */
@Component({
  selector: 'sc-date',
  standalone: true,
  template: `
    @if (!isEmpty()) {
      @if (tag()) {
        <span [innerHTML]="taggedHtml()"></span>
      } @else {
        {{ displayValue() }}
      }
    }
  `,
})
export class DateComponent {
  /**
   * The date field data to render.
   */
  readonly field = input<DateFieldType | undefined>(undefined);

  /**
   * HTML tag to wrap the date value (e.g. `'time'`, `'span'`). When omitted, renders inline.
   */
  readonly tag = input<string | undefined>(undefined);

  /**
   * Optional render function for formatting the date.
   * Receives a `Date` object (or `null` if the value cannot be parsed) and returns a string.
   */
  readonly render = input<((date: Date | null) => string) | undefined>(undefined);

  readonly isEmpty = computed(() => {
    const f = this.field();
    return !f || isFieldValueEmpty(f);
  });

  readonly displayValue = computed<string>(() => {
    const value = this.field()?.value;
    const renderFn = this.render();
    if (renderFn) {
      return renderFn(value ? new Date(value) : null);
    }
    return value ?? '';
  });

  readonly taggedHtml = computed(() => {
    const t = this.tag();
    return t ? `<${t}>${this.displayValue()}</${t}>` : this.displayValue();
  });
}
