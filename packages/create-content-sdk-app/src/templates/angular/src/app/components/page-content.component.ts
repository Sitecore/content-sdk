import { Component, computed, inject } from '@angular/core';
import { Field, ScRichTextDirective, SitecoreContextService, TextField } from '@sitecore-content-sdk/angular';
import { StructuredDataComponent } from './structured-data.component';
import { buildArticleJsonLd } from './content-sdk/json-ld';
import { SxaComponent } from './content-sdk/sxa.component';

interface PageContentFields {
  Content?: TextField;
}

@Component({
  selector: 'app-page-content',
  imports: [ScRichTextDirective, StructuredDataComponent],
  template: `
    <article
      [attr.class]="('component content ' + styles()).trim()"
      [attr.id]="renderingId()"
      itemscope
      itemtype="https://schema.org/Article"
    >
      <div class="component-content">
        <div class="field-content" itemprop="articleBody">
          @if (contentField(); as content) {
          <div [scRichText]="content"></div>
          } @else { [Content] }
        </div>
      </div>
      @if (jsonLdPayload()) {
      <app-structured-data [scriptId]="jsonLdScriptId()" [data]="jsonLdPayload()" />
      }
    </article>
  `,
})
export class PageContentComponent extends SxaComponent {
  private readonly context = inject(SitecoreContextService);

  readonly contentField = computed((): TextField | undefined => {
    const fromFields = (this.fields() as unknown as PageContentFields)?.Content as
      | TextField
      | undefined;
    if (fromFields?.value != null && String(fromFields.value).length > 0) {
      return fromFields;
    }
    const route = this.context.page()?.layout?.sitecore?.route;
    return route?.fields?.Content as TextField | undefined;
  });

  readonly headline = computed(() => {
    const route = this.context.page()?.layout?.sitecore?.route;
    const titleField = route?.fields?.Title as Field<string> | undefined;
    return titleField?.value != null ? String(titleField.value) : undefined;
  });

  readonly jsonLdPayload = computed(() => {
    const headline = this.headline();
    const articleContent = this.contentField();
    const articleBodyHtml =
      articleContent?.value != null && String(articleContent.value).length > 0
        ? String(articleContent.value)
        : undefined;
    if (!headline && !articleBodyHtml) {
      return null;
    }
    return buildArticleJsonLd({
      headline,
      articleBodyHtml,
      inLanguage: this.context.page()?.locale,
    });
  });

  readonly jsonLdScriptId = computed(
    () => `jsonld-article-${this.renderingId() ?? 'page-content'}`
  );
}
