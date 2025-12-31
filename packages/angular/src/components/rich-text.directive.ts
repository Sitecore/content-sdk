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
} from '@angular/core';
import { FieldMetadata, isFieldValueEmpty } from '@sitecore-content-sdk/core/layout';
import { MetadataKind } from '@sitecore-content-sdk/core/editing';
import { SitecoreContextService } from '../lib/sitecore-context.service';

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
 *
 * @example
 * ```html
 * <div *scRichText="fields.bodyContent"></div>
 * ```
 *
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
    if (changes['field'] || changes['editable']) {
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

    // Create the view
    this.viewRef = this.viewContainer.createEmbeddedView(this.templateRef, {
      $implicit: this.field,
    });

    const rootNode = this.viewRef.rootNodes[0] as HTMLElement;
    if (!rootNode) return;

    // Handle empty field in editing mode
    if (shouldShowEmptyEditing) {
      this.renderWithMetadata(rootNode, '[No text in field]');
      return;
    }

    // Don't render if empty (non-editing mode)
    if (isEmpty) {
      this.viewContainer.clear();
      return;
    }

    const value = this.field?.value ?? '';

    if (hasMetadata) {
      this.renderWithMetadata(rootNode, value);
    } else {
      this.renderer.setProperty(rootNode, 'innerHTML', value);
    }
  }

  private renderWithMetadata(element: HTMLElement, value: string): void {
    const parent = element.parentNode;
    if (!parent) {
      this.renderer.setProperty(element, 'innerHTML', value);
      return;
    }

    // Create opening metadata tag
    const openCode = this.renderer.createElement('code');
    this.renderer.setAttribute(openCode, 'type', 'text/sitecore');
    this.renderer.setAttribute(openCode, 'chrometype', 'field');
    this.renderer.addClass(openCode, 'scpm');
    this.renderer.setAttribute(openCode, 'kind', MetadataKind.Open);
    this.renderer.setProperty(openCode, 'textContent', JSON.stringify(this.field?.metadata));

    // Create closing metadata tag
    const closeCode = this.renderer.createElement('code');
    this.renderer.setAttribute(closeCode, 'type', 'text/sitecore');
    this.renderer.setAttribute(closeCode, 'chrometype', 'field');
    this.renderer.addClass(closeCode, 'scpm');
    this.renderer.setAttribute(closeCode, 'kind', MetadataKind.Close);

    // Insert metadata tags
    parent.insertBefore(openCode, element);
    parent.insertBefore(closeCode, element.nextSibling);

    // Render content
    this.renderer.setProperty(element, 'innerHTML', value);
  }
}
