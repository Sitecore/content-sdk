import { Component, PLATFORM_ID, Renderer2, input, computed, effect, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  Page,
  Field,
  RouteData,
  ScPlaceholderComponent,
  SITECORE_CLIENT_TOKEN,
} from '@sitecore-content-sdk/angular';

interface RouteFields {
  [key: string]: unknown;
  Title?: Field<string>;
}

@Component({
  selector: 'app-layout',
  imports: [ScPlaceholderComponent],
  template: `
    <div [attr.class]="layoutClassAttr()">
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

  readonly layoutClassAttr = computed(() => {
    const editing = this.page().mode?.isEditing;
    const base = 'flex min-h-screen min-w-0 flex-col';
    return editing ? `${base} editing-mode` : `${base} prod-mode`;
  });

  private readonly titleService = inject(Title);
  private readonly sitecoreClient = inject(SITECORE_CLIENT_TOKEN, { optional: true });
  private readonly document = inject(DOCUMENT);
  private readonly renderer = inject(Renderer2);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor() {
    effect(() => {
      const route = this.scRoute();
      if (route) {
        const fields = route.fields as RouteFields | undefined;
        const title = fields?.Title?.value ?? 'Content SDK Page';
        this.titleService.setTitle(title);
      }
    });

    effect(() => {
      if (this.isBrowser || !this.sitecoreClient) return;
      const layout = this.page().layout;
      if (!layout) return;
      const links = this.sitecoreClient.getHeadLinks(layout, {
        enableStyles: true,
        enableThemes: false,
      });
      for (const link of links) {
        const el: HTMLLinkElement = this.renderer.createElement('link');
        this.renderer.setAttribute(el, 'rel', link.rel);
        this.renderer.setAttribute(el, 'href', link.href);
        this.renderer.appendChild((this.document as Document).head, el);
      }
    });
  }
}
