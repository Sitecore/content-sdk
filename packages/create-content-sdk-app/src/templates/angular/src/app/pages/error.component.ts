import { Component } from '@angular/core';

/**
 * Error page component for displaying 500 server errors.
 * Provides user-friendly messaging and navigation options.
 */
@Component({
  selector: 'app-error',
  template: `
    <div class="error-container">
      <div class="error-content">
        <h1 class="error-code">{{ errorCode }}</h1>
        <h2 class="error-title">{{ errorTitle }}</h2>
        <p class="error-message">{{ errorMessage }}</p>
        <div class="error-actions">
          <button class="btn btn-primary" (click)="goHome()">Go Home</button>
          <button class="btn btn-secondary" (click)="retry()">Retry</button>
        </div>
      </div>
    </div>
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
        max-width: 500px;
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
  readonly errorCode = 500;
  readonly errorTitle = 'Internal Server Error';
  readonly errorMessage = 'Something went wrong on our end. Please try again later.';

  /**
   * Navigate back to the home page.
   */
  goHome(): void {
    window.location.href = '/';
  }

  /**
   * Retry the last action.
   */
  retry(): void {
    window.location.reload();
  }
}
