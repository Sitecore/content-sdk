import { Component, input, inject, effect } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import type { Page } from '@sitecore-content-sdk/content/client';
import { SitecoreContextService } from './sitecore-context.service';

/**
 * Wraps page/error markup: applies resolved `page` and dictionary phrases to context and ngx-translate.
 * @example
 * ```html
 * @if (data(); as d) {
 *   <sc-page-context [data]="d">
 *     <sc-placeholder name="headless-main" [rendering]="d.page.layout.sitecore.route" />
 *   </sc-page-context>
 * }
 * ```
 * @public
 */
@Component({
  selector: 'sc-page-context',
  standalone: true,
  template: '<ng-content />',
})
export class ScPageContextComponent {
  /** Resolved route data (page + optional dictionary). */
  readonly data = input.required<{ page: Page; dictionary?: Record<string, string> }>();

  private readonly context = inject(SitecoreContextService);
  private readonly translate = inject(TranslateService, { optional: true });

  constructor() {
    effect(() => {
      const { page, dictionary } = this.data();
      this.context.setPage(page);

      if (this.translate && dictionary && Object.keys(dictionary).length > 0) {
        const locale = page.locale;
        this.translate.setTranslation(locale, dictionary, false);
        if (this.translate.getCurrentLang() !== locale) {
          this.translate.use(locale).subscribe();
        }
      }
    });
  }
}
