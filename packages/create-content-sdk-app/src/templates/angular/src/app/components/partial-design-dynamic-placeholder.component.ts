import { Component, computed, input } from '@angular/core';
import { ComponentRendering, ScPlaceholderComponent } from '@sitecore-content-sdk/angular';

/**
 * Parity with kit-nextjs-skate-park PartialDesignDynamicPlaceholder:
 * renders a single placeholder whose name comes from rendering.params.sig.
 */
@Component({
  selector: 'app-partial-design-dynamic-placeholder',
  imports: [ScPlaceholderComponent],
  template: `
    @if (placeholderSignature()) {
    <sc-placeholder [name]="placeholderSignature()!" [rendering]="rendering()!"></sc-placeholder>
    }
  `,
})
export class PartialDesignDynamicPlaceholderComponent {
  /** Required by `sc-placeholder` for every mapped component (merged layout values). */
  readonly fields = input<{ [key: string]: unknown }>({});
  readonly params = input<{ [key: string]: string }>({});
  readonly rendering = input<ComponentRendering>();

  /** Key from merged `rendering.params` and placeholder `params` input. */
  readonly placeholderSignature = computed(() => {
    const merged = {
      ...(this.rendering()?.params ?? {}),
      ...(this.params() ?? {}),
    } as { sig?: string };
    return merged.sig?.trim() ?? '';
  });
}

export default PartialDesignDynamicPlaceholderComponent;
