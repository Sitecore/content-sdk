import { Component, input, computed, effect, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import {
  LocalePathPipe,
  Page,
  Field,
  RouteData,
  ScPlaceholderComponent,
} from '@sitecore-content-sdk/angular';

interface RouteFields {
  [key: string]: unknown;
  Title?: Field<string>;
}

@Component({
  selector: 'app-layout',
  imports: [ScPlaceholderComponent, TranslatePipe, RouterLink, LocalePathPipe],
  template: `
    <div [attr.class]="layoutClassAttr()">
      <header class="w-full">
        <div
          class="border-b border-zinc-200 px-4 py-2 text-xs text-zinc-500 dark:border-zinc-700 dark:text-zinc-400"
        >
          <span>{{ 'welcome' | translate }}</span>
          <span class="mx-2" aria-hidden="true">·</span>
          <a [routerLink]="'/' | localePath" class="text-sky-700 underline hover:no-underline dark:text-sky-400"
            >Home</a
          >
        </div>
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

  readonly layoutClassAttr = computed(() => {
    const editing = this.page().mode?.isEditing;
    const base = 'flex min-h-screen min-w-0 flex-col';
    return editing ? `${base} editing-mode` : `${base} prod-mode`;
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
