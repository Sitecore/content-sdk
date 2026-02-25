import { Component, computed, inject, input, Type } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { ComponentRendering } from '@sitecore-content-sdk/content/layout';
import { SitecoreContextService } from '../../services/sitecore-context.service';
import { ComponentMapService } from '../../services/component-map.service';
import { MissingComponent } from '../missing-component/missing-component.component';
import { FieldMetadataComponent } from '../field-metadata/field-metadata.component';
import { getPlaceholderRenderings } from '../../utils/placeholder-utils';

/**
 * Renders a Sitecore placeholder by iterating its renderings and dynamically mounting the
 * corresponding Angular components from the registered `ComponentMap`.
 *
 * Each rendered component receives a `rendering` input containing the full `ComponentRendering`
 * data (fields, params, placeholders, etc.).
 *
 * In Pages editing mode, each rendering is wrapped with `FieldMetadataComponent` so that
 * Sitecore Pages can identify and interact with it.
 * @example
 * <sc-placeholder name="jss-main" [rendering]="route" />
 * @public
 */
@Component({
  selector: 'sc-placeholder',
  standalone: true,
  imports: [NgComponentOutlet, FieldMetadataComponent],
  template: `
    @for (r of renderings(); track r.uid || $index) { @if (isEditing()) {
    <sc-field-metadata [rendering]="r">
      <ng-container
        [ngComponentOutlet]="resolveComponent(r)"
        [ngComponentOutletInputs]="{ rendering: r }"
      />
    </sc-field-metadata>
    } @else {
    <ng-container
      [ngComponentOutlet]="resolveComponent(r)"
      [ngComponentOutletInputs]="{ rendering: r }"
    />
    } } @if (renderings().length === 0 && isEditing()) {
    <div class="sc-jss-empty-placeholder"></div>
    }
  `,
})
export class PlaceholderComponent {
  /**
   * The Sitecore placeholder name (must match the placeholder key in the layout data).
   */
  readonly name = input.required<string>();

  /**
   * The parent `ComponentRendering` (or `RouteData`) that contains `placeholders`.
   */
  readonly rendering = input.required<ComponentRendering>();

  /**
   * Optional fallback component to render when a component name is not in the `ComponentMap`.
   * Defaults to `MissingComponent`.
   */
  readonly missingComponentComponent = input<Type<unknown>>(MissingComponent);

  readonly contextService = inject(SitecoreContextService);
  readonly componentMapService = inject(ComponentMapService);

  readonly isEditing = this.contextService.isEditing;

  readonly renderings = computed(() => getPlaceholderRenderings(this.rendering(), this.name()));

  /**
   * Resolves the Angular component type for the given rendering.
   * Falls back to `missingComponentComponent` if not registered.
   * @param {ComponentRendering} rendering The rendering to resolve.
   * @returns {Type<unknown>}
   */
  resolveComponent(rendering: ComponentRendering): Type<unknown> {
    return (
      this.componentMapService.getComponent(rendering.componentName) ??
      this.missingComponentComponent()
    );
  }
}
