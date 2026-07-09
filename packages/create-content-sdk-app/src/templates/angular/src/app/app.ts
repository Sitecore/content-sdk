import { Component, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CdpPageViewComponent } from './components/content-sdk/cdp-page-view.component';
import { ScEditingScriptsComponent, SitecoreContextService } from '@sitecore-content-sdk/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ScEditingScriptsComponent, CdpPageViewComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('angular-sample');
  private context = inject(SitecoreContextService);

  constructor(translate: TranslateService) {
    effect(() => {
      const lang = this.context.page()?.locale;
      if (lang) {
        translate.use(lang);
      }
    });
  }
}
