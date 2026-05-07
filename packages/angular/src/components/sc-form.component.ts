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
  readonly rendering = input<ComponentRendering>();
  readonly params = input<{ [key: string]: string }>({});

  @ViewChild('formContainer', { static: true })
  private formContainerRef!: ElementRef<HTMLDivElement>;

  private readonly config = inject(SITECORE_CONFIG_TOKEN, { optional: true });
  private readonly context = inject(SitecoreContextService);
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
