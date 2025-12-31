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
import { isFieldValueEmpty } from '@sitecore-content-sdk/core/layout';

/**
 * The interface for the File field value.
 * @public
 */
export interface FileFieldValue {
  [propName: string]: unknown;
  src?: string;
  title?: string;
  displayName?: string;
}

/**
 * The interface for the File field.
 * @public
 */
export interface FileField {
  value: FileFieldValue;
}

/**
 * Context provided to the template when using *scFile directive
 * @public
 */
export interface ScFileContext {
  $implicit: FileField | FileFieldValue | undefined;
}

/**
 * Structural directive for rendering file fields as download links.
 * Note: The File directive does not support editing mode metadata wrapping.
 *
 * @example
 * ```html
 * <a *scFile="fields.document">Download PDF</a>
 * <a *scFile="fields.document"></a>
 * ```
 *
 * @public
 */
@Directive({
  selector: '[scFile]',
  standalone: true,
})
export class ScFileDirective implements OnChanges {
  /**
   * The file field data.
   */
  @Input('scFile') field?: FileField | FileFieldValue;

  private readonly templateRef = inject(TemplateRef<ScFileContext>);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly renderer = inject(Renderer2);

  private viewRef: EmbeddedViewRef<ScFileContext> | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['field']) {
      this.updateView();
    }
  }

  private updateView(): void {
    this.viewContainer.clear();
    this.viewRef = null;

    if (!this.field || isFieldValueEmpty(this.field)) {
      return;
    }

    const fileData = this.getFileData();
    if (!fileData || !fileData.src) {
      return;
    }

    // Create the view
    this.viewRef = this.viewContainer.createEmbeddedView(this.templateRef, {
      $implicit: this.field,
    });

    const anchorElement = this.viewRef.rootNodes[0] as HTMLAnchorElement;
    if (!anchorElement) return;

    // Apply file attributes
    this.renderer.setAttribute(anchorElement, 'href', fileData.src);

    // Add link text if element doesn't have content
    const hasContent = anchorElement.childNodes.length > 0;
    if (!hasContent) {
      const textContent = fileData.title || fileData.displayName || '';
      this.renderer.setProperty(anchorElement, 'textContent', textContent);
    }
  }

  private getFileData(): FileFieldValue | null {
    // Handle field directly containing src (FileFieldValue)
    if ((this.field as FileFieldValue).src) {
      return this.field as FileFieldValue;
    }

    // Handle field with value property (FileField)
    const fileField = this.field as FileField;
    return fileField.value || null;
  }
}
