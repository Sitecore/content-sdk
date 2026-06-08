import {
  EmbeddedViewRef,
  EnvironmentInjector,
  Renderer2,
  TemplateRef,
  Type,
  ViewContainerRef,
  createComponent,
  effect,
  inject,
  type Signal,
} from '@angular/core';
import {
  isFieldValueEmpty,
  type GenericFieldValue,
  type Field,
} from '@sitecore-content-sdk/content/layout';
import { MetadataKind } from '@sitecore-content-sdk/content/editing';
import { SitecoreContextService } from '../../lib/sitecore-context.service';
import { FieldMetadataMarkerComponent } from './metadata-chrome.component';

/**
 * Subset of the Sitecore field shape used by the base directive: anything that may carry
 * editor `metadata`. Concrete subclasses constrain the value via their own field type.
 */
export type FieldLike = { metadata?: Record<string, unknown> };

/**
 * Abstract base for the structural Sitecore field directives (`*scText`, `*scRichText`,
 * `*scImage`, `*scLink`, `*scRouterLink`).
 *
 * The base owns the reactive plumbing (an `effect` that fires {@link updateView} whenever
 * the field signal changes) plus the editing-mode helpers each subclass uses to compose
 * its render flow:
 *
 *   - {@link shouldRender} - true when the field has a renderable value
 *   - {@link renderOpen} / {@link renderClose} - emit the open/close `<code class="scpm">`
 *     chrome markers used by Sitecore Pages to discover the field
 *   - {@link renderEmpty} - emit the empty-field placeholder between chrome markers when
 *     the page is in editing mode and the field carries `metadata`
 *
 * The chrome flow is *not* hidden inside the base: each subclass implements {@link updateView}
 * explicitly so the open / render / close sequence is visible at the directive level.
 *
 * This class intentionally has no `@Directive` decorator. Subclasses carry their own
 * `@Directive({ selector: ... })`, and the shared state here lives in field initializers
 * that run in the subclass's injection context.
 * @internal
 */
export abstract class BaseFieldDirective<TField> {
  protected readonly viewContainer = inject(ViewContainerRef);
  protected readonly templateRef = inject(TemplateRef<unknown>);
  protected readonly renderer = inject(Renderer2);
  protected readonly context = inject(SitecoreContextService, { optional: true });
  private readonly envInjector = inject(EnvironmentInjector);

  /** Embedded view created by the latest successful render; cleared on each tick. */
  protected viewRef?: EmbeddedViewRef<unknown>;

  /** Concrete subclass exposes the Sitecore field via an aliased signal input. */
  abstract readonly field: Signal<TField>;
  /** Consumer-supplied empty-field template; takes precedence over {@link defaultEmptyComponent}. */
  abstract readonly emptyFieldEditingTemplate: Signal<TemplateRef<unknown> | undefined>;
  /** Default component rendered when the field is empty in editing mode and no template is supplied. */
  protected abstract readonly defaultEmptyComponent: Type<unknown>;

  constructor() {
    effect(() => {
      this.field();
      this.updateView();
    });
  }

  /**
   * Renders the structural slot based on the current field value and editing state.
   * Subclasses compose `shouldRender → renderEmpty | (renderOpen → createEmbeddedView →
   * apply field value → renderClose)`.
   */
  protected abstract updateView(): void;

  /**
   * Returns true when the field has a real value to render. Subclasses can override to add
   * field-specific rules (e.g. `ScLinkDirective` preserves authored text + href).
   */
  protected shouldRender(): boolean {
    const f = this.field();
    return !!f && !isFieldValueEmpty(f as GenericFieldValue | Partial<Field>);
  }

  /** Whether the host page is in editing mode. Falls back to `false` when no context is provided. */
  protected isEditing(): boolean {
    return this.context?.isEditing() ?? false;
  }

  /** Field metadata payload, when present. */
  protected get fieldMetadata(): Record<string, unknown> | undefined {
    return (this.field() as FieldLike | undefined)?.metadata;
  }

  /**
   * Renders the empty-field state. In editing mode with field metadata, wraps either the
   * consumer's `emptyFieldEditingTemplate` or {@link defaultEmptyComponent} in chrome markers
   * so Sitecore Pages can target the empty slot. Outside editing or without metadata, emits
   * nothing.
   */
  protected renderEmpty(): void {
    if (!this.fieldMetadata || !this.isEditing()) {
      return;
    }
    this.renderEditingChrome(MetadataKind.Open);
    const tpl = this.emptyFieldEditingTemplate();
    if (tpl) {
      this.viewContainer.createEmbeddedView(tpl);
    } else {
      const hostEl = this.renderer.createElement('span') as HTMLElement;
      const ref = createComponent(this.defaultEmptyComponent, {
        hostElement: hostEl,
        environmentInjector: this.envInjector,
      });
      this.viewContainer.insert(ref.hostView);
    }
    this.renderEditingChrome(MetadataKind.Close);
  }

  /**
   * Inserts a single chrome marker into the structural slot when both editing mode is active
   * and the field carries metadata. No-ops otherwise.
   * @param {MetadataKind} kind - Whether to emit the opening or closing marker.
   */
  protected renderEditingChrome(kind: MetadataKind): void {
    const metadata = this.fieldMetadata;
    if (!metadata || !this.isEditing()) {
      return;
    }
    const ref = this.viewContainer.createComponent(FieldMetadataMarkerComponent);
    ref.setInput('kind', kind);
    if (kind === MetadataKind.Open) {
      ref.setInput('metadata', metadata);
    }
  }
}
