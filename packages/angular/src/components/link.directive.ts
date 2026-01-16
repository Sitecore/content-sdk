/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/member-ordering */
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
import { Router } from '@angular/router';
import { FieldMetadata, isFieldValueEmpty } from '@sitecore-content-sdk/core/layout';
import { MetadataKind } from '@sitecore-content-sdk/core/editing';
import { SitecoreContextService } from '../lib/sitecore-context.service';
import { FieldMetadataMarkerComponent } from './field-metadata-marker.component';

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

  /**
   * Whether to use Angular Router for internal/local links.
   * When true, local links (starting with /) will use Router for SPA navigation.
   * @default true
   */
  @Input('scLinkUseRouter') useRouter = true;

  private readonly templateRef = inject(TemplateRef<ScLinkContext>);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly renderer = inject(Renderer2);
  private readonly router = inject(Router);
  private readonly sitecoreContext = inject(SitecoreContextService);

  private viewRef: EmbeddedViewRef<ScLinkContext> | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['field'] || changes['showText'] || changes['editable'] || changes['useRouter']) {
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

    // Don't render if empty (non-editing mode)
    if (isEmpty && !shouldShowEmptyEditing) {
      return;
    }

    if (hasMetadata) {
      this.renderWithMetadata(shouldShowEmptyEditing);
    } else {
      this.renderWithoutMetadata();
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

  private applyLinkAttrs(anchorElement: HTMLAnchorElement, isEmpty: boolean): void {
    if (isEmpty) {
      this.renderer.setAttribute(anchorElement, 'href', '#');
      this.renderer.setProperty(anchorElement, 'textContent', '[No text in field]');
      return;
    }

    const linkData = this.getLinkData();
    if (!linkData) return;

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

    // Use Angular Router for internal navigation (SPA-style)
    if (this.useRouter && !linkData.target && linkData.href && this.isInternalLink(linkData.href)) {
      // Create UrlTree for proper URL handling (encoding, base href, etc.)
      const queryParams = linkData.querystring
        ? this.parseQueryString(linkData.querystring)
        : undefined;
      const urlTree = this.router.createUrlTree([linkData.href], {
        queryParams,
        fragment: linkData.anchor,
      });

      // Update href with Router-generated URL for proper right-click behavior
      this.renderer.setAttribute(anchorElement, 'href', this.router.serializeUrl(urlTree));

      // Add click handler for SPA navigation
      this.renderer.listen(anchorElement, 'click', (event: MouseEvent) => {
        // Allow modifier keys for opening in new tab/window
        if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey) {
          return;
        }
        event.preventDefault();
        this.router.navigateByUrl(urlTree);
      });
    }

    // Add link text if showText is true and element doesn't have content
    if (this.showText) {
      const hasContent = anchorElement.childNodes.length > 0;
      if (!hasContent) {
        const textContent = linkData.text || linkData.href || '';
        this.renderer.setProperty(anchorElement, 'textContent', textContent);
      }
    }
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

  private renderWithMetadata(isEmpty: boolean): void {
    const metadata = (this.field as LinkField)?.metadata;

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

    const anchorElement = this.viewRef.rootNodes[0] as HTMLAnchorElement;
    if (anchorElement) {
      this.applyLinkAttrs(anchorElement, isEmpty);
    }

    // Create closing metadata marker
    this.viewContainer.createComponent(FieldMetadataMarkerComponent, {
      bindings: [inputBinding('kind', () => MetadataKind.Close)],
    });
  }

  private renderWithoutMetadata(): void {
    this.viewRef = this.viewContainer.createEmbeddedView(this.templateRef, {
      $implicit: this.field,
    });

    const anchorElement = this.viewRef.rootNodes[0] as HTMLAnchorElement;
    if (anchorElement) {
      this.applyLinkAttrs(anchorElement, false);
    }
  }
}
