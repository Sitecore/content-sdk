import { Component, computed, effect, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';
import {
  LocalePathPipe,
  Page,
  ScPageContextComponent,
  SitecoreContextService,
} from '@sitecore-content-sdk/angular';
import { toSignal } from '@angular/core/rxjs-interop';
import { LayoutComponent } from '../shared/layout.component';

/**
 * 404 page. Uses the Sitecore not-found page when the loader returns layout data;
 * otherwise shows a static fallback (aligned with kit-nextjs not-found behavior).
 */
@Component({
  selector: 'app-404',
  imports: [RouterLink, LayoutComponent, ScPageContextComponent, LocalePathPipe],
  template: `
    @let pageValue = page();
    @let dict = dictionary();
    @if (pageValue) {
      <sc-page-context [data]="{ page: pageValue, dictionary: dict ?? undefined }">
        <app-layout [page]="pageValue"></app-layout>
      </sc-page-context>
    } @else {
      <div class="not-found-container">
        <div class="not-found-content">
          <h1>404</h1>
          <h2>Page Not Found</h2>
          <p>Sorry, the page you're looking for doesn't exist or has been moved.</p>
          <a [routerLink]="'/' | localePath" class="back-link">Return to Home</a>
        </div>
      </div>
    }
  `,
  styles: [
    `
    .not-found-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
    }
    .not-found-content {
      text-align: center;
      padding: 2rem;
      max-width: 700px;
    }
    h1 {
      font-size: 6rem;
      margin: 0;
      color: #333;
    }
    h2 {
      font-size: 2rem;
      margin: 1rem 0;
      color: #666;
    }
    p {
      font-size: 1.1rem;
      color: #999;
      margin-bottom: 2rem;
    }
    .back-link {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      background-color: #0061cc;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      transition: background-color 0.3s ease;
    }
    .back-link:hover {
      background-color: #0052a3;
    }
  `,
  ],
})
export class NotFoundComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly routeData = toSignal(this.route.data);
  private readonly context = inject(SitecoreContextService);

  page = computed(() => this.routeData()?.['page'] as Page | null);
  dictionary = computed(() => this.routeData()?.['dictionary'] as Record<string, string> | null);

  constructor() {
    effect(() => {
      if (!this.page()) {
        this.context.setPage(null);
      }
    });
  }
}
