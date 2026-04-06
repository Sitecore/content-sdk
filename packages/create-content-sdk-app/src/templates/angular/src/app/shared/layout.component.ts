import { Component, input, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { Page, Field, RouteData, ScPlaceholderComponent } from '@sitecore-content-sdk/angular';

interface RouteFields {
  [key: string]: unknown;
  Title?: Field<string>;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, ScPlaceholderComponent],
  template: `
    <div [ngClass]="layoutClasses()">
      <header class="w-full">
        <div id="header">
          @if (scRoute()) {
            <sc-placeholder name="headless-header" [rendering]="scRoute()!"></sc-placeholder>
          }
        </div>
      </header>
      <main class="min-w-0 w-full flex-1">
        <div id="content" class="w-full min-w-0 max-w-none">
          @if (scRoute()) {
            <sc-placeholder name="headless-main" [rendering]="scRoute()!"></sc-placeholder>
          }
        </div>
      </main>
      <footer class="w-full">
        <div id="footer">
          @if (scRoute()) {
            <sc-placeholder name="headless-footer" [rendering]="scRoute()!"></sc-placeholder>
          }
        </div>
      </footer>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class LayoutComponent {
  readonly page = input.required<Page>();

  readonly scRoute = computed(() => this.page().layout?.sitecore?.route as RouteData | null);

  readonly layoutClasses = computed(() => {
    const editing = this.page().mode?.isEditing;
    return {
      'editing-mode': !!editing,
      'prod-mode': !editing,
      'flex min-h-screen min-w-0 flex-col': true,
    };
  });

  private readonly titleService = inject(Title);

  constructor() {
    effect(() => {
      const route = this.scRoute();
      if (route) {
        const fields = route.fields as RouteFields | undefined;
        const title = fields?.Title?.value ?? 'Content SDK Page';
        this.titleService.setTitle(title);
      }
    });
  }
}
