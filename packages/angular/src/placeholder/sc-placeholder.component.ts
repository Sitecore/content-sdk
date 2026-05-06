import {
  Component,
  inject,
  input,
  computed,
  Type,
  Injector,
  ViewContainerRef,
  effect,
  viewChild,
  isDevMode,
  ComponentRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentRendering, RouteData } from '@sitecore-content-sdk/content/layout';
import { SitecoreContextService } from '../lib/sitecore-context.service';
import { SITECORE_COMPONENT_MAP } from './tokens';
import {
  getPlaceholderRenderings,
  getChildComponentProps,
  resolveComponentForRendering,
  ComponentMap,
  type PassThroughProps,
} from './placeholder-utils';
import { ScMissingComponentComponent } from './sc-missing-component.component';
import { ScHiddenRenderingComponent } from './sc-hidden-rendering.component';

/**
 * Angular placeholder component. Renders components from layout data for a given placeholder name.
 *
 * Usage:
 * ```html
 * <sc-placeholder name="headless-main" [rendering]="route"></sc-placeholder>
 * ```
 *
 * Optional `[passThroughProps]` sets extra `input()` values on each child (merged after `fields`, `params`, and `rendering`).
 * @public
 */
@Component({
  selector: 'sc-placeholder',
  imports: [CommonModule],
  template: `<ng-container #container></ng-container>`,
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
   * Extra inputs to set on each dynamically created component, after the standard `fields`, `params`, and `rendering` inputs.
   * Keys must match `input()` names on the target components.
   */
  readonly passThroughProps = input<PassThroughProps>({});

  /** Override component map (defaults to injected SITECORE_COMPONENT_MAP). */
  readonly componentMap = input<ComponentMap>();

  /** Override for missing component rendering. */
  readonly missingComponent = input<Type<unknown>>();

  /** Override for hidden rendering component. */
  readonly hiddenRenderingComponent = input<Type<unknown>>();

  private readonly context = inject(SitecoreContextService);
  private readonly contextComponentMap = inject(SITECORE_COMPONENT_MAP, { optional: true });
  private readonly injector = inject(Injector);

  private readonly containerRef = viewChild('container', { read: ViewContainerRef });

  private readonly isEditing = computed(() => this.context.isEditing());

  constructor() {
    effect(() => {
      const container = this.containerRef();
      if (!container) {
        return;
      }

      const rendering = this.rendering();
      const name = this.name();
      const componentMap = this.componentMap() ?? this.contextComponentMap ?? undefined;
      const isEditing = this.isEditing();

      const renderings = getPlaceholderRenderings(rendering, name, isEditing);

      container.clear();

      if (renderings.length === 0) {
        return;
      }

      for (const componentRendering of renderings) {
        const { component } = resolveComponentForRendering(
          componentRendering,
          name,
          componentMap,
          this.hiddenRenderingComponent() ?? ScHiddenRenderingComponent,
          this.missingComponent() ?? ScMissingComponentComponent
        );

        if (!component) {
          continue;
        }

        const childProps = getChildComponentProps(this.fields(), this.params(), componentRendering);

        const ref = container.createComponent(component, { injector: this.injector });

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
    });
  }

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
