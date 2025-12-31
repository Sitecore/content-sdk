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
 * The interface for the Text field.
 * @public
 */
export interface TextField extends FieldMetadata {
  value?: string | number;
}

/**
 * Context provided to the template when using *scText directive
 * @public
 */
export interface ScTextContext {
  $implicit: TextField | undefined;
}

/**
 * Structural directive for rendering text fields.
 * Renders the field value as text content on the host element.
 *
 * @example
 * ```html
 * <h1 *scText="fields.title"></h1>
 * <span *scText="fields.subtitle"></span>
 * ```
 *
 * @public
 */
@Directive({
  selector: '[scText]',
  standalone: true,
})
export class ScTextDirective implements OnChanges {
  /**
   * The text field data.
   */
  @Input('scText') field?: TextField;

  /**
   * If false, HTML-encoding of the field value is disabled and the value is rendered as-is.
   * @default true
   */
  @Input('scTextEncode') encode = true;

  /**
   * Whether the field is editable. When true, metadata will be rendered in editing mode.
   * @default true
   */
  @Input('scTextEditable') editable = true;

  private readonly templateRef = inject(TemplateRef<ScTextContext>);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly renderer = inject(Renderer2);
  private readonly sitecoreContext = inject(SitecoreContextService);

  private viewRef: EmbeddedViewRef<ScTextContext> | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['field'] || changes['encode'] || changes['editable']) {
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
      this.renderWithMetadata(rootNode, String(value));
    } else {
      this.renderContent(rootNode, String(value));
    }
  }

  private renderContent(element: HTMLElement, value: string): void {
    if (this.encode) {
      this.renderer.setProperty(element, 'textContent', value);
    } else {
      this.renderer.setProperty(element, 'innerHTML', value);
    }
  }

  private renderWithMetadata(element: HTMLElement, value: string): void {
    const parent = element.parentNode;
    if (!parent) {
      this.renderContent(element, value);
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
    this.renderContent(element, value);
  }
}
