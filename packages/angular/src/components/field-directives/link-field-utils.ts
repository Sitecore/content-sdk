import { Renderer2 } from '@angular/core';
import { isFieldValueEmpty, LinkField, LinkFieldValue } from '@sitecore-content-sdk/content/layout';
import { getClassFromField } from './utils';

/**
 * Splits a CSS class string and applies each token via {@link Renderer2.addClass}.
 * @param {Renderer2} renderer - Angular renderer.
 * @param {HTMLElement} element - Target element.
 * @param {string} classString - Space-separated class names.
 * @returns {void}
 */
function addClassTokens(renderer: Renderer2, element: HTMLElement, classString: string): void {
  for (const token of classString.trim().split(/\s+/).filter(Boolean)) {
    renderer.addClass(element, token);
  }
}

/**
 * Normalizes a Sitecore link field input to a {@link LinkFieldValue}, or `undefined` when empty.
 * @param {LinkField | LinkFieldValue | undefined | null} field - Raw field or value from layout.
 * @returns {LinkFieldValue | undefined} Resolved link value, or `undefined` when empty.
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
 * @param {LinkFieldValue} link - Sitecore link field value.
 * @returns {string} Full `href` string for an anchor.
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
  /** Host `rel` captured before the directive applied field data (e.g. template `rel="nofollow"`). */
  originalRel?: string | null;
}

/**
 * Applies Sitecore link attributes and optional text to a host anchor (shared by ScLink / ScRouterLink),
 * or preserves original attributes and text when the field link is empty.
 * @param {Renderer2} renderer - Angular renderer.
 * @param {HTMLAnchorElement} element - Host anchor element.
 * @param {LinkFieldValue | undefined} link - Resolved link value, or `undefined` when empty.
 * @param {ApplyLinkFieldToAnchorOptions} options - Text/class/title/target behavior flags.
 * @returns {void}
 */
export function applyLinkFieldToAnchor(
  renderer: Renderer2,
  element: HTMLAnchorElement,
  link: LinkFieldValue | undefined,
  options: ApplyLinkFieldToAnchorOptions
): void {
  if (!link) {
    renderer.removeAttribute(element, 'href');
  } else {
    renderer.setAttribute(element, 'href', buildHrefFromLinkField(link));
  }
  const classValue = link ? getClassFromField(link) : undefined;
  if (classValue) {
    addClassTokens(renderer, element, classValue);
  } else {
    renderer.removeAttribute(element, 'class');
    if (options.originalClass) {
      addClassTokens(renderer, element, options.originalClass);
    }

    if (link?.title) {
      renderer.setAttribute(element, 'title', link.title);
    } else {
      renderer.removeAttribute(element, 'title');
      if (options.originalTitle) {
        renderer.setAttribute(element, 'title', options.originalTitle);
      }
    }
    if (link?.target) {
      renderer.setAttribute(element, 'target', link.target);
      if (link?.target === '_blank' && !options.originalRel) {
        renderer.setAttribute(element, 'rel', 'noopener noreferrer');
      } else {
        options.originalRel
          ? renderer.setAttribute(element, 'rel', options.originalRel)
          : renderer.removeAttribute(element, 'rel');
      }
    } else {
      renderer.removeAttribute(element, 'target');
      if (options.originalTarget) {
        renderer.setAttribute(element, 'target', options.originalTarget);
      }
    }

    const hasChildren = element.childNodes.length > 0 && element.textContent?.trim();
    if (!hasChildren) {
      const text = link?.text || link?.href || '';
      renderer.setProperty(element, 'textContent', text);
    } else if (options.preferTextFromField && link?.text) {
      renderer.setProperty(element, 'textContent', link?.text || '');
    }
  }
}
