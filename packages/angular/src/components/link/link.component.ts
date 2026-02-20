import { Component, computed, input } from '@angular/core';
import { LinkField, LinkFieldValue } from '../../field-types';
import { buildLinkHref, getLinkFieldValue } from '../../utils/field-utils';

/**
 * Renders a Sitecore link field as an `<a>` element.
 *
 * - Accepts both `LinkField` (with `.value`) and bare `LinkFieldValue` (with `.href`).
 * - Builds the final `href` by combining `href`, `querystring`, and `anchor` from the field value.
 * - Renders child content inside the anchor when provided; otherwise uses `text` or `description`.
 * - Returns nothing when the field value or `href` is empty.
 *
 * @example
 * <sc-link [field]="fields.ctaLink">Click here</sc-link>
 * @public
 */
@Component({
  selector: 'sc-link',
  standalone: true,
  template: `
    @if (linkValue()?.href) {
      <a
        [href]="href()"
        [attr.title]="linkValue()!.title ?? null"
        [attr.target]="linkValue()!.target ?? null"
        [attr.class]="linkValue()!.className ?? linkValue()!.class ?? null"
      >
        <ng-content>{{ linkValue()!.text }}</ng-content>
      </a>
    }
  `,
})
export class LinkComponent {
  /**
   * The link field data. Accepts `LinkField` or a bare `LinkFieldValue`.
   */
  readonly field = input<LinkField | LinkFieldValue | undefined>(undefined);

  readonly linkValue = computed(() => getLinkFieldValue(this.field()));

  readonly href = computed(() => {
    const v = this.linkValue();
    return v ? buildLinkHref(v) : '';
  });
}
