import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnChanges,
  SimpleChanges,
  inject,
  EmbeddedViewRef,
  Renderer2,
  inputBinding,
} from '@angular/core';
import { FieldMetadata, isFieldValueEmpty } from '@sitecore-content-sdk/core/layout';
import { MetadataKind } from '@sitecore-content-sdk/core/editing';
import { SitecoreContextService } from '../lib/sitecore-context.service';
import { FieldMetadataMarkerComponent } from './field-metadata-marker.component';

/**
 * The interface for the RichText field.
 * @public
 */
export interface RichTextField extends FieldMetadata {
  value?: string;
}

/**
 * Context provided to the template when using *scRichText directive
 * @public
 */
export interface ScRichTextContext {
  $implicit: RichTextField | undefined;
}

/**
 * Structural directive for rendering rich text fields with HTML content.
 * @example
 * ```html
 * <div *scRichText="fields.bodyContent"></div>
 * ```
 * @public
 */
@Directive({
  selector: '[scRichText]',
  standalone: true,
})
export class ScRichTextDirective implements OnChanges {
  /**
   * The rich text field data.
   */
  @Input('scRichText') field?: RichTextField;

  /**
   * Whether the field is editable. When true, metadata will be rendered in editing mode.
   * @default true
   */
  @Input('scRichTextEditable') editable = true;

  private readonly templateRef = inject(TemplateRef<ScRichTextContext>);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly renderer = inject(Renderer2);
  private readonly sitecoreContext = inject(SitecoreContextService);

  private viewRef: EmbeddedViewRef<ScRichTextContext> | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.field || changes.editable) {
      this.updateView();
    }
  }

  private updateView(): void {
    this.viewContainer.clear();
    this.viewRef = null;

    const isEditing = this.sitecoreContext.getPage()?.mode?.isEditing ?? false;
    const hasMetadata = this.editable && isEditing && !!this.field?.metadata;
    const isEmpty = isFieldValueEmpty(this.field);
    const shouldShowEmptyEditing = hasMetadata && isEmpty;

    const value = shouldShowEmptyEditing
      ? '[No text in field]'
      : isEmpty
      ? ''
      : this.field?.value ?? '';

    // Don't render if empty (non-editing mode)
    if (isEmpty && !shouldShowEmptyEditing) {
      return;
    }

    if (hasMetadata) {
      this.renderWithMetadata(value);
    } else {
      this.renderWithoutMetadata(value);
    }
  }

  private renderWithMetadata(value: string): void {
    const metadata = this.field?.metadata;

    // Create opening metadata marker
    this.viewContainer.createComponent(FieldMetadataMarkerComponent, {
      bindings: [
        inputBinding('metadata', () => metadata),
        inputBinding('kind', () => MetadataKind.Open),
      ],
    });

    // Create the content view
    this.viewRef = this.viewContainer.createEmbeddedView(this.templateRef, {
      $implicit: this.field,
    });

    const rootNode = this.viewRef.rootNodes[0] as HTMLElement;
    if (rootNode) {
      this.renderer.setProperty(rootNode, 'innerHTML', value);
    }

    // Create closing metadata marker
    this.viewContainer.createComponent(FieldMetadataMarkerComponent, {
      bindings: [inputBinding('kind', () => MetadataKind.Close)],
    });
  }

  private renderWithoutMetadata(value: string): void {
    this.viewRef = this.viewContainer.createEmbeddedView(this.templateRef, {
      $implicit: this.field,
    });

    const rootNode = this.viewRef.rootNodes[0] as HTMLElement;
    if (rootNode) {
      this.renderer.setProperty(rootNode, 'innerHTML', value);
    }
  }
}
