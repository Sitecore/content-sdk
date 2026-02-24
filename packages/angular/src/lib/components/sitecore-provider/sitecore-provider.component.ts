import { Component, effect, inject, input } from '@angular/core';
import { Page } from '@sitecore-content-sdk/content/client';
import { SitecoreContextService } from '../../services/sitecore-context.service';
import { ComponentMapService } from '../../services/component-map.service';
import { ComponentMap } from '../../types';

/**
 * Root provider component for the Sitecore Angular SDK.
 *
 * Place this component near the top of your application tree (e.g. in `AppComponent`)
 * and supply the current `page` and optional `componentMap`. It writes those values into
 * `SitecoreContextService` and `ComponentMapService` so every descendant can inject them.
 * @example
 * <sc-sitecore-provider [page]="page" [componentMap]="componentMap">
 *   <router-outlet />
 * </sc-sitecore-provider>
 * @public
 */
@Component({
  selector: 'sc-sitecore-provider',
  standalone: true,
  template: '<ng-content />',
})
export class SitecoreProviderComponent {
  /**
   * The current Sitecore page. Required.
   */
  readonly page = input.required<Page>();

  /**
   * Map from Sitecore component names to Angular component classes.
   */
  readonly componentMap = input<ComponentMap>(new Map());

  private readonly contextService = inject(SitecoreContextService);
  private readonly componentMapService = inject(ComponentMapService);

  constructor() {
    effect(() => {
      this.contextService.setPage(this.page());
    });

    effect(() => {
      this.componentMapService.setComponentMap(this.componentMap());
    });
  }
}
