import { Component, computed, inject, effect } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Page,
  SitecoreContextService,
  DictionaryContextService,
  DictionaryPhrases,
} from '@sitecore-content-sdk/angular';
import { toSignal } from '@angular/core/rxjs-interop';
import { LayoutComponent } from '../shared/layout.component';

/**
 * Page component that sets the Sitecore context and dictionary phrases, then renders the layout.
 * Gets page and dictionary data from route resolvers.
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
  private readonly dictionaryContext = inject(DictionaryContextService);
  private data = toSignal(this.activatedRoute.data);
  page = computed(() => this.data()?.page as Page | null);

  constructor() {
    effect(() => {
      const data = this.data();
      if (data?.page) {
        this.sitecoreContext.setPage(data.page as Page);
      }
      if (data?.dictionary) {
        this.dictionaryContext.setPhrases(data.dictionary as DictionaryPhrases);
      }
    });
  }
}
