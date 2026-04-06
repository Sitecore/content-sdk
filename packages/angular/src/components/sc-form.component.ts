import {
  Component,
  inject,
  input,
  signal,
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
    <div
      #formContainer
      [class]="styles()"
      [id]="renderingId()"
      [innerHTML]="content()"
    ></div>
  `,
})
export class ScFormComponent {
  readonly rendering = input<ComponentRendering>();
  readonly params = input<{ [key: string]: string }>({});
  readonly fields = input<{ [key: string]: unknown }>({});

  @ViewChild('formContainer', { static: true })
  private formContainerRef!: ElementRef<HTMLDivElement>;

  private readonly config = inject(SITECORE_CONFIG_TOKEN, { optional: true });
  private readonly context = inject(SitecoreContextService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  readonly content = signal('');

  readonly styles = () => {
    const s = this.params()?.['styles'];
    return s ? s.replace(/\s+$/, '') : '';
  };
  readonly renderingId = () => this.params()?.['RenderingIdentifier'] || undefined;

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;

      const p = this.params();
      const formId = p?.['FormId'];
      if (!formId) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Sitecore config shape varies by app
      const cfg = this.config as any;
      const edgeId = cfg?.api?.edge?.clientContextId ?? cfg?.edge?.clientContextId;
      const edgeUrl = cfg?.api?.edge?.edgeUrl ?? cfg?.edge?.edgeUrl;

      if (!edgeId) {
        console.warn(
          'Warning: clientContextId is missing – form cannot be loaded properly on the client'
        );
        return;
      }

      let cancelled = false;
      let scriptTimeoutId: ReturnType<typeof setTimeout> | undefined;
      this.destroyRef.onDestroy(() => {
        cancelled = true;
        if (scriptTimeoutId !== undefined) {
          clearTimeout(scriptTimeoutId);
        }
      });

      loadForm(edgeId, formId, edgeUrl)
        .then((html: string) => {
          if (cancelled) return;
          this.content.set(html);
          scriptTimeoutId = setTimeout(() => {
            scriptTimeoutId = undefined;
            if (cancelled) return;
            const el = this.formContainerRef?.nativeElement;
            if (!el) return;
            const isEditing = this.context.isEditing();
            if (!isEditing) {
              subscribeToFormSubmitEvent(el, this.rendering()?.uid);
            }
            executeScriptElements(el);
          }, 0);
        })
        .catch(() => {
          console.error(
            `Failed to load form with id ${formId}. Check debug logs for content-sdk:form for more details.`
          );
        });
    });
  }
}
