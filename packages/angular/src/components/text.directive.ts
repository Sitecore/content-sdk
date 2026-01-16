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

    const value = shouldShowEmptyEditing
      ? '[No text in field]'
      : isEmpty
        ? ''
        : String(this.field?.value ?? '');

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

  private renderContent(element: HTMLElement, value: string): void {
    if (this.encode) {
      this.renderer.setProperty(element, 'textContent', value);
    } else {
      this.renderer.setProperty(element, 'innerHTML', value);
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
      this.renderContent(rootNode, value);
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
      this.renderContent(rootNode, value);
    }
  }
}
