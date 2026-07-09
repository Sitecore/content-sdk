import { Component, Directive, computed } from '@angular/core';
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

const PROMO_HOST = {
  '[attr.class]': "('component promo ' + styles().trim())",
  '[attr.id]': 'renderingId()',
  'attr.itemscope': '',
  'attr.itemtype': 'https://schema.org/Product',
} as const;

@Directive()
abstract class PromoBase extends SxaComponent {
  readonly promoIcon = computed(() => (this.fields() as PromoFields)?.PromoIcon);
  readonly promoText = computed(() => (this.fields() as PromoFields)?.PromoText);
  readonly promoText2 = computed(() => (this.fields() as PromoFields)?.PromoText2);
  readonly promoLink = computed(() => (this.fields() as PromoFields)?.PromoLink);

  readonly isEmpty = computed(() => this.arePromoFieldsEmpty(this.fields() as PromoFields | undefined));

  readonly jsonLd = computed(() => {
    const promoFields = this.fields() as PromoFields;
    if (this.arePromoFieldsEmpty(promoFields)) {
      return null;
    }
    return this.buildPromoProductJsonLd(
      promoFields as Record<string, unknown>,
      this.promoLink(),
      this.promoText()
    );
  });

  readonly jsonLdScriptId = computed(() => `jsonld-product-${this.renderingId() ?? 'promo'}`);

  protected arePromoFieldsEmpty(fields: PromoFields | undefined): boolean {
    if (!fields) {
      return true;
    }
    return (
      fields.PromoIcon == null &&
      fields.PromoText == null &&
      fields.PromoText2 == null &&
      fields.PromoLink == null
    );
  }

  private buildPromoProductJsonLd(
    fields: Record<string, unknown>,
    link: LinkField | undefined,
    primaryText: TextField | undefined
  ) {
    return buildProductJsonLd({
      name:
        link?.value?.title || (primaryText?.value != null ? String(primaryText.value) : undefined),
      descriptionHtml: primaryText?.value != null ? String(primaryText.value) : undefined,
      url: link?.value?.href,
      image: this.promoImageSrc(fields),
    });
  }

  private promoImageSrc(fields: Record<string, unknown>): string | undefined {
    const icon = fields.PromoIcon as ImageField | undefined;
    const src = icon?.value?.src;
    return typeof src === 'string' ? src : undefined;
  }
}

@Component({
  selector: 'app-promo-default',
  imports: [ScRichTextDirective, ScImageDirective, ScLinkDirective, StructuredDataComponent],
  host: PROMO_HOST,
  template: `
    <div class="component-content">
      @if (isEmpty()) {
        <span class="is-empty-hint">Promo</span>
      } @else {
        <figure class="field-promoicon" itemprop="image">
          <img *scImage="promoIcon()" alt="" />
        </figure>
        <div class="promo-text" itemprop="description">
          <div class="field-promotext">
            @if (promoText(); as primaryRichText) {
              <div *scRichText="primaryRichText"></div>
            }
          </div>
          <div class="field-promolink">
            <a *scLink="promoLink()"></a>
          </div>
        </div>
        @if (jsonLd()) {
          <app-structured-data [scriptId]="jsonLdScriptId()" [data]="jsonLd()" />
        }
      }
    </div>
  `,
})
class PromoDefaultComponent extends PromoBase {}

@Component({
  selector: 'app-promo-with-text',
  imports: [ScRichTextDirective, ScImageDirective, StructuredDataComponent],
  host: PROMO_HOST,
  template: `
    <div class="component-content">
      @if (isEmpty()) {
        <span class="is-empty-hint">Promo</span>
      } @else {
        <figure class="field-promoicon" itemprop="image">
          <img *scImage="promoIcon()" alt="" />
        </figure>
        <div class="promo-text" itemprop="description">
          <div class="field-promotext">
            @if (promoText(); as primaryRichText) {
              <div class="promo-text" *scRichText="primaryRichText"></div>
            }
          </div>
          <div class="field-promotext">
            @if (promoText2(); as secondaryRichText) {
              <div class="promo-text" *scRichText="secondaryRichText"></div>
            }
          </div>
        </div>
        @if (jsonLd()) {
          <app-structured-data [scriptId]="jsonLdScriptId()" [data]="jsonLd()" />
        }
      }
    </div>
  `,
})
class PromoWithTextComponent extends PromoBase {}

export { PromoDefaultComponent as Default, PromoWithTextComponent as WithText };
