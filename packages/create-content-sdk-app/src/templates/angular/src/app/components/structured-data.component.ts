import {
  Component,
  ElementRef,
  Renderer2,
  effect,
  inject,
  input,
} from '@angular/core';

/**
 * Emits a JSON-LD script tag (kit-nextjs-skate-park StructuredData parity).
 * Uses the DOM API so Angular does not strip script tags from templates.
 */
@Component({
  selector: 'app-structured-data',
  template: '',
})
export class StructuredDataComponent {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);

  /** Script element id attribute (stable when data updates). */
  readonly scriptId = input.required<string>();

  /** JSON-LD object or null to remove script. */
  readonly data = input<object | null>(null);

  constructor() {
    effect(() => {
      const hostElement = this.host.nativeElement;
      while (hostElement.firstChild) {
        this.renderer.removeChild(hostElement, hostElement.firstChild);
      }

      const jsonLdPayload = this.data();
      if (!jsonLdPayload) {
        return;
      }

      const script = this.renderer.createElement('script');
      this.renderer.setAttribute(script, 'type', 'application/ld+json');
      this.renderer.setAttribute(script, 'id', this.scriptId());
      const textNode = this.renderer.createText(JSON.stringify(jsonLdPayload));
      this.renderer.appendChild(script, textNode);
      this.renderer.appendChild(hostElement, script);
    });
  }
}
