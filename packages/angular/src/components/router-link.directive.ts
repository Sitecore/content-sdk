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
import { Router } from '@angular/router';
import { FieldMetadata, isFieldValueEmpty } from '@sitecore-content-sdk/core/layout';
import { MetadataKind } from '@sitecore-content-sdk/core/editing';
import { SitecoreContextService } from '../lib/sitecore-context.service';
import { LinkField, LinkFieldValue } from './link.directive';

/**
 * Context provided to the template when using *scRouterLink directive
 * @public
 */
export interface ScRouterLinkContext {
  $implicit: LinkField | LinkFieldValue | undefined;
}

/**
 * Structural directive for rendering link fields with Angular Router navigation.
 * Similar to scLink but uses Angular Router for internal navigation instead of href.
 *
 * @example
 * ```html
 * <a *scRouterLink="fields.navLink">Home</a>
 * ```
 *
 * @public
 */
@Directive({
  selector: '[scRouterLink]',
  standalone: true,
})
export class ScRouterLinkDirective implements OnChanges {
  /**
   * The link field data.
   */
  @Input('scRouterLink') field?: LinkField | LinkFieldValue;

  /**
   * Whether to show the link text from the field.
   * @default true
   */
  @Input('scRouterLinkShowText') showText = true;

  /**
   * Whether the field is editable.
   * @default true
   */
  @Input('scRouterLinkEditable') editable = true;

  private readonly templateRef = inject(TemplateRef<ScRouterLinkContext>);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly renderer = inject(Renderer2);
  private readonly router = inject(Router);
  private readonly sitecoreContext = inject(SitecoreContextService);

  private viewRef: EmbeddedViewRef<ScRouterLinkContext> | null = null;

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

    // Build href for display and fallback
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

    // Add click handler for Angular Router navigation (internal links only)
    if (!linkData.target && linkData.href && this.isInternalLink(linkData.href)) {
      this.renderer.listen(anchorElement, 'click', (event: Event) => {
        event.preventDefault();
        const navigationUrl = linkData.href || '/';
        const extras: { queryParams?: Record<string, string>; fragment?: string } = {};

        if (linkData.querystring) {
          extras.queryParams = this.parseQueryString(linkData.querystring);
        }
        if (linkData.anchor) {
          extras.fragment = linkData.anchor;
        }

        this.router.navigate([navigationUrl], extras);
      });
    }

    // Add link text if showText is true and element doesn't have content
    if (this.showText) {
      const hasContent = anchorElement.childNodes.length > 0;
      if (!hasContent) {
        const textContent = linkData.text || linkData.title || linkData.href || '';
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

  private isInternalLink(href: string): boolean {
    // Check if the link is internal (starts with / and not //)
    return href.startsWith('/') && !href.startsWith('//');
  }

  private parseQueryString(querystring: string): Record<string, string> {
    const params: Record<string, string> = {};
    const pairs = querystring.split('&');
    for (const pair of pairs) {
      const [key, value] = pair.split('=');
      if (key) {
        params[decodeURIComponent(key)] = value ? decodeURIComponent(value) : '';
      }
    }
    return params;
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
