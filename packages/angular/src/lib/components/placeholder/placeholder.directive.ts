import {
  ApplicationRef,
  ComponentRef,
  Directive,
  EnvironmentInjector,
  OnDestroy,
  Type,
  ViewContainerRef,
  createComponent,
  effect,
  inject,
  input,
} from '@angular/core';
import { ComponentRendering } from '@sitecore-content-sdk/content/layout';
import { SitecoreContextService } from '../../services/sitecore-context.service';
import { ComponentMapService } from '../../services/component-map.service';
import { MissingComponent } from '../missing-component/missing-component.component';
import { FieldMetadataComponent } from '../field-metadata/field-metadata.component';
import { getPlaceholderRenderings } from '../../utils/placeholder-utils';

/**
 * Directive alternative to `PlaceholderComponent`. Renders a Sitecore placeholder
 * dynamically by creating Angular components for each rendering into the host
 * element's view container.
 *
 * Intended for use on `<ng-container>` so no extra DOM wrapper is introduced.
 * In Pages editing mode each rendering is wrapped with `FieldMetadataComponent`,
 * matching the behaviour of `<sc-placeholder>`.
 *
 * An empty-placeholder marker `<div class="sc-jss-empty-placeholder">` is inserted
 * when there are no renderings and the page is in editing mode.
 * @example
 * <ng-container
 *   [scPlaceholder]="route"
 *   scPlaceholderName="jss-main"
 * ></ng-container>
 * @public
 */
@Directive({
  selector: '[scPlaceholder]',
  standalone: true,
})
export class ScPlaceholderDirective implements OnDestroy {
  /**
   * The parent `ComponentRendering` (or `RouteData`) that contains `placeholders`.
   */
  readonly scPlaceholder = input.required<ComponentRendering>();

  /**
   * The Sitecore placeholder name (must match the placeholder key in the layout data).
   */
  readonly scPlaceholderName = input.required<string>();

  /**
   * Optional fallback component to render when a component name is not in the `ComponentMap`.
   * Defaults to `MissingComponent`.
   */
  readonly scPlaceholderMissingComponent = input<Type<unknown>>(MissingComponent);

  private readonly vcr = inject(ViewContainerRef);
  private readonly contextService = inject(SitecoreContextService);
  private readonly componentMapService = inject(ComponentMapService);
  private readonly envInjector = inject(EnvironmentInjector);
  private readonly appRef = inject(ApplicationRef);

  /** Tracks components created outside the VCR (editing mode wrappers) for cleanup. */
  private detachedRefs: ComponentRef<unknown>[] = [];

  constructor() {
    effect(() => {
      this.clearAll();

      const renderings = getPlaceholderRenderings(this.scPlaceholder(), this.scPlaceholderName());
      const isEditing = this.contextService.isEditing();
      const missingComponent = this.scPlaceholderMissingComponent();

      for (const r of renderings) {
        const componentType =
          this.componentMapService.getComponent(r.componentName) ?? missingComponent;

        if (isEditing) {
          // Create the actual rendering component detached from the VCR so its
          // host element can be projected into FieldMetadataComponent's ng-content.
          const compRef = createComponent(componentType, {
            environmentInjector: this.envInjector,
          });
          compRef.setInput('rendering', r);
          this.appRef.attachView(compRef.hostView);
          this.detachedRefs.push(compRef);

          // Create FieldMetadataComponent in the VCR with the rendering component
          // projected as content, producing the open/close <code> markers.
          const metaRef = this.vcr.createComponent(FieldMetadataComponent, {
            projectableNodes: [[compRef.location.nativeElement]],
          });
          metaRef.setInput('rendering', r);
        } else {
          const compRef = this.vcr.createComponent(componentType);
          compRef.setInput('rendering', r);
        }
      }

      if (renderings.length === 0 && isEditing) {
        const div = document.createElement('div');
        div.className = 'sc-jss-empty-placeholder';
        this.vcr.element.nativeElement.parentNode?.insertBefore(
          div,
          this.vcr.element.nativeElement
        );
      }
    });
  }

  ngOnDestroy(): void {
    this.clearAll();
  }

  private clearAll(): void {
    for (const ref of this.detachedRefs) {
      this.appRef.detachView(ref.hostView);
      ref.destroy();
    }
    this.detachedRefs = [];
    this.vcr.clear();
  }
}
