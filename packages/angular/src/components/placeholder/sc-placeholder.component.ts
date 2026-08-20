import { Component, Injector, Type, computed, effect, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentRendering, RouteData } from '@sitecore-content-sdk/content/layout';
import { resetEditorChromes } from '@sitecore-content-sdk/content/editing';
import { SitecoreContextService } from '../../lib/sitecore-context.service';
import { SITECORE_COMPONENT_MAP } from '../tokens';
import type { AngularContentSdkComponent, ComponentMap } from '../types';
import {
  getPlaceholderRenderings,
  getChildComponentProps,
  resolveComponentForRendering,
  isPlaceholderDeclaredInLayout,
  type PassThroughProps,
} from './placeholder-utils';
import { ScPlaceholderMetadata } from './sc-placeholder-metadata';
import { ScMissingComponentComponent } from '../sc-missing-component.component';
import { ScHiddenRenderingComponent } from '../sc-hidden-rendering.component';
import {
  PLACEHOLDER_DATA_RESOLVER,
  PLACEHOLDER_GUARD_RESOLVER,
  type PlaceholderResolverContext,
} from './placeholder-tokens';

/**
 * Angular placeholder component. Renders components from layout data for a given placeholder name.
 *
 * Usage:
 * ```html
 * <sc-placeholder name="headless-main" [rendering]="route"></sc-placeholder>
 * ```
 *
 * Optional `[passThroughProps]` sets extra `input()` values on each child (merged after
 * `fields`, `params`, and `rendering`).
 *
 * **Editing chrome (Metadata mode only).** When the page is in editing mode, the placeholder
 * emits Sitecore Pages chrome markers using a declarative `<ng-template>` rendered into the
 * same `ViewContainerRef` that hosts the dynamic child components. The structure matches
 * Metadata-mode output:
 *
 * ```
 * <code class="scpm" chrometype="placeholder" kind="open" id="…" />   ← once, outer
 *   <code class="scpm" chrometype="rendering" kind="open" id="<uid>"/>
 *   <child-component />
 *   <code class="scpm" chrometype="rendering" kind="close" />
 *   …
 * <code class="scpm" chrometype="placeholder" kind="close" />          ← once, outer
 * ```
 *
 * An empty placeholder still emits the outer placeholder pair in editing mode so authors can
 * target the empty region in Sitecore Pages.
 *
 * **Guards & data resolvers.** Inject `PLACEHOLDER_GUARD_RESOLVER` and/or
 * `PLACEHOLDER_DATA_RESOLVER` to filter or decorate the renderings before they are
 * instantiated. Resolvers are synchronous; if you need async data, fetch it in the page
 * loader and feed cached results into the resolver.
 * @public
 */
@Component({
  selector: 'sc-placeholder',
  host: { '[class.sc-jss-empty-placeholder]': 'emptyInEditing()' },
  imports: [CommonModule, ScPlaceholderMetadata],
  template: `
    @if(isEditing()){
    <sc-placeholder-metadata [rendering]="componentRendering()" [placeholderName]="name()">
      @for(cmpRendering of resolvedRenderings(); track cmpRendering.rendering.uid) {
      <sc-placeholder-metadata [rendering]="cmpRendering.rendering">
        @if(cmpRendering.component) {
        <ng-container
          [ngComponentOutlet]="cmpRendering.component"
          [ngComponentOutletInputs]="cmpRendering.inputs"
          [ngComponentOutletInjector]="injector"
        ></ng-container>
        }
      </sc-placeholder-metadata>
      }
    </sc-placeholder-metadata>
    } @else { @for(cmpRendering of resolvedRenderings(); track cmpRendering.rendering.uid) {
    @if(cmpRendering.component) {
    <ng-container
      [ngComponentOutlet]="cmpRendering.component"
      [ngComponentOutletInputs]="cmpRendering.inputs"
      [ngComponentOutletInjector]="injector"
    ></ng-container>
    } } }
  `,
})
export class ScPlaceholderComponent {
  /** Name of the placeholder to render. */
  readonly name = input.required<string>();

  /** Rendering or route data containing placeholders. */
  readonly rendering = input.required<ComponentRendering | RouteData>();
  readonly componentRendering = computed(() => this.rendering() as ComponentRendering);

  /** Optional placeholder-level fields merged into each child. */
  readonly fields = input<{ [key: string]: unknown }>();

  /** Optional placeholder-level params merged into each child's `params` input. */
  readonly params = input<{ [key: string]: string }>();
  protected readonly resolvedRenderings = signal<
    Array<{
      rendering: ComponentRendering;
      component: Type<unknown> | null;
      inputs: Record<string, unknown>;
    }>
  >([]);
  /**
   * Extra inputs to set on each dynamically created component, after the standard `fields`,
   * `params`, and `rendering` inputs. Keys must match `input()` names on the target components.
   */
  readonly passThroughProps = input<PassThroughProps>({});

  /** Override component map (defaults to injected `SITECORE_COMPONENT_MAP`). */
  readonly componentMap = input<ComponentMap>();

  /** Override for missing component rendering. */
  readonly missingComponent = input<Type<unknown>>();

  /** Override for hidden rendering component. */
  readonly hiddenRenderingComponent = input<Type<unknown>>();

  private readonly context = inject(SitecoreContextService);
  private readonly contextComponentMap = inject(SITECORE_COMPONENT_MAP, { optional: true });
  private readonly guardResolver = inject(PLACEHOLDER_GUARD_RESOLVER);
  private readonly dataResolver = inject(PLACEHOLDER_DATA_RESOLVER);

  protected readonly isEditing = computed(() => this.context.isEditing());

  /** True when the placeholder has no renderings and the page is in editing mode. */
  protected readonly emptyInEditing = signal(false);
  protected readonly injector = inject(Injector);

  constructor() {
    effect(() => {
      const rendering = this.rendering();
      const name = this.name();
      const isEditing = this.isEditing();
      const componentMap =
        this.componentMap() ??
        this.contextComponentMap ??
        new Map<string, AngularContentSdkComponent>();

      this.updateView({ rendering, name, isEditing, componentMap });
    });
  }

  /**
   * Render the placeholder slot. Composes:
   *   `[outer placeholder open] → [rendering open + child + rendering close]* → [outer placeholder close]`
   * @param {object} args - Render arguments captured from the reactive effect.
   * @param {object} args.container - Target view container.
   * @param {object} args.editingChromeBlock - The chrome `<ng-template>`.
   * @param {object} args.rendering - Parent rendering / route node.
   * @param {object} args.name - Placeholder name.
   * @param {object} args.isEditing - Whether the page is in editing mode.
   * @param {object} args.componentMap - Component map.
   */
  private updateView(args: {
    rendering: ComponentRendering | RouteData;
    name: string;
    isEditing: boolean;
    componentMap: ComponentMap;
  }): void {
    const { rendering, name, isEditing, componentMap } = args;

    const rawRenderings = getPlaceholderRenderings(rendering, name, isEditing);
    const placeholderDeclared = isPlaceholderDeclaredInLayout(rendering, name, isEditing);
    this.emptyInEditing.set(rawRenderings.length === 0 && isEditing && placeholderDeclared);

    // Empty placeholder: in Metadata edit mode, still wrap with an outer placeholder
    // pair so Pages can discover and target the empty region. Skip when the name is not
    // declared on the parent rendering (matches JSS PlaceholderComponent early return).
    if (rawRenderings.length === 0) {
      if (isEditing && placeholderDeclared) {
        resetEditorChromes();
      }
      return;
    }
    const ctx: PlaceholderResolverContext = { name, rendering };

    let filtered: ComponentRendering[];
    try {
      filtered = this.guardResolver(rawRenderings, ctx);
    } catch (e) {
      console.warn(`[sc-placeholder] guard resolver threw for '${name}'`, e);
      return;
    }

    let enriched: ComponentRendering[];
    try {
      enriched = this.dataResolver(filtered, ctx);
    } catch (e) {
      console.warn(`[sc-placeholder] data resolver threw for '${name}'`, e);
      return;
    }

    this.resolvedRenderings.set(
      enriched.map((componentRendering) => {
        const { component } = resolveComponentForRendering({
          renderingDefinition: componentRendering,
          placeholderName: name,
          componentMap,
          hiddenRenderingComponent: this.hiddenRenderingComponent() ?? ScHiddenRenderingComponent,
          missingComponentComponent: this.missingComponent() ?? ScMissingComponentComponent,
        });
        const childProps = getChildComponentProps(this.fields(), this.params(), componentRendering);
        return {
          rendering: componentRendering,
          component,
          inputs: {
            fields: childProps.fields,
            params: childProps.params,
            rendering: childProps.rendering,
            ...this.passThroughProps(),
          },
        };
      })
    );
  }
}
