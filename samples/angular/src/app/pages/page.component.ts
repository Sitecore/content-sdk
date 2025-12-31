import { Component, computed, inject, effect } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Page, SitecoreContextService } from '@sitecore-content-sdk/angular';
import { toSignal } from '@angular/core/rxjs-interop';
import { LayoutComponent } from '../shared';

/**
 * Page component that sets the Sitecore context and renders the layout.
 * Gets page data from the route resolver and passes it to the layout.
 */
@Component({
  selector: 'app-page',
  standalone: true,
  imports: [LayoutComponent],
  template: `
    @let pageValue = page(); @if (pageValue) {
    <app-layout [page]="pageValue"></app-layout>
    }
  `,
})
export class PageComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly sitecoreContext = inject(SitecoreContextService);
  private data = toSignal(this.activatedRoute.data);
  page = computed(() => this.data()?.page as Page | null);

  constructor() {
    effect(() => {
      const page = this.page();
      if (page) {
        this.sitecoreContext.setPage(page);
      }
    });
  }
}
