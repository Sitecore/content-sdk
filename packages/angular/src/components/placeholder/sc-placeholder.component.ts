import {
  Component,
  ComponentRef,
  Injector,
  TemplateRef,
  Type,
  ViewContainerRef,
  computed,
  effect,
  inject,
  input,
  isDevMode,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentRendering, RouteData } from '@sitecore-content-sdk/content/layout';
import { MetadataKind, resetEditorChromes } from '@sitecore-content-sdk/content/editing';
import { SitecoreContextService } from '../../lib/sitecore-context.service';
import { SITECORE_COMPONENT_MAP } from '../tokens';
import type { AngularContentSdkComponent, ComponentMap } from '../types';
import {
  getPlaceholderRenderings,
  getChildComponentProps,
  resolveComponentForRendering,
  computePlaceholderChromeId,
  isPlaceholderDeclaredInLayout,
  type PassThroughProps,
} from './placeholder-utils';
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
  imports: [CommonModule],
  template: `
    <ng-template
      #editingChromeBlock
      let-kind="kind"
      let-chrometype="chrometype"
      let-chromeId="chromeId"
    >
      <code
        type="text/sitecore"
        class="scpm"
        [attr.chrometype]="chrometype"
        [attr.kind]="kind"
        [attr.id]="chromeId || null"
      ></code>
    </ng-template>
    <ng-template #placeholderView></ng-template>
  `,
})
export class ScPlaceholderComponent {
  /** Name of the placeholder to render. */
  readonly name = input.required<string>();

  /** Rendering or route data containing placeholders. */
  readonly rendering = input.required<ComponentRendering | RouteData>();

  /** Optional placeholder-level fields merged into each child. */
  readonly fields = input<{ [key: string]: unknown }>();

  /** Optional placeholder-level params merged into each child's `params` input. */
  readonly params = input<{ [key: string]: string }>();

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
  private readonly injector = inject(Injector);
  private readonly guardResolver = inject(PLACEHOLDER_GUARD_RESOLVER);
  private readonly dataResolver = inject(PLACEHOLDER_DATA_RESOLVER);

  private readonly placeholderViewRef = viewChild('placeholderView', { read: ViewContainerRef });
  private readonly editingChromeBlock = viewChild('editingChromeBlock', { read: TemplateRef });

  private readonly isEditing = computed(() => this.context.isEditing());

  /** True when the placeholder has no renderings and the page is in editing mode. */
  protected readonly emptyInEditing = signal(false);

  constructor() {
    effect(() => {
      const container = this.placeholderViewRef();
      const editingChromeBlock = this.editingChromeBlock();
      const rendering = this.rendering();
      const name = this.name();
      const isEditing = this.isEditing();
      const componentMap =
        this.componentMap() ??
        this.contextComponentMap ??
        new Map<string, AngularContentSdkComponent>();

      if (!container) {
        return;
      }

      this.updateView({ container, editingChromeBlock, rendering, name, isEditing, componentMap });
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
    container: ViewContainerRef;
    editingChromeBlock: TemplateRef<unknown> | undefined;
    rendering: ComponentRendering | RouteData;
    name: string;
    isEditing: boolean;
    componentMap: ComponentMap;
  }): void {
    const { container, editingChromeBlock, rendering, name, isEditing, componentMap } = args;
    container.clear();

    const rawRenderings = getPlaceholderRenderings(rendering, name, isEditing);
    const placeholderDeclared = isPlaceholderDeclaredInLayout(rendering, name, isEditing);
    this.emptyInEditing.set(rawRenderings.length === 0 && isEditing && placeholderDeclared);

    // Empty placeholder: in Metadata edit mode, still wrap with an outer placeholder
    // pair so Pages can discover and target the empty region. Skip when the name is not
    // declared on the parent rendering (matches JSS PlaceholderComponent early return).
    if (rawRenderings.length === 0) {
      if (isEditing && editingChromeBlock && placeholderDeclared) {
        resetEditorChromes();
        this.emitOuterChrome(container, editingChromeBlock, MetadataKind.Open, rendering, name);
        this.emitOuterChrome(container, editingChromeBlock, MetadataKind.Close, rendering, name);
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

    if (isEditing && editingChromeBlock) {
      this.emitOuterChrome(container, editingChromeBlock, MetadataKind.Open, rendering, name);
    }

    for (const componentRendering of enriched) {
      const { component } = resolveComponentForRendering({
        renderingDefinition: componentRendering,
        placeholderName: name,
        componentMap,
        hiddenRenderingComponent: this.hiddenRenderingComponent() ?? ScHiddenRenderingComponent,
        missingComponentComponent: this.missingComponent() ?? ScMissingComponentComponent,
      });

      if (isEditing && editingChromeBlock) {
        container.createEmbeddedView(editingChromeBlock, {
          kind: MetadataKind.Open,
          chrometype: 'rendering',
          chromeId: componentRendering.uid,
        });
      }

      if (component) {
        const ref = container.createComponent(component, { injector: this.injector });
        const childProps = getChildComponentProps(this.fields(), this.params(), componentRendering);
        this.trySetInput(ref, 'fields', childProps.fields);
        this.trySetInput(ref, 'params', childProps.params);
        this.trySetInput(ref, 'rendering', childProps.rendering);

        const passThrough = this.passThroughProps();
        if (passThrough && typeof passThrough === 'object') {
          for (const [inputName, value] of Object.entries(passThrough)) {
            this.trySetInput(ref, inputName, value);
          }
        }
      }

      if (isEditing && editingChromeBlock) {
        container.createEmbeddedView(editingChromeBlock, {
          kind: MetadataKind.Close,
          chrometype: 'rendering',
        });
      }
    }

    if (isEditing && editingChromeBlock) {
      this.emitOuterChrome(container, editingChromeBlock, MetadataKind.Close, rendering, name);
    }
  }

  /**
   * Emit a single outer placeholder open/close marker into the structural slot. The open
   * marker's `id` uses the parent rendering uid when nested, otherwise falls back to
   * `placeholderName_DEFAULT_PLACEHOLDER_UID` (or the matching dynamic-placeholder pattern).
   * @param {ViewContainerRef} container - Target view container.
   * @param {TemplateRef<unknown>} editingChromeBlock - The chrome `<ng-template>`.
   * @param {MetadataKind} kind - Open or close.
   * @param {ComponentRendering | RouteData} rendering - Parent rendering / route node.
   * @param {string} name - Placeholder name.
   */
  private emitOuterChrome(
    container: ViewContainerRef,
    editingChromeBlock: TemplateRef<unknown>,
    kind: MetadataKind,
    rendering: ComponentRendering | RouteData,
    name: string
  ): void {
    if (kind === MetadataKind.Open) {
      const parentUid = (rendering as ComponentRendering).uid;
      const chromeId = computePlaceholderChromeId(rendering as ComponentRendering, name, parentUid);
      container.createEmbeddedView(editingChromeBlock, {
        kind: MetadataKind.Open,
        chrometype: 'placeholder',
        chromeId,
      });
    } else {
      container.createEmbeddedView(editingChromeBlock, {
        kind: MetadataKind.Close,
        chrometype: 'placeholder',
      });
    }
  }

  /**
   * Best-effort input setter that silently ignores undeclared inputs on the target component.
   * Logs in dev mode for diagnostic purposes.
   * @param {ComponentRef<unknown>} ref - The dynamically created component reference.
   * @param {string} inputName - Name of the input to set.
   * @param {unknown} value - Input value.
   */
  private trySetInput(ref: ComponentRef<unknown>, inputName: string, value: unknown): void {
    try {
      ref.setInput(inputName, value);
    } catch (e) {
      if (isDevMode()) {
        console.debug(
          `[sc-placeholder] Skipped input "${inputName}" — not declared on component`,
          e
        );
      }
    }
  }
}
