import { Component, inject, effect } from '@angular/core';
import { injectLoad } from '@analogjs/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Page, SitecoreContextService } from '@sitecore-content-sdk/angular';
import { LayoutComponent } from '../../shared';

import type { load } from './[...path].server';

/**
 * Catch-all page component that renders Sitecore layouts.
 * Dictionary is provided by the parent layout.
 */
@Component({
  standalone: true,
  imports: [LayoutComponent],
  template: `
    @if (page()) {
      <app-layout [page]="page()!"></app-layout>
    } @else {
      <div class="loading">
        <p>Loading...</p>
      </div>
    }
  `,
  styles: `
    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
  `,
})
export default class CatchAllPageComponent {
  private readonly sitecoreContext = inject(SitecoreContextService);

  private readonly loaderData = toSignal(injectLoad<typeof load>());

  page = () => this.loaderData()?.page as Page | null | undefined;

  constructor() {
    effect(() => {
      const data = this.loaderData();
      if (data?.page) {
        this.sitecoreContext.setPage(data.page as Page);
      }
    });
  }
}
