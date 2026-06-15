import { Component, effect, inject } from '@angular/core';
import {
  CdpHelper,
  SITECORE_ANALYTICS,
  SitecoreContextService,
} from '@sitecore-content-sdk/angular';
import config from '../../../../sitecore.config';

/**
 * CDP page view component. Dispatches a Sitecore CDP page view event on initial load and on
 * every client-side navigation. Template-less — it only performs the side effect.
 *
 * Angular analog of the Next.js `CdpPageView`: page data comes from
 * {@link SitecoreContextService}, dispatch goes through the {@link SITECORE_ANALYTICS} façade
 * (a no-op on the server and when analytics is disabled), and the work runs in an `effect` that
 * re-executes whenever the page signal changes.
 *
 * See Sitecore Content SDK documentation for details:
 * https://www.npmjs.com/package/@sitecore-content-sdk/events
 */
@Component({
  selector: 'app-cdp-page-view',
  template: '',
})
export class CdpPageViewComponent {
  private readonly analytics = inject(SITECORE_ANALYTICS);
  private readonly context = inject(SitecoreContextService);

  constructor() {
    effect(() => {
      const page = this.context.page();
      // Do not create events in editing or preview mode, or if missing route data.
      if (!page || !page.mode.isNormal) {
        return;
      }
      const route = page.layout.sitecore.route;
      if (!route?.itemId) {
        return;
      }

      const language = page.locale || config.defaultLanguage;
      const pageVariantId = CdpHelper.getPageVariantId(
        route.itemId,
        language,
        page.layout.sitecore.context.variantId as string,
        config.personalize.scope
      );

      // Events may not be initialized (the façade is a no-op in dev / when Edge config is
      // missing, and swallows runtime failures at debug level).
      void this.analytics.pageView({
        channel: 'WEB',
        currency: 'USD',
        page: route.name,
        pageVariantId,
        language,
      });
    });
  }
}