import { isPlatformBrowser, NgComponentOutlet } from '@angular/common';
import { Component, Input, OnChanges, PLATFORM_ID, Type, inject, signal } from '@angular/core';
import { RuntimeCompileComponentFactory } from './component-factory';

/**
 * Design Library renderer (Angular POC).
 *
 * Functional counterpart of Content SDK's Next.js `DesignLibrary`
 * (packages/react/src/components/DesignLibrary/DesignLibrary.tsx): it takes a
 * component provided as source text and renders it at runtime.
 *
 * The pipeline is split in two:
 *   1. {@link RuntimeCompileComponentFactory} compiles the source text into a
 *      component class (the Angular equivalent of building it via `new Function`
 *      from generated code + an import map),
 *   2. `NgComponentOutlet` renders that class and keeps its `inputs` bound —
 *      updating the live instance rather than recreating it when only inputs change.
 *
 * Compilation is gated on the source text (`renderedSource`): as long as the
 * source is unchanged the compiled class identity is stable, so inputs-only
 * changes flow straight through the outlet without a recompile/recreate.
 *
 * Accepts the component either inline (`componentText`) or as a path/URL
 * (`componentPath`) that is fetched. `inputs` are forwarded to the rendered
 * component (e.g. the SXA `fields` / `params` / `rendering` inputs).
 */
@Component({
  selector: 'app-design-lib',
  imports: [NgComponentOutlet],
  template: `
    @if (dynamicComponent(); as component) {
      <ng-container *ngComponentOutlet="component; inputs: inputs" />
    } @else if (error(); as message) {
      <pre class="design-lib-error">{{ message }}</pre>
    }
  `,
})
export class DesignLibrary implements OnChanges {
  /** Raw Angular component source (TS text). Takes precedence over `componentPath`. */
  @Input() componentText?: string;
  /** Path/URL to fetch component source from when `componentText` is not provided. */
  @Input() componentPath?: string;
  /** Inputs forwarded to the rendered component (e.g. fields, params, rendering). */
  @Input() inputs: Record<string, unknown> = {};

  readonly dynamicComponent = signal<Type<unknown> | null>(null);
  readonly error = signal<string | null>(null);

  private readonly compileFactory = inject(RuntimeCompileComponentFactory);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  /** Source the current `dynamicComponent` was compiled from; guards needless recompiles. */
  private renderedSource?: string;

  async ngOnChanges(): Promise<void> {
    // Runtime compilation is browser-only (needs the TS compiler + JIT); skip on the server.
    if (!this.isBrowser) return;
    try {
      const source = await this.resolveSource();
      // Only recompile when the source changed; inputs-only changes update the live
      // component through the outlet's `inputs` binding (no recreate).
      if (source !== this.renderedSource) {
        this.renderedSource = source;
        this.dynamicComponent.set(source ? await this.compileFactory.compile(source) : null);
      }
      this.error.set(null);
    } catch (e) {
      this.dynamicComponent.set(null);
      this.renderedSource = undefined;
      this.error.set(String(e));
    }
  }

  /** Returns the component source from `componentText`, else fetched from `componentPath`. */
  private async resolveSource(): Promise<string | undefined> {
    if (this.componentText) return this.componentText;
    if (!this.componentPath) return undefined;

    const response = await fetch(this.componentPath);
    if (!response.ok) {
      throw new Error(`Failed to load component from ${this.componentPath}: ${response.status}`);
    }
    return response.text();
  }
}
