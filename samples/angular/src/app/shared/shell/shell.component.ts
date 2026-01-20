import { Component, inject, effect } from '@angular/core';
import { RouterOutlet, ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { DictionaryContextService, DictionaryPhrases } from '@sitecore-content-sdk/angular';

/**
 * Shell component that serves as the root layout for all routes.
 * Loads shared data like dictionary and provides it to child routes.
 */
@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
})
export class ShellComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly dictionaryContext = inject(DictionaryContextService);
  private readonly data = toSignal(this.route.data);

  constructor() {
    effect(() => {
      const data = this.data();
      if (data?.dictionary) {
        this.dictionaryContext.setPhrases(data.dictionary as DictionaryPhrases);
      }
    });
  }
}
