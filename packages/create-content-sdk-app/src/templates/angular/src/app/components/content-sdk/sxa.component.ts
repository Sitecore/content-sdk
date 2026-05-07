import { Directive, computed, input } from '@angular/core';
import { ComponentRendering } from '@sitecore-content-sdk/angular';
import { computedRenderingId } from './utils';

/** SXA base: `fields` / `params` merge `rendering` with placeholder-bound inputs (same idea as React placeholder utils). */
@Directive()
export abstract class SxaComponent {
  readonly _fields = input<Record<string, unknown>>({}, { alias: 'fields' });
  readonly _params = input<Record<string, string>>({}, { alias: 'params' });
  readonly rendering = input<ComponentRendering>();

  readonly fields = computed(() => ({
    ...(this.rendering()?.fields ?? {}),
    ...this._fields(),
  }));

  readonly params = computed(() => ({
    ...(this.rendering()?.params ?? {}),
    ...this._params(),
  }));

  readonly renderingId = computedRenderingId(() => this.params());
  readonly styles = computed(() => this.params()?.Styles?.trim() ?? '');
}
