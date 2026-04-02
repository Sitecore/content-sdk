import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';
import { Page } from '@sitecore-content-sdk/angular';
import { toSignal } from '@angular/core/rxjs-interop';

/**
 * 404 Not Found error page component.
 * Reads page from the '404' loader and displays the raw JSON alongside default UI.
 */
@Component({
  selector: 'app-404',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="not-found-container">
      <div class="not-found-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>Sorry, the page you're looking for doesn't exist or has been moved.</p>
        <a routerLink="/" class="back-link">Return to Home</a>

        <h3 style="margin-top: 2rem;">Loader data (raw JSON)</h3>
        @if (page()) {
          <pre class="loader-json">{{ toJson(page()) }}</pre>
        } @else {
          <p><em>No data returned by 404 loader.</em></p>
        }
      </div>
    </div>
  `,
  styles: [`
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
    h1 { font-size: 6rem; margin: 0; color: #333; }
    h2 { font-size: 2rem; margin: 1rem 0; color: #666; }
    p { font-size: 1.1rem; color: #999; margin-bottom: 2rem; }
    .back-link {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      background-color: #0061cc;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      transition: background-color 0.3s ease;
    }
    .back-link:hover { background-color: #0052a3; }
    .loader-json {
      text-align: left;
      margin: 0.5rem 0 0;
      font-size: 0.8rem;
      max-height: 400px;
      overflow: auto;
      background: #fff;
      padding: 0.5rem;
      border-radius: 4px;
      border: 1px solid #ddd;
    }
  `],
})
export class NotFoundComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly routeData = toSignal(this.route.data);

  page = computed(() => this.routeData()?.['page'] as Page | null);

  toJson(value: unknown): string {
    return JSON.stringify(value, null, 2);
  }
}
