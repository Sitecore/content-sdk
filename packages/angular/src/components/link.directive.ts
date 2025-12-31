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
 * The interface for the Link field value.
 * @public
 */
export interface LinkFieldValue {
  [attributeName: string]: unknown;
  href?: string;
  className?: string;
  class?: string;
  title?: string;
  target?: string;
  text?: string;
  anchor?: string;
  querystring?: string;
  linktype?: string;
}

/**
 * The interface for the Link field.
 * @public
 */
export interface LinkField extends FieldMetadata {
  value?: LinkFieldValue;
}

/**
 * Context provided to the template when using *scLink directive
 * @public
 */
export interface ScLinkContext {
  $implicit: LinkField | LinkFieldValue | undefined;
}

/**
 * Structural directive for rendering link fields.
 * Renders the link with proper href and attributes on the host anchor element.
 *
 * @example
 * ```html
 * <a *scLink="fields.callToAction">Learn More</a>
 * <a *scGenericLink="fields.callToAction"></a>
 * ```
 *
 * @public
 */
@Directive({
  selector: '[scLink], [scGenericLink]',
  standalone: true,
})
export class ScLinkDirective implements OnChanges {
  /**
   * The link field data (scLink input).
   */
  @Input('scLink') field?: LinkField | LinkFieldValue;

  /**
   * The link field data (scGenericLink alias input).
   */
  @Input('scGenericLink')
  set genericLinkField(value: LinkField | LinkFieldValue | undefined) {
    this.field = value;
  }

  /**
   * Whether to show the link text from the field.
   * If the element has content, text is hidden unless this is true.
   * @default true
   */
  @Input('scLinkShowText') showText = true;

  /**
   * Whether the field is editable.
   * @default true
   */
  @Input('scLinkEditable') editable = true;

  private readonly templateRef = inject(TemplateRef<ScLinkContext>);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly renderer = inject(Renderer2);
  private readonly sitecoreContext = inject(SitecoreContextService);

  private viewRef: EmbeddedViewRef<ScLinkContext> | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['field'] || changes['showText'] || changes['editable']) {
      this.updateView();
    }
  }

  private updateView(): void {
    this.viewContainer.clear();
    this.viewRef = null;

    const isEditing = this.sitecoreContext.getPage()?.mode?.isEditing ?? false;
    const hasMetadata = this.editable && isEditing && !!(this.field as LinkField)?.metadata;
    const isEmpty = isFieldValueEmpty(this.field);
    const shouldShowEmptyEditing = hasMetadata && isEmpty;

    // Create the view
    this.viewRef = this.viewContainer.createEmbeddedView(this.templateRef, {
      $implicit: this.field,
    });

    const anchorElement = this.viewRef.rootNodes[0] as HTMLAnchorElement;
    if (!anchorElement) return;

    // Handle empty field in editing mode
    if (shouldShowEmptyEditing) {
      this.renderEmptyLink(anchorElement);
      this.wrapWithMetadata(anchorElement);
      return;
    }

    // Don't render if empty (non-editing mode)
    if (isEmpty) {
      this.viewContainer.clear();
      return;
    }

    const linkData = this.getLinkData();
    if (!linkData) {
      this.viewContainer.clear();
      return;
    }

    // Build href
    const anchor = linkData.linktype !== 'anchor' && linkData.anchor ? `#${linkData.anchor}` : '';
    const querystring = linkData.querystring ? `?${linkData.querystring}` : '';
    const href = `${linkData.href || ''}${querystring}${anchor}`;

    // Apply link attributes
    this.renderer.setAttribute(anchorElement, 'href', href);
    if (linkData.class || linkData.className) {
      this.renderer.setAttribute(
        anchorElement,
        'class',
        linkData.class || linkData.className || ''
      );
    }
    if (linkData.title) {
      this.renderer.setAttribute(anchorElement, 'title', linkData.title);
    }
    if (linkData.target) {
      this.renderer.setAttribute(anchorElement, 'target', linkData.target);
      if (linkData.target === '_blank') {
        this.renderer.setAttribute(anchorElement, 'rel', 'noopener noreferrer');
      }
    }

    // Add link text if showText is true and element doesn't have content
    if (this.showText) {
      const hasContent = anchorElement.childNodes.length > 0;
      if (!hasContent) {
        const textContent = linkData.text || linkData.href || '';
        this.renderer.setProperty(anchorElement, 'textContent', textContent);
      }
    }

    if (hasMetadata) {
      this.wrapWithMetadata(anchorElement);
    }
  }

  private getLinkData(): LinkFieldValue | null {
    const dynamicField = this.field as LinkField | LinkFieldValue;

    // Handle link directly on field (LinkFieldValue) vs wrapped (LinkField)
    if ((dynamicField as LinkFieldValue).href) {
      return this.field as LinkFieldValue;
    }

    return (dynamicField as LinkField).value || null;
  }

  private renderEmptyLink(element: HTMLAnchorElement): void {
    this.renderer.setAttribute(element, 'href', '#');
    this.renderer.setProperty(element, 'textContent', '[No text in field]');
  }

  private wrapWithMetadata(element: HTMLElement): void {
    const parent = element.parentNode;
    if (!parent) return;

    const metadata = (this.field as LinkField)?.metadata;
    if (!metadata) return;

    // Create opening metadata tag
    const openCode = this.renderer.createElement('code');
    this.renderer.setAttribute(openCode, 'type', 'text/sitecore');
    this.renderer.setAttribute(openCode, 'chrometype', 'field');
    this.renderer.addClass(openCode, 'scpm');
    this.renderer.setAttribute(openCode, 'kind', MetadataKind.Open);
    this.renderer.setProperty(openCode, 'textContent', JSON.stringify(metadata));

    // Create closing metadata tag
    const closeCode = this.renderer.createElement('code');
    this.renderer.setAttribute(closeCode, 'type', 'text/sitecore');
    this.renderer.setAttribute(closeCode, 'chrometype', 'field');
    this.renderer.addClass(closeCode, 'scpm');
    this.renderer.setAttribute(closeCode, 'kind', MetadataKind.Close);

    // Insert metadata tags
    parent.insertBefore(openCode, element);
    parent.insertBefore(closeCode, element.nextSibling);
  }
}
