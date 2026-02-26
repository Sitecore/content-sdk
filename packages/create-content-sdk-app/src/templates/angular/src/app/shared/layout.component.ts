import { Component, input, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { Page, Field } from '@sitecore-content-sdk/angular';

/**
 * Route fields interface for page title
 */
interface RouteFields {
  [key: string]: unknown;
  Title?: Field<string>;
}

/**
 * Layout component that provides the main structure for Sitecore pages.
 * Renders header, main content, and footer placeholders.
 * @public
 */
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="mainClass()">
      <!-- <sc-editing-scripts></sc-editing-scripts> -->
      <header>
        <div id="header">
          Header
        </div>
      </header>
      <main>
        <div id="content">
          Main content
        </div>
      </main>
      <footer>
        <div id="footer">
          footer
        </div>
      </footer>
    </div>
  `,
  styles: `
    :host {
      display: block;
      min-height: 100vh;
    }

    .editing-mode {
      /* Styles for editing mode */
    }

    .prod-mode {
      /* Styles for production mode */
    }

    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }

    header {
      width: 100%;
    }

    main {
      flex: 1;
      width: 100%;
    }

    footer {
      width: 100%;
    }
  `,
})
export class LayoutComponent {
  /**
   * Page data from Sitecore
   */
  readonly page = input.required<Page>();

  /**
   * Current route data derived from page
   */
  readonly route = computed(() => this.page().layout?.sitecore?.route ?? null);

  /**
   * Main container CSS class based on editing mode
   */
  readonly mainClass = computed(() => (this.page().mode?.isEditing ? 'editing-mode' : 'prod-mode'));

  private readonly titleService = inject(Title);

  constructor() {
    // Effect to update the page title when the page changes
    effect(() => {
      const route = this.route();
      if (route) {
        const fields = route.fields as RouteFields | undefined;
        const title = fields?.Title?.value ?? 'Page';
        this.titleService.setTitle(title);
      }
    });
  }
}
