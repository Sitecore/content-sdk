import {
  Component,
  type ComponentRef,
  DestroyRef,
  Injector,
  Type,
  ViewContainerRef,
  afterNextRender,
  afterRenderEffect,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import {
  ComponentFields,
  ComponentParams,
  EDITING_COMPONENT_ID,
  EDITING_COMPONENT_PLACEHOLDER,
  RouteData,
} from '@sitecore-content-sdk/content/layout';
import {
  DesignLibraryStatus,
  addComponentUpdateHandler,
  getDesignLibraryStatusEvent,
  postToDesignLibrary,
} from '@sitecore-content-sdk/content/editing';
import {
  DesignLibraryPreviewError,
  getDesignLibraryComponentPropsEvent,
  getDesignLibraryImportMapEvent,
  sendErrorEvent,
  type ImportEntry,
} from '@sitecore-content-sdk/content/codegen';
import { SitecoreContextService } from '../sitecore-context.service';
import { ScPlaceholderComponent } from '../../components/placeholder/sc-placeholder.component';
import { pickDeclaredInputs } from '../../components/placeholder/placeholder-utils';
import { DESIGN_LIBRARY_COMPONENT_FACTORY } from './component-factory';
import { addAngularComponentPreviewHandler } from './preview-handler';
import { DESIGN_LIBRARY_IMPORT_MAP } from './import-map.token';
import { ScPlaceholderMetadata } from '../../components/placeholder/sc-placeholder-metadata';

/**
 * Design Library component.
 *
 * Reacts to Design Studio events to render and update dynamic components. Reuses the shared,
 * framework-agnostic wire protocol from `@sitecore-content-sdk/content` verbatim
 *
 * - Library / library-metadata mode: subscribes via `addComponentUpdateHandler`; on `component:update`
 *   it merges the incoming fields/params into the rendering and re-renders the component.
 * - Variant-generation mode: loads the import map, subscribes to `component:generation:component-preview`
 *   (Angular preview handler), builds the generated component via the factory, and posts the import-map
 *   and component-props handshake events.
 *
 * Renders nothing outside Design Library mode; renders an error when the rendering UID is missing.
 * @public
 */
@Component({
  selector: 'sc-design-library',
  imports: [ScPlaceholderComponent, ScPlaceholderMetadata],
  template: `
    @if (isDesignLibrary()) { @if (uid()) {
    <main>
      @if (dynamicComponent()) { @if (renderError()) {
      <p class="sc-design-library-error">Error during component rendering</p>
      }
      <sc-placeholder-metadata [rendering]="rendering()!">
        <ng-container #previewHost />
      </sc-placeholder-metadata>
      } @else if (error(); as message) {
      <p class="sc-design-library-error">{{ message }}</p>
      } @else {
      <div [id]="EDITING_COMPONENT_ID">
        @if (routeView(); as route) {
        <sc-placeholder [name]="EDITING_COMPONENT_PLACEHOLDER" [rendering]="route"></sc-placeholder>
        }
      </div>
      }
    </main>
    } @else {
    <p class="sc-design-library-error">Rendering UID is missing in the rendering data</p>
    } }
  `,
})
export class ScDesignLibraryComponent {
  /** Editing placeholder id/name, exposed to the template (shared constants, not re-declared). */
  protected readonly EDITING_COMPONENT_ID = EDITING_COMPONENT_ID;
  protected readonly EDITING_COMPONENT_PLACEHOLDER = EDITING_COMPONENT_PLACEHOLDER;

  private readonly context = inject(SitecoreContextService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly factory = inject(DESIGN_LIBRARY_COMPONENT_FACTORY);
  private readonly importMapProvider = inject(DESIGN_LIBRARY_IMPORT_MAP, { optional: true });
  // Captured from `sc-design-library`'s own injection context so the previewed component resolves the
  // full app-level DI chain (root + bootstrap providers), not just root services.
  private readonly injector = inject(Injector);

  /** Host anchor for the manually-instantiated generated component (present only while previewing). */
  private readonly previewHost = viewChild('previewHost', { read: ViewContainerRef });
  private previewRef?: ComponentRef<unknown>;

  private readonly isVariantGeneration = this.context.isVariantGeneration;

  /**
   * Latest fields/params delivered by a `component:update`
   * The real component reads its data from the mutated rendering; the generated
   * component reads them through {@link componentInputs}.
   */
  private readonly fields = signal<ComponentFields | undefined>(undefined);
  private readonly params = signal<ComponentParams | undefined>(undefined);

  protected readonly isDesignLibrary = this.context.isDesignLibrary;

  /**
   * Bumped after the initial mount and on every `component:update` / preview. It drives the
   * `RENDERED` status post and forces `routeView` to re-clone so the editing placeholder re-renders
   * after an in-place `updateComponent` mutation.
   */
  private readonly renderKey = signal(0);

  private readonly baseRoute = computed<RouteData | null>(
    () => this.context.page()?.layout.sitecore.route ?? null
  );
  /**
   * Route reference the editing placeholder renders. Returns a **new object reference** on every
   * `renderKey` bump so the placeholder's `rendering` input actually changes (a computed that returns
   * the same reference is `Object.is`-equal and notifies nothing) — this is what forces the editing
   * placeholder to re-render and read the fields/params `updateComponent` mutated in place.
   */
  protected readonly routeView = computed<RouteData | null>(() => {
    this.renderKey();
    const base = this.baseRoute();
    return base ? { ...base } : null;
  });

  // Null (not a throw) when the editing rendering is absent, so the template's `uid()` guard can fall
  // through to the "Rendering UID is missing" error instead of blowing up the whole view.
  protected readonly rendering = computed(
    () => this.routeView()?.placeholders[EDITING_COMPONENT_PLACEHOLDER]?.[0] ?? null
  );
  protected readonly uid = computed(() => this.rendering()?.uid ?? null);
  /** The generated component compiled from a `component:generation:component-preview` payload. */
  protected readonly dynamicComponent = signal<Type<unknown> | null>(null);
  /** Last preview error (import-map/compile). Shown in place of the generated component. */
  protected readonly error = signal<string | null>(null);
  /**
   * Whether the currently-previewed generated component threw while rendering. NgComponentOutlet` would leak a render-time
   * failure to the root `ErrorHandler`, so the component is instantiated manually (see the render
   * effect) and its first change detection is guarded — failures set this flag and are reported to
   * Studio as {@link DesignLibraryPreviewError.Render}.
   */
  protected readonly renderError = signal(false);

  /**
   * Current props for the generated component: the latest `component:update` values, falling back to
   * the rendering's own fields/params. Sent verbatim to Studio via the component-props event.
   */
  private readonly resolvedProps = computed(() => ({
    fields: this.fields() ?? this.rendering()?.fields,
    params: this.params() ?? this.rendering()?.params,
  }));

  /**
   * Inputs bound to the generated component. Filtered to the inputs it actually declares —
   * `NgComponentOutlet`'s `setInput` throws `NG0303` for undeclared keys, so a generated component
   * opts into `fields`/`params` as needed.
   */
  protected readonly componentInputs = computed<Record<string, unknown>>(() => {
    const component = this.dynamicComponent();
    return component ? pickDeclaredInputs(component, this.resolvedProps()) : this.resolvedProps();
  });

  constructor() {
    afterNextRender(() => {
      // Client-only: the DL handshake and window `message` subscription have no meaning on the server.
      const rendering = this.rendering();
      const uid = rendering?.uid;
      if (!uid) return;

      // Announce readiness to Design Library Studio (shared status event, reused).
      postToDesignLibrary(getDesignLibraryStatusEvent(DesignLibraryStatus.READY, uid));

      // Subscribe to live field/param updates (both modes). The shared handler validates origin/name
      // and mutates the rendering in place
      const unsubscribe = addComponentUpdateHandler(rendering, (updated) => {
        this.fields.set(updated.fields);
        this.params.set(updated.params);
        this.renderKey.update((k) => k + 1);
      });
      this.destroyRef.onDestroy(() => unsubscribe?.());

      if (this.isVariantGeneration()) {
        this.setupVariantGenerationPreview(uid);
      } else {
        // Initial render handshake
        this.renderKey.update((k) => (k === 0 ? k + 1 : k));
      }
    });

    // Post RENDERED after the DOM settles for each render caused by renderKey (initial handshake
    // + every update/preview). `afterRenderEffect` runs browser-only and re-runs when renderKey
    // changes; renderKey === 0 means nothing has been rendered from an update yet.
    afterRenderEffect(() => {
      const key = this.renderKey();
      const uid = this.uid();
      if (key === 0 || !uid) return;
      postToDesignLibrary(getDesignLibraryStatusEvent(DesignLibraryStatus.RENDERED, uid));
    });

    // Render the generated component with a built-in error boundary. Manual instantiation + `detectChanges` inside try/catch contains a
    // render-time throw here — instead of leaking to the root ErrorHandler — and reports it as `Render`.
    // Runs after render (anchor resolved, outside the CD write phase) and recreates on every renderKey bump
    afterRenderEffect(() => {
      this.renderKey();
      const component = this.dynamicComponent();
      const host = this.previewHost();
      const inputs = this.componentInputs();
      this.renderPreview(component, host, inputs);
    });

    this.destroyRef.onDestroy(() => this.previewRef?.destroy());
  }

  /**
   * (Re)creates the generated component into the preview host anchor and runs its first change
   * detection inside a try/catch. On failure clears the view, flags {@link renderError}, and reports a
   * {@link DesignLibraryPreviewError.Render} event so Studio can regenerate.
   * @param {Type<unknown> | null} component - the generated component, or null when not previewing.
   * @param {ViewContainerRef | undefined} host - the preview host anchor, absent when not previewing.
   * @param {Record<string, unknown>} inputs - inputs to bind (already filtered to declared inputs).
   */
  private renderPreview(
    component: Type<unknown> | null,
    host: ViewContainerRef | undefined,
    inputs: Record<string, unknown>
  ): void {
    if (!component || !host) {
      this.previewRef?.destroy();
      this.previewRef = undefined;
      return;
    }

    host.clear();
    try {
      const ref = host.createComponent(component, { injector: this.injector });
      for (const key of Object.keys(inputs)) {
        ref.setInput(key, inputs[key]);
      }
      // Detect now so a render-time throw surfaces here rather than in the root ErrorHandler.
      ref.changeDetectorRef.detectChanges();
      this.previewRef = ref;
      this.renderError.set(false);
    } catch (err) {
      host.clear();
      this.previewRef = undefined;
      this.renderError.set(true);
      const uid = this.uid();
      if (uid) sendErrorEvent(uid, err, DesignLibraryPreviewError.Render);
    }
  }

  /**
   * Wire the variant-generation preview loop: resolve the import map, subscribe to preview events
   * (Angular handler + factory), then post the import-map and component-props handshake events.
   * @param {string} uid - the editing rendering uid.
   */
  private setupVariantGenerationPreview(uid: string): void {
    let cancelled = false;
    this.destroyRef.onDestroy(() => {
      cancelled = true;
    });

    void (async () => {
      const importMap = await this.resolveImportMap(uid);
      if (!importMap || cancelled) return;

      const unsubscribe = addAngularComponentPreviewHandler(
        importMap,
        this.factory,
        (error, component) => {
          // The error event is already sent to Studio inside the handler.
          if (error) {
            this.error.set(String(error));
            return;
          }
          this.error.set(null);
          this.dynamicComponent.set(component);
          this.renderKey.update((k) => k + 1);
        }
      );
      if (cancelled) {
        unsubscribe?.();
        return;
      }
      this.destroyRef.onDestroy(() => unsubscribe?.());

      // Tell Studio which modules are available and the current props (shared events, reused).
      postToDesignLibrary(getDesignLibraryImportMapEvent(uid, importMap));
      const { fields, params } = this.resolvedProps();
      postToDesignLibrary(getDesignLibraryComponentPropsEvent(uid, fields, params));
    })();
  }

  /**
   * Resolve the import map from the {@link DESIGN_LIBRARY_IMPORT_MAP} provider. Prefer a lazy loader
   * (`() => import('.sitecore/import-map')`) so the map — and the component classes it references — is
   * code-split out of the main bundle and only fetched when a variant-generation preview needs it.
   * Sends the matching error event when unavailable.
   * @param {string} uid - the editing rendering uid, used for error reporting.
   * @returns {Promise<ImportEntry[] | null>} the import map, or `null` when it can't be resolved.
   */
  private async resolveImportMap(uid: string): Promise<ImportEntry[] | null> {
    const provider = this.importMapProvider;
    if (!provider) {
      sendErrorEvent(uid, 'No import map provided', DesignLibraryPreviewError.ImportMapMissing);
      return null;
    }

    try {
      return typeof provider === 'function' ? await provider() : provider;
    } catch (e) {
      sendErrorEvent(
        uid,
        `Error loading import map: ${e}`,
        DesignLibraryPreviewError.ImportMapLoad
      );
      return null;
    }
  }
}
