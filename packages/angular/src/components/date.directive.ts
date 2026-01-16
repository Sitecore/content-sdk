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
import { DatePipe } from '@angular/common';
import { FieldMetadata, isFieldValueEmpty } from '@sitecore-content-sdk/core/layout';
import { MetadataKind } from '@sitecore-content-sdk/core/editing';
import { SitecoreContextService } from '../lib/sitecore-context.service';
import { FieldMetadataMarkerComponent } from './field-metadata-marker.component';

/**
 * The interface for the Date field.
 * @public
 */
export interface DateField extends FieldMetadata {
  value?: string;
}

/**
 * Context provided to the template when using *scDate directive
 * @public
 */
export interface ScDateContext {
  $implicit: DateField | undefined;
  date: Date | null;
}

/**
 * Structural directive for rendering date fields.
 *
 * @example
 * ```html
 * <time *scDate="fields.publishDate; format: 'longDate'"></time>
 * <span *scDate="fields.eventDate"></span>
 * ```
 *
 * @public
 */
@Directive({
  selector: '[scDate]',
  standalone: true,
})
export class ScDateDirective implements OnChanges {
  /**
   * The date field data.
   */
  @Input('scDate') field?: DateField;

  /**
   * Angular date pipe format string.
   * @see https://angular.io/api/common/DatePipe
   */
  @Input('scDateFormat') format?: string;

  /**
   * Whether the field is editable.
   * @default true
   */
  @Input('scDateEditable') editable = true;

  private readonly templateRef = inject(TemplateRef<ScDateContext>);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly renderer = inject(Renderer2);
  private readonly sitecoreContext = inject(SitecoreContextService);

  private datePipe = new DatePipe('en-US');
  private viewRef: EmbeddedViewRef<ScDateContext> | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['field'] || changes['format'] || changes['editable']) {
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

    const dateValue = this.getDateValue();
    const formattedDate = shouldShowEmptyEditing
      ? '[No text in field]'
      : isEmpty
        ? ''
        : this.getFormattedDate();

    // Don't render if empty (non-editing mode)
    if (isEmpty && !shouldShowEmptyEditing) {
      return;
    }

    if (hasMetadata) {
      this.renderWithMetadata(dateValue, formattedDate);
    } else {
      this.renderWithoutMetadata(dateValue, formattedDate);
    }
  }

  private getDateValue(): Date | null {
    if (!this.field?.value) {
      return null;
    }
    const date = new Date(this.field.value);
    return isNaN(date.getTime()) ? null : date;
  }

  private getFormattedDate(): string {
    const dateValue = this.getDateValue();
    if (!dateValue) {
      return this.field?.value || '';
    }
    if (this.format) {
      return this.datePipe.transform(dateValue, this.format) || this.field?.value || '';
    }
    return this.field?.value || '';
  }

  private renderWithMetadata(dateValue: Date | null, formattedDate: string): void {
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
      date: dateValue,
    });

    const rootNode = this.viewRef.rootNodes[0] as HTMLElement;
    if (rootNode) {
      // Set datetime attribute for time elements
      if (rootNode.tagName.toLowerCase() === 'time' && this.field?.value) {
        this.renderer.setAttribute(rootNode, 'datetime', this.field.value);
      }
      this.renderer.setProperty(rootNode, 'textContent', formattedDate);
    }

    // Create closing metadata marker
    this.viewContainer.createComponent(FieldMetadataMarkerComponent, {
      bindings: [inputBinding('kind', () => MetadataKind.Close)],
    });
  }

  private renderWithoutMetadata(dateValue: Date | null, formattedDate: string): void {
    this.viewRef = this.viewContainer.createEmbeddedView(this.templateRef, {
      $implicit: this.field,
      date: dateValue,
    });

    const rootNode = this.viewRef.rootNodes[0] as HTMLElement;
    if (rootNode) {
      // Set datetime attribute for time elements
      if (rootNode.tagName.toLowerCase() === 'time' && this.field?.value) {
        this.renderer.setAttribute(rootNode, 'datetime', this.field.value);
      }
      this.renderer.setProperty(rootNode, 'textContent', formattedDate);
    }
  }
}
