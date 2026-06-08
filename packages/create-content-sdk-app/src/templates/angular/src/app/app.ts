import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ScEditingScriptsComponent } from '@sitecore-content-sdk/angular';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ScEditingScriptsComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('angular-sample');
}
