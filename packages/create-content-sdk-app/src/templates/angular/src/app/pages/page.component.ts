import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from '@sitecore-content-sdk/angular';
import { toSignal } from '@angular/core/rxjs-interop';
import { LayoutComponent } from '../shared/layout.component';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [LayoutComponent],
  template: `
    @let pageValue = page();
    @let dictValue = dictionary();
    <section style="margin: 1rem; padding: 1rem; border: 1px solid #ccc; border-radius: 4px;">
      <h2 style="margin-top: 0;">Current route</h2>
      <p><strong>URL:</strong> {{ router.url }}</p>

      @if (pageValue) {
        <h2>Page loader data (raw JSON)</h2>
        <pre style="margin: 0; font-size: 0.8rem; max-height: 400px; overflow: auto; background: #f5f5f5; padding: 0.5rem; border-radius: 4px;">{{ toJson(pageValue) }}</pre>
      } @else {
        <p><em>No page data returned by loader.</em></p>
      }

      <h2>Dictionary phrases (raw JSON)</h2>
      @if (dictValue && hasKeys(dictValue)) {
        <pre style="margin: 0; font-size: 0.8rem; max-height: 400px; overflow: auto; background: #f0f7ff; padding: 0.5rem; border-radius: 4px;">{{ toJson(dictValue) }}</pre>
      } @else {
        <p><em>No dictionary phrases returned by loader.</em></p>
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
  dictionary = computed(() => this.data()?.dictionary as Record<string, string> | null);

  toJson(value: unknown): string {
    return JSON.stringify(value, null, 2);
  }

  hasKeys(obj: Record<string, unknown>): boolean {
    return Object.keys(obj).length > 0;
  }
}
