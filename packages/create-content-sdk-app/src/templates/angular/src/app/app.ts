import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ScEditingScriptsComponent } from '@sitecore-content-sdk/angular';
import { CdpPageViewComponent } from './components/content-sdk/cdp-page-view.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ScEditingScriptsComponent, CdpPageViewComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('angular-sample');
}
