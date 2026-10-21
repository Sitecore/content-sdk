import { Component, PLATFORM_ID, Renderer2, computed, effect, inject } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { getContentSdkPagesClientData } from '@sitecore-content-sdk/content/editing';
import { SitecoreContextService } from './sitecore-context.service';

/**
 * Injects the Sitecore Pages editor's client-side bootstrap scripts inside the application's HTML.
 * Place this component once at the application root (e.g. in `app.component.html`) so it
 * survives every route navigation.
 * @example
 * ```html
 * <sc-editing-scripts />
 * <router-outlet />
 * ```
 * @public
 */
@Component({
  selector: 'sc-editing-scripts',
  template: '',
})
export class ScEditingScriptsComponent {
  private readonly context = inject(SitecoreContextService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly renderer = inject(Renderer2);
  private readonly document = inject(DOCUMENT);

  private readonly mode = computed(() => this.context.page()?.mode);
  private readonly injectedScripts: HTMLScriptElement[] = [];

  constructor() {
    effect(() => {
      this.clearScripts();

      const pageMode = this.mode();
      if (this.isBrowser || !pageMode || !pageMode.isEditing) return;

      const { clientScripts, clientData } = this.context.page()?.layout?.sitecore?.context ?? {};

      for (const src of clientScripts ?? []) {
        const scriptElement = this.renderer.createElement('script');
        scriptElement.src = src;
        this.renderer.appendChild(this.document.body, scriptElement);
        this.injectedScripts.push(scriptElement);
      }

      const csdkClientData = { ...clientData, ...getContentSdkPagesClientData() };
      for (const [id, data] of Object.entries(csdkClientData)) {
        const scriptElement = this.renderer.createElement('script');
        this.renderer.setAttribute(scriptElement, 'id', id);
        this.renderer.setAttribute(scriptElement, 'type', 'application/json');
        scriptElement.innerHTML = JSON.stringify(data);
        this.renderer.appendChild(this.document.body, scriptElement);
        this.injectedScripts.push(scriptElement);
      }
    });
  }

  private clearScripts(): void {
    for (const el of this.injectedScripts) {
      el.parentNode?.removeChild(el);
    }
    this.injectedScripts.length = 0;
  }
}
