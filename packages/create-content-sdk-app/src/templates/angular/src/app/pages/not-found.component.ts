import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

const DEFAULT_TITLE = 'Page Not Found';
const DEFAULT_MESSAGE = 'Sorry, the page you\'re looking for doesn\'t exist or has been moved.';

/**
 * 404 Not Found error page component.
 * Reads page from the '404' loader; displays route.fields.error.value or default text.
 */
@Component({
  selector: 'app-404',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="not-found-container">
      <div class="not-found-content">
        <h1>404</h1>
        <h2>{{ title() }}</h2>
        <p>{{ message() }}</p>
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
  `],
})
export class NotFoundComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly routeData = toSignal(this.route.data);

  private readonly errorFromPage = computed(() => {
    const page = this.routeData()?.['page'] as { layout?: { sitecore?: { route?: { fields?: { error?: { value?: string } } } } } } | undefined;
    return page?.layout?.sitecore?.route?.fields?.error?.value;
  });

  readonly title = computed(() => DEFAULT_TITLE);
  readonly message = computed(() => (typeof this.errorFromPage() === 'string' ? this.errorFromPage()! : DEFAULT_MESSAGE));
}
