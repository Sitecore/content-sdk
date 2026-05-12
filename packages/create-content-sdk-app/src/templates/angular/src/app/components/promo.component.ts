import { Component, computed } from '@angular/core';
import {
  ImageField,
  LinkField,
  ScImageDirective,
  ScLinkDirective,
  ScRichTextDirective,
  TextField,
} from '@sitecore-content-sdk/angular';
import { StructuredDataComponent } from './structured-data.component';
import { buildProductJsonLd } from './content-sdk/json-ld';
import { SxaComponent } from './content-sdk/sxa.component';

interface PromoFields {
  PromoIcon?: ImageField;
  PromoText?: TextField;
  PromoText2?: TextField;
  PromoLink?: LinkField;
}

function promoImageSrc(fields: Record<string, unknown>): string | undefined {
  const icon = fields.PromoIcon as ImageField | undefined;
  const src = icon?.value?.src;
  return typeof src === 'string' ? src : undefined;
}

/** Maps Promo / Promo-WithText layout fields to Product JSON-LD. */
function promoProductJsonLd(
  fields: Record<string, unknown>,
  link: LinkField | undefined,
  primaryText: TextField | undefined,
  secondaryText: TextField | undefined
) {
  const descriptionHtml =
    [primaryText?.value, secondaryText?.value]
      .filter((segment) => segment != null && String(segment).length > 0)
      .map((segment) => String(segment))
      .join(' ') || undefined;

  return buildProductJsonLd({
    name:
      link?.value?.title || (primaryText?.value != null ? String(primaryText.value) : undefined),
    descriptionHtml,
    url: link?.value?.href,
    image: promoImageSrc(fields),
  });
}

/**
 * Promo Default and Promo With Text share one implementation: optional `PromoText2` drives the
 * second rich-text column and merged JSON-LD description.
 */
@Component({
  selector: 'app-promo',
  imports: [ScRichTextDirective, ScImageDirective, ScLinkDirective, StructuredDataComponent],
  template: `
    <article
      [attr.class]="('component promo ' + styles()).trim()"
      [attr.id]="renderingId()"
      itemscope
      itemtype="https://schema.org/Product"
    >
      <div class="component-content">
        @if (showEmpty()) {
        <span class="is-empty-hint">Promo</span>
        } @else {
        <div class="field-promoicon" itemprop="image">
          <img [scImage]="promoIcon()" alt="" />
        </div>
        <div class="promo-text" itemprop="description">
          <div class="field-promotext">
            @if (promoText(); as primaryRichText) {
            <div [scRichText]="primaryRichText"></div>
            }
          </div>
          @if (promoText2(); as secondaryRichText) {
          <div class="field-promotext">
            <div [scRichText]="secondaryRichText"></div>
          </div>
          }
          <div class="field-promolink">
            <a [scLink]="promoLink()"></a>
          </div>
        </div>
        @if (jsonLd()) {
        <app-structured-data [scriptId]="jsonLdScriptId()" [data]="jsonLd()" />
        } }
      </div>
    </article>
  `,
})
export class PromoComponent extends SxaComponent {
  readonly showEmpty = computed(() => {
    const f = this.fields();
    return (
      f?.PromoIcon == null && f?.PromoText == null && f?.PromoText2 == null && f?.PromoLink == null
    );
  });

  readonly promoIcon = computed(() => (this.fields() as PromoFields)?.PromoIcon);
  readonly promoText = computed(() => (this.fields() as PromoFields)?.PromoText);
  readonly promoText2 = computed(() => (this.fields() as PromoFields)?.PromoText2);
  readonly promoLink = computed(() => (this.fields() as PromoFields)?.PromoLink);

  readonly jsonLd = computed(() => {
    const promoFields = this.fields() as PromoFields;
    if (
      promoFields?.PromoIcon == null &&
      promoFields?.PromoText == null &&
      promoFields?.PromoText2 == null &&
      promoFields?.PromoLink == null
    ) {
      return null;
    }
    return promoProductJsonLd(
      promoFields as Record<string, unknown>,
      this.promoLink(),
      this.promoText(),
      this.promoText2()
    );
  });

  readonly jsonLdScriptId = computed(() => `jsonld-product-${this.renderingId() ?? 'promo'}`);
}
