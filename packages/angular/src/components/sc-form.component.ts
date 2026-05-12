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
import { SitecoreContextService } from '../lib/sitecore-context.service';

const { executeScriptElements, loadForm, subscribeToFormSubmitEvent } = form;

/**
 * Angular wrapper for Sitecore Forms.
 * Loads form HTML from Edge, executes embedded scripts, and subscribes to form events.
 *
 * Usage: register in the component map with the rendering name "Form".
 * @public
 */
@Component({
  selector: 'sc-form',
  standalone: true,
  template: `
    <div #formContainer [class]="styles()" [id]="renderingId()"></div>
  `,
})
export class ScFormComponent {
  @ViewChild('formContainer', { static: true })
  private formContainerRef!: ElementRef<HTMLDivElement>;

  readonly rendering = input<ComponentRendering>();
  readonly params = input<{ [key: string]: string }>({});
  readonly fields = input<{ [key: string]: unknown }>({});

  private readonly config = inject(SITECORE_CONFIG_TOKEN, { optional: true });
  private readonly context = inject(SitecoreContextService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;

      const p = this.params();
      const formId = p?.FormId;
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
      this.destroyRef.onDestroy(() => {
        cancelled = true;
      });

      loadForm(edgeId, formId, edgeUrl)
        .then((html: string) => {
          if (cancelled) return;
          const el = this.formContainerRef?.nativeElement;
          if (!el) return;

          el.innerHTML = html;

          const isEditing = this.context.isEditing();
          if (!isEditing) {
            subscribeToFormSubmitEvent(el, this.rendering()?.uid);
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

  readonly styles = () => {
    const s = this.params()?.styles;
    return s ? s.replace(/\s+$/, '') : '';
  };
  readonly renderingId = () => this.params()?.RenderingIdentifier || undefined;
}
