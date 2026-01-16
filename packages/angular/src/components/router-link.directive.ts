import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  inject,
  EmbeddedViewRef,
  Renderer2,
  NgZone,
  inputBinding,
} from '@angular/core';
import { Router } from '@angular/router';
import { isFieldValueEmpty } from '@sitecore-content-sdk/core/layout';
import { MetadataKind } from '@sitecore-content-sdk/core/editing';
import { SitecoreContextService } from '../lib/sitecore-context.service';
import { LoaderDataService } from '../lib/loader-data.service';
import { LinkField, LinkFieldValue } from './link.directive';
import { FieldMetadataMarkerComponent } from './field-metadata-marker.component';

/**
 * Context provided to the template when using *scRouterLink directive
 * @public
 */
export interface ScRouterLinkContext {
  $implicit: LinkField | LinkFieldValue | undefined;
}

/**
 * Default debounce delay for preloading (in milliseconds).
 * Prevents unnecessary preload requests during quick mouse movements.
 */
const PRELOAD_DEBOUNCE_MS = 100;

/**
 * Structural directive for rendering link fields with Angular Router navigation.
 * Similar to scLink but uses Angular Router for internal navigation instead of href.
 * Automatically preloads page data on hover/focus for internal links.
 * @example
 * ```html
 * <a *scRouterLink="fields.navLink">Home</a>
 * ```
 * @public
 */
@Directive({
  selector: '[scRouterLink]',
  standalone: true,
})
export class ScRouterLinkDirective implements OnChanges, OnDestroy {
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

  /**
   * Whether to preload page data on hover/focus.
   * Only applies to internal links.
   * @default true
   */
  @Input('scRouterLinkPreload') preload = true;

  /**
   * The loader ID to use for preloading.
   * @default 'page'
   */
  @Input('scRouterLinkLoaderId') loaderId = 'page';

  private readonly templateRef = inject(TemplateRef<ScRouterLinkContext>);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly renderer = inject(Renderer2);
  private readonly router = inject(Router);
  private readonly sitecoreContext = inject(SitecoreContextService);
  private readonly loaderData = inject(LoaderDataService);
  private readonly ngZone = inject(NgZone);

  private viewRef: EmbeddedViewRef<ScRouterLinkContext> | null = null;
  private preloadTimeout: ReturnType<typeof setTimeout> | null = null;
  private eventListenerCleanups: Array<() => void> = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.field || changes.showText || changes.editable || changes.preload) {
      this.updateView();
    }
  }

  ngOnDestroy(): void {
    this.clearPreloadTimeout();
    this.cleanupEventListeners();
  }

  private updateView(): void {
    this.viewContainer.clear();
    this.viewRef = null;
    this.cleanupEventListeners();

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

  private applyLinkAttrs(anchorElement: HTMLAnchorElement, isEmpty: boolean): void {
    if (isEmpty) {
      this.renderer.setAttribute(anchorElement, 'href', '#');
      this.renderer.setProperty(anchorElement, 'textContent', '[No text in field]');
      return;
    }

    const linkData = this.getLinkData();
    if (!linkData) return;

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
    const isInternal = !linkData.target && linkData.href && this.isInternalLink(linkData.href);
    if (isInternal) {
      // Create UrlTree for proper URL handling (encoding, base href, etc.)
      const queryParams = linkData.querystring
        ? this.parseQueryString(linkData.querystring)
        : undefined;
      const urlTree = this.router.createUrlTree([linkData.href], {
        queryParams,
        fragment: linkData.anchor,
      });

      // Update href with Router-generated URL for proper right-click behavior
      const serializedUrl = this.router.serializeUrl(urlTree);
      this.renderer.setAttribute(anchorElement, 'href', serializedUrl);

      // Add click handler for SPA navigation
      this.renderer.listen(anchorElement, 'click', (event: MouseEvent) => {
        // Allow modifier keys for opening in new tab/window
        if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey) {
          return;
        }
        event.preventDefault();
        this.router.navigateByUrl(urlTree);
      });

      // Add hover/focus preloading for internal links
      if (this.preload) {
        this.setupPreloadListeners(anchorElement, serializedUrl);
      }
    }

    // Add link text if showText is true and element doesn't have content
    if (this.showText) {
      const hasContent = anchorElement.childNodes.length > 0;
      if (!hasContent) {
        const textContent = linkData.text || linkData.title || linkData.href || '';
        this.renderer.setProperty(anchorElement, 'textContent', textContent);
      }
    }
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

  /**
   * Sets up mouseenter and focus listeners for preloading.
   * Uses debouncing to avoid unnecessary requests during quick mouse movements.
   * @param element - The anchor element to attach listeners to
   * @param url - The URL to preload
   */
  private setupPreloadListeners(element: HTMLElement, url: string): void {
    const triggerPreload = () => {
      this.clearPreloadTimeout();
      // Run outside Angular zone to avoid triggering change detection
      this.ngZone.runOutsideAngular(() => {
        this.preloadTimeout = setTimeout(() => {
          this.loaderData.preload(url, this.loaderId);
        }, PRELOAD_DEBOUNCE_MS);
      });
    };

    const cancelPreload = () => {
      this.clearPreloadTimeout();
    };

    // Add mouseenter listener for hover preloading
    const mouseEnterCleanup = this.renderer.listen(element, 'mouseenter', triggerPreload);
    this.eventListenerCleanups.push(mouseEnterCleanup);

    // Add mouseleave listener to cancel pending preloads
    const mouseLeaveCleanup = this.renderer.listen(element, 'mouseleave', cancelPreload);
    this.eventListenerCleanups.push(mouseLeaveCleanup);

    // Add focus listener for keyboard accessibility
    const focusCleanup = this.renderer.listen(element, 'focus', triggerPreload);
    this.eventListenerCleanups.push(focusCleanup);

    // Add blur listener to cancel pending preloads
    const blurCleanup = this.renderer.listen(element, 'blur', cancelPreload);
    this.eventListenerCleanups.push(blurCleanup);
  }

  private clearPreloadTimeout(): void {
    if (this.preloadTimeout) {
      clearTimeout(this.preloadTimeout);
      this.preloadTimeout = null;
    }
  }

  private cleanupEventListeners(): void {
    for (const cleanup of this.eventListenerCleanups) {
      cleanup();
    }
    this.eventListenerCleanups = [];
  }
}
