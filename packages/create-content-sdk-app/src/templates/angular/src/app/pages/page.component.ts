import { Component, computed, inject, effect } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Page, SitecoreContextService } from '@sitecore-content-sdk/angular';
import { toSignal } from '@angular/core/rxjs-interop';
import { LayoutComponent } from '../shared/layout.component';

@Component({
  selector: 'app-page',
  imports: [LayoutComponent],
  template: `
    @let pageValue = page();
    @if (pageValue) {
      <app-layout [page]="pageValue"></app-layout>
    } @else {
      <p class="p-8 text-center text-sm text-zinc-500"><em>Loading page data...</em></p>
    }
  `,
})
export class PageComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly context = inject(SitecoreContextService);
  private data = toSignal(this.activatedRoute.data);

  page = computed(() => this.data()?.page as Page | null);
  dictionary = computed(() => this.data()?.dictionary as Record<string, string> | null);

  constructor() {
    effect(() => {
      this.context.setPage(this.page() ?? null);
    });
  }
}
