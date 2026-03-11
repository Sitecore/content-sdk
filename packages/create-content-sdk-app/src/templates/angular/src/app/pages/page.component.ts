import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from '@sitecore-content-sdk/angular';
import { toSignal } from '@angular/core/rxjs-interop';
import { LayoutComponent } from '../shared/layout.component';

/**
 * Page component that sets the Sitecore context and dictionary phrases, then renders the layout.
 * Gets page and dictionary data from route resolvers.
 * Displays current route and fields returned by pageLoader.
 */
@Component({
  selector: 'app-page',
  standalone: true,
  imports: [LayoutComponent],
  template: `
    @let pageValue = page();
    <section class="page-loader-info" style="margin: 1rem; padding: 1rem; border: 1px solid #ccc; border-radius: 4px;">
      <h2 style="margin-top: 0;">Current route</h2>
      <p><strong>URL:</strong> {{ router.url }}</p>

      @if (pageValue) {
        <h2>Page loader data</h2>
        <dl style="display: grid; grid-template-columns: auto 1fr; gap: 0.25rem 1rem;">
          <dt>Route name</dt>
          <dd>{{ routeName(pageValue) }}</dd>
          <dt>Locale</dt>
          <dd>{{ pageValue.locale }}</dd>
          <dt>Site name</dt>
          <dd>{{ pageValue.siteName ?? '—' }}</dd>
          <dt>Mode</dt>
          <dd>{{ pageValue.mode?.name ?? '—' }}</dd>
          <dt>Route fields</dt>
          <dd><pre style="margin: 0; font-size: 0.875rem;">{{ routeFieldsJson(pageValue) }}</pre></dd>
        </dl>
      }
    </section>
    @if (pageValue) {
      <app-layout [page]="pageValue"></app-layout>
    }
  `,
})
export class PageComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  readonly router = inject(Router);
  private data = toSignal(this.activatedRoute.data);
  page = computed(() => this.data()?.page as Page | null);

  routeName(p: Page): string {
    return p?.layout?.sitecore?.route?.name ?? '—';
  }

  routeFieldsJson(p: Page): string {
    const fields = p?.layout?.sitecore?.route?.fields;
    if (fields == null || Object.keys(fields).length === 0) return '{}';
    return JSON.stringify(fields, null, 2);
  }
}
