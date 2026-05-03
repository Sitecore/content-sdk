import { Renderer2 } from '@angular/core';
import { isFieldValueEmpty, LinkField, LinkFieldValue } from '@sitecore-content-sdk/content/layout';
import { getClassFromField } from './utils';

function addClassTokens(renderer: Renderer2, element: HTMLElement, classString: string): void {
  for (const token of classString.trim().split(/\s+/).filter(Boolean)) {
    renderer.addClass(element, token);
  }
}

/**
 * Normalizes a Sitecore link field input to a {@link LinkFieldValue}, or `undefined` when empty.
 */
export function resolveLinkFromField(
  field: LinkField | LinkFieldValue | undefined | null
): LinkFieldValue | undefined {
  if (!field || isFieldValueEmpty(field)) {
    return undefined;
  }
  return (field as LinkFieldValue).href ? (field as LinkFieldValue) : (field as LinkField).value;
}

/**
 * Builds the `href` string (path + query + hash fragment) from a link value.
 */
export function buildHrefFromLinkField(link: LinkFieldValue): string {
  const anchor = link.linktype !== 'anchor' && link.anchor ? `#${link.anchor}` : '';
  const querystring = link.querystring ? `?${link.querystring}` : '';
  return `${link.href || ''}${querystring}${anchor}`;
}

export interface ApplyLinkFieldToAnchorOptions {
  preferTextFromField: boolean;
  originalClass?: string;
  originalTitle?: string;
  originalTarget?: string;
}

/**
 * Applies Sitecore link attributes and optional text to a host anchor (shared by ScLink / ScRouterLink).
 */
export function applyLinkFieldToAnchor(
  renderer: Renderer2,
  element: HTMLAnchorElement,
  link: LinkFieldValue,
  options: ApplyLinkFieldToAnchorOptions
): void {
  renderer.setAttribute(element, 'href', buildHrefFromLinkField(link));

  const classValue = getClassFromField(link);
  if (classValue) {
    addClassTokens(renderer, element, classValue);
  } else {
    renderer.removeAttribute(element, 'class');
    if (options.originalClass) {
      addClassTokens(renderer, element, options.originalClass);
    }
  }

  if (link.title) {
    renderer.setAttribute(element, 'title', link.title);
  } else {
    renderer.removeAttribute(element, 'title');
    if (options.originalTitle) {
      renderer.setAttribute(element, 'title', options.originalTitle);
    }
  }
  if (link.target) {
    renderer.setAttribute(element, 'target', link.target);
    if (link.target === '_blank' && !element.getAttribute('rel')) {
      renderer.setAttribute(element, 'rel', 'noopener noreferrer');
    }
  } else {
    renderer.removeAttribute(element, 'target');
    if (options.originalTarget) {
      renderer.setAttribute(element, 'target', options.originalTarget);
    }
  }

  const hasChildren = element.childNodes.length > 0 && element.textContent?.trim();
  if (!hasChildren) {
    const text = link.text || link.href || '';
    renderer.setProperty(element, 'textContent', text);
  } else if (options.preferTextFromField && link.text) {
    renderer.setProperty(element, 'textContent', link.text || '');
  }
}

/**
 * Clears link-driven attributes when the field is empty (matches ScLink behavior: drop `href` only).
 */
export function clearLinkHrefOnAnchor(renderer: Renderer2, element: HTMLAnchorElement): void {
  renderer.removeAttribute(element, 'href');
}
