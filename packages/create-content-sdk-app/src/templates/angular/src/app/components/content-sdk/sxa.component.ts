import { Directive, computed, input } from '@angular/core';
import { ComponentRendering } from '@sitecore-content-sdk/angular';
import { computedRenderingId } from './utils';

/** SXA base: `fields` / `params` merge `rendering` with placeholder-bound inputs (same idea as React placeholder utils). */
@Directive()
export abstract class SxaComponent {
  readonly fields = input<Record<string, unknown>>();
  readonly params = input<Record<string, string>>();
  readonly rendering = input<ComponentRendering>();

  readonly renderingId = computedRenderingId(() => this.params());
  readonly styles = computed(() => this.params()?.Styles?.trim() ?? '');
}
