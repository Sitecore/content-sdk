import {
  Component,
  Input,
  ViewContainerRef,
  ViewChild,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  inject,
  ChangeDetectionStrategy,
  Type,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentRendering, RouteData } from '@sitecore-content-sdk/core/layout';
import { Page } from '@sitecore-content-sdk/core/client';
import { COMPONENT_MAP } from '../component-map.token';
import { SitecoreContextService } from '../sitecore-context.service';
import {
  getPlaceholderRenderings,
  getComponentInputs,
  HIDDEN_RENDERING_NAME,
} from './placeholder-utils';
import { PlaceholderMetadataComponent } from './placeholder-metadata.component';

/**
 * Configuration for the Placeholder component
 * @public
 */
export interface PlaceholderConfig {
  /**
   * Name of the placeholder to render.
   */
  name: string;
  /**
   * Rendering data (parent component rendering or route data) containing placeholder data.
   */
  rendering: ComponentRendering | RouteData;
  /**
   * Page data containing mode information for editing detection.
   * If not provided, the page will be retrieved from SitecoreContextService.
   */
  page?: Page;
  /**
   * Optional fields to pass to all rendered components.
   */
  fields?: Record<string, unknown>;
  /**
   * Optional params to pass to all rendered components.
   */
  params?: Record<string, string>;
}

/**
 * The Placeholder component dynamically renders registered components for the specified
 * placeholder name and parent rendering in the provided layout data.
 * In editing mode, the placeholder wraps each rendered component with code tags containing
 * rendering metadata and wraps itself with code tags and its own metadata.
 * The page context is retrieved from SitecoreContextService unless explicitly provided.
 * @example
 * ```html
 * <!-- Using page from SitecoreContextService (recommended) -->
 * <sc-placeholder
 *   [name]="'main'"
 *   [rendering]="route"
 * ></sc-placeholder>
 *
 * <!-- Or explicitly passing page -->
 * <sc-placeholder
 *   [name]="'main'"
 *   [rendering]="route"
 *   [page]="page"
 * ></sc-placeholder>
 * ```
 * @public
 */
@Component({
  selector: 'sc-placeholder',
  standalone: true,
  imports: [CommonModule, PlaceholderMetadataComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Editing mode: wrap entire placeholder with metadata -->
    @if (isEditing) {
    <sc-placeholder-metadata [rendering]="parentRendering" [placeholderName]="name">
      <ng-container #componentHost></ng-container>
    </sc-placeholder-metadata>
    } @else {
    <ng-container #componentHost></ng-container>
    }

    <!-- Empty placeholder styling for editing -->
    @if (isEditing && isEmpty) {
    <div class="sc-jss-empty-placeholder"></div>
    }
  `,
})
export class PlaceholderComponent implements AfterViewInit, OnChanges {
  /**
   * Name of the placeholder to render.
   */
  @Input({ required: true }) name!: string;

  /**
   * Rendering data (parent component rendering or route data) containing placeholder data.
   */
  @Input({ required: true }) rendering!: ComponentRendering | RouteData;

  /**
   * Page data containing mode information for editing detection.
   * If not provided, the page will be retrieved from SitecoreContextService.
   */
  @Input() page?: Page;

  /**
   * Optional fields to pass to all rendered components.
   */
  @Input() fields?: Record<string, unknown>;

  /**
   * Optional params to pass to all rendered components.
   */
  @Input() params?: Record<string, string>;

  /**
   * View container for dynamically created components
   */
  @ViewChild('componentHost', { read: ViewContainerRef, static: false })
  private componentHost!: ViewContainerRef;

  /**
   * Component map injected from provider
   */
  private readonly componentMap = inject(COMPONENT_MAP, { optional: true });

  /**
   * Sitecore context service for accessing the current page
   */
  private readonly sitecoreContext = inject(SitecoreContextService);

  /**
   * Whether the placeholder is empty (no renderings)
   */
  private _isEmpty = true;

  /**
   * Track if view has been initialized
   */
  private viewInitialized = false;

  constructor() {
    // React to page changes from the context service
    effect(() => {
      const contextPage = this.sitecoreContext.page();
      // Only re-render if view is initialized and we're using context page (no explicit page input)
      if (this.viewInitialized && !this.page && contextPage) {
        this.renderComponents();
      }
    });
  }

  /**
   * Whether the placeholder is empty (no renderings)
   */
  get isEmpty(): boolean {
    return this._isEmpty;
  }

  /**
   * Get the current page - from input or from context service
   */
  get currentPage(): Page | null {
    return this.page ?? this.sitecoreContext.getPage();
  }

  /**
   * Whether the placeholder is in editing mode
   */
  get isEditing(): boolean {
    return this.currentPage?.mode?.isEditing ?? false;
  }

  /**
   * Parent rendering cast to ComponentRendering for metadata
   */
  get parentRendering(): ComponentRendering {
    return this.rendering as ComponentRendering;
  }

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    this.renderComponents();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.rendering || changes.name || changes.page) {
      // Re-render on input changes if view is initialized
      if (this.componentHost) {
        this.renderComponents();
      }
    }
  }

  /**
   * Render the components for this placeholder
   */
  private renderComponents(): void {
    if (!this.componentHost) {
      return;
    }

    // Clear existing components
    this.componentHost.clear();

    const placeholderRenderings = getPlaceholderRenderings(
      this.rendering,
      this.name,
      this.isEditing
    );

    this._isEmpty = placeholderRenderings.length === 0;

    if (this._isEmpty) {
      return;
    }

    placeholderRenderings.forEach((rendering) => {
      this.renderComponent(rendering);
    });
  }

  /**
   * Render a single component
   * @param rendering - The component rendering data
   */
  private renderComponent(rendering: ComponentRendering): void {
    // Skip hidden renderings
    if (rendering.componentName === HIDDEN_RENDERING_NAME) {
      return;
    }

    // Skip empty component names
    if (!rendering.componentName) {
      return;
    }

    const component = this.getComponent(rendering.componentName);
    if (!component) {
      console.error(
        `Placeholder '${this.name}' contains unknown component '${rendering.componentName}'. ` +
          `Ensure that an Angular component exists for it and is registered in the component map.`
      );
      return;
    }

    const componentInputs = getComponentInputs(rendering, this.fields, this.params);

    if (this.isEditing) {
      // In editing mode, wrap component with metadata
      this.renderComponentWithMetadata(component, componentInputs, rendering);
    } else {
      // Normal mode: render component directly
      this.renderComponentDirect(component, componentInputs);
    }
  }

  /**
   * Render component with metadata wrapper for editing mode
   * @param component - The Angular component type to render
   * @param componentInputs - The inputs to pass to the component
   * @param rendering - The component rendering data
   */
  private renderComponentWithMetadata(
    component: Type<unknown>,
    componentInputs: ReturnType<typeof getComponentInputs>,
    rendering: ComponentRendering
  ): void {
    // Create opening code element
    const openCode = document.createElement('code');
    openCode.setAttribute('type', 'text/sitecore');
    openCode.setAttribute('chrometype', 'rendering');
    openCode.setAttribute('class', 'scpm');
    openCode.setAttribute('kind', 'open');
    if (rendering.uid) {
      openCode.setAttribute('id', rendering.uid);
    }

    // Create the component
    const componentRef = this.componentHost.createComponent(component);

    // Set component inputs
    this.setComponentInputs(componentRef, componentInputs);

    // Create closing code element
    const closeCode = document.createElement('code');
    closeCode.setAttribute('type', 'text/sitecore');
    closeCode.setAttribute('chrometype', 'rendering');
    closeCode.setAttribute('class', 'scpm');
    closeCode.setAttribute('kind', 'close');

    // Insert code elements around the component
    const hostElement = componentRef.location.nativeElement;
    if (hostElement && hostElement.parentNode) {
      hostElement.parentNode.insertBefore(openCode, hostElement);
      hostElement.parentNode.insertBefore(closeCode, hostElement.nextSibling);
    }
  }

  /**
   * Render component directly without metadata
   * @param component - The Angular component type to render
   * @param componentInputs - The inputs to pass to the component
   */
  private renderComponentDirect(
    component: Type<unknown>,
    componentInputs: ReturnType<typeof getComponentInputs>
  ): void {
    const componentRef = this.componentHost.createComponent(component);
    this.setComponentInputs(componentRef, componentInputs);
  }

  /**
   * Set inputs on a component ref
   * @param componentRef - The component reference with setInput method
   * @param componentInputs - The inputs to set on the component
   */
  private setComponentInputs(
    componentRef: { setInput: (name: string, value: unknown) => void },
    componentInputs: ReturnType<typeof getComponentInputs>
  ): void {
    componentRef.setInput('fields', componentInputs.fields);
    componentRef.setInput('params', componentInputs.params);
    componentRef.setInput('rendering', componentInputs.rendering);
  }

  /**
   * Get component from the component map
   * @param componentName - The name of the component to retrieve
   * @returns The component type or undefined if not found
   */
  private getComponent(componentName: string): Type<unknown> | undefined {
    if (!this.componentMap || this.componentMap.size === 0) {
      console.warn(
        `No components were available in component map to service request for component '${componentName}'`
      );
      return undefined;
    }

    return this.componentMap.get(componentName);
  }
}
