import {
  Component,
  inject,
  input,
  ElementRef,
  ViewChild,
  afterNextRender,
  PLATFORM_ID,
  DestroyRef,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ComponentRendering } from '@sitecore-content-sdk/content/layout';
import { form } from '@sitecore-content-sdk/content';
import { SITECORE_CONFIG_TOKEN } from '../lib/tokens';
import { SITECORE_ANALYTICS } from '../lib/analytics/sitecore-analytics';
import { SitecoreContextService } from '../lib/sitecore-context.service';

const { executeScriptElements, loadForm } = form;

/* eslint-disable @typescript-eslint/member-ordering -- ViewChild + signal inputs + constructor ordering conflicts with default groups */
/**
 * Angular wrapper for Sitecore Forms.
 * Loads form HTML from Edge, executes embedded scripts, and subscribes to form events.
 *
 * Usage: register in the component map with the rendering name "Form".
 * @public
 */
@Component({
  selector: 'sc-form',
  template: ` <div #formContainer [class]="styles()" [id]="renderingId()"></div> `,
})
export class ScFormComponent {
  @ViewChild('formContainer', { static: true })
  private formContainerRef!: ElementRef<HTMLDivElement>;

  readonly rendering = input<ComponentRendering>();
  readonly params = input<{ [key: string]: string }>({});

  private readonly config = inject(SITECORE_CONFIG_TOKEN, { optional: true });
  private readonly context = inject(SitecoreContextService);
  private readonly analytics = inject(SITECORE_ANALYTICS, { optional: true });
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  /**
   * Merges `rendering.params` with the `params` input: the component `params()` values override layout for the same key.
   */
  private mergedFormParams(): { [key: string]: string } {
    return { ...(this.rendering()?.params ?? {}), ...this.params() };
  }

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;

      const p = this.mergedFormParams();
      const formId = p.FormId;
      if (!formId) return;

      const cfg = this.config;
      const edgeId = cfg?.api?.edge?.clientContextId;
      const edgeUrl = cfg?.api?.edge?.edgeUrl;

      if (!edgeId) {
        console.warn(
          'Warning: clientContextId is missing – form cannot be loaded properly on the client'
        );
        return;
      }

      let cancelled = false;
      const abort = new AbortController();
      this.destroyRef.onDestroy(() => {
        cancelled = true;
        abort.abort();
      });

      loadForm(edgeId, formId, edgeUrl)
        .then((html: string) => {
          if (cancelled) return;
          const el = this.formContainerRef?.nativeElement;
          if (!el) return;

          el.innerHTML = html;

          const isEditing = this.context.isEditing();
          if (!isEditing) {
            this.subscribeToFormEvents(el, this.rendering()?.uid, abort.signal);
          }

          executeScriptElements(el);
        })
        .catch(() => {
          console.error(
            `Failed to load form with id ${formId}. Check debug logs for content-sdk:form for more details.`
          );
        });
    });
  }

  /**
   * Listens for the form's `form:engage` events (VIEWED / SUBMITTED) and dispatches them through
   * the {@link SITECORE_ANALYTICS} façade, which lazily initializes the events SDK on first use
   * (a no-op on the server and when analytics is disabled). This is the analytics seam for
   * Angular — unlike Next.js there is no global events bootstrap.
   * @param {HTMLElement} formElement - Container holding the rendered form markup.
   * @param {string} [componentId] - Rendering uid used as the CDP component instance id.
   * @param {AbortSignal} [signal] - Removes the listener when the component is destroyed.
   */
  private subscribeToFormEvents(
    formElement: HTMLElement,
    componentId?: string,
    signal?: AbortSignal
  ): void {
    formElement.addEventListener(
      'form:engage',
      ((e: CustomEvent<{ formId: string; name: 'VIEWED' | 'SUBMITTED' }>) => {
        const { formId, name } = e.detail;
        if (formId && name) {
          void this.analytics?.form(formId, name, componentId?.replace(/-/g, '') || '');
        }
      }) as EventListener,
      { signal }
    );
  }

  readonly styles = () => {
    const p = this.mergedFormParams();
    const s = p.styles;
    return s ? s.replace(/\s+$/, '') : '';
  };
  readonly renderingId = () => {
    const p = this.mergedFormParams();
    return p.RenderingIdentifier || undefined;
  };
}
/* eslint-enable @typescript-eslint/member-ordering */
