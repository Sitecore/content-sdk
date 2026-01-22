import { Component, inject, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { injectLoad } from '@analogjs/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { DictionaryPhrases, DictionaryContextService } from '@sitecore-content-sdk/angular';

import type { load } from './(main).server';

/**
 * Shared layout component that wraps all pages in the (main) route group.
 * Loads dictionary data once and provides it to all child pages via DictionaryContextService.
 */
@Component({
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
})
export default class MainLayoutComponent {
  private readonly dictionaryContext = inject(DictionaryContextService);

  // Use Analog's injectLoad to get dictionary data from the layout's .server.ts file
  private readonly loaderData = toSignal(injectLoad<typeof load>());

  constructor() {
    // Set dictionary context when data is available
    effect(() => {
      const data = this.loaderData();
      if (data?.dictionary) {
        console.log('Layout: Setting dictionary context');
        this.dictionaryContext.setPhrases(data.dictionary as DictionaryPhrases);
      }
    });
  }
}
