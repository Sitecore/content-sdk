import { Component, computed, effect, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Page, SitecoreContextService } from '@sitecore-content-sdk/angular';
import { toSignal } from '@angular/core/rxjs-interop';
import { LayoutComponent } from '../shared/layout.component';

/**
 * 500 error page. Uses the Sitecore server-error page when the loader returns layout data;
 * otherwise shows a static fallback (aligned with kit-nextjs global-error behavior).
 */
@Component({
  selector: 'app-error',
  imports: [LayoutComponent],
  template: `
    @let pageValue = page();
    @if (pageValue) {
      <app-layout [page]="pageValue"></app-layout>
    } @else {
      <div class="error-container">
        <div class="error-content">
          <h1 class="error-code">500</h1>
          <h2 class="error-title">Internal Server Error</h2>
          <p class="error-message">Something went wrong on our end. Please try again later.</p>
          <div class="error-actions">
            <button type="button" class="btn btn-primary" (click)="goHome()">Go Home</button>
            <button type="button" class="btn btn-secondary" (click)="retry()">Retry</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
    .error-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }
    .error-content {
      text-align: center;
      background: white;
      padding: 3rem;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      max-width: 700px;
    }
    .error-code {
      font-size: 4rem;
      font-weight: bold;
      color: #e74c3c;
      margin: 0;
    }
    .error-title {
      font-size: 1.5rem;
      color: #2c3e50;
      margin: 1rem 0;
    }
    .error-message {
      color: #7f8c8d;
      margin: 1.5rem 0 2rem;
    }
    .error-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }
    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    .btn-primary {
      background-color: #3498db;
      color: white;
    }
    .btn-primary:hover {
      background-color: #2980b9;
    }
    .btn-secondary {
      background-color: #95a5a6;
      color: white;
    }
    .btn-secondary:hover {
      background-color: #7f8c8d;
    }
  `,
  ],
})
export class ErrorComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly routeData = toSignal(this.route.data);
  private readonly context = inject(SitecoreContextService);

  page = computed(() => this.routeData()?.['page'] as Page | null);

  constructor() {
    effect(() => {
      this.context.setPage(this.page() ?? null);
    });
  }

  goHome(): void {
    window.location.href = '/';
  }

  retry(): void {
    window.location.reload();
  }
}
