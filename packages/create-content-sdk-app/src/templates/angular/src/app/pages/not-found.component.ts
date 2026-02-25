import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * 404 Not Found error page component.
 * Displays a user-friendly message when a page is not found.
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
  `]
})
export class NotFoundComponent {}