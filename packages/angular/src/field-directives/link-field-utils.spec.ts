/* eslint-disable jsdoc/require-jsdoc */
import type { Renderer2 } from '@angular/core';
import { describe, it, expect } from 'vitest';
import {
  applyLinkFieldToAnchor,
  buildHrefFromLinkField,
  resolveLinkFromField,
  type ApplyLinkFieldToAnchorOptions,
} from './link-field-utils';
import type { LinkField, LinkFieldValue } from '@sitecore-content-sdk/content/layout';

function createDomRenderer(): Renderer2 {
  return {
    setAttribute(el: HTMLElement, name: string, value: string): void {
      el.setAttribute(name, value);
    },
    removeAttribute(el: HTMLElement, name: string): void {
      el.removeAttribute(name);
    },
    addClass(el: HTMLElement, name: string): void {
      el.classList.add(name);
    },
    setProperty(el: HTMLElement, name: string, value: unknown): void {
      if (name === 'textContent') {
        el.textContent = value === null || value === undefined ? '' : String(value);
      }
    },
  } as unknown as Renderer2;
}

function baseOptions(overrides?: Partial<ApplyLinkFieldToAnchorOptions>): ApplyLinkFieldToAnchorOptions {
  return { preferTextFromField: false, ...overrides };
}

describe('link-field-binding', () => {
  describe('resolveLinkFromField', () => {
    it('returns value from LinkField wrapper', () => {
      const field: LinkField = { value: { href: '/x', text: 'X' } };
      expect(resolveLinkFromField(field)).toEqual(field.value);
    });

    it('returns bare LinkFieldValue when href is set at root', () => {
      const field = { href: '/y', text: 'Y' };
      expect(resolveLinkFromField(field)).toBe(field);
    });
  });

  describe('buildHrefFromLinkField', () => {
    it('concatenates query and hash fragment', () => {
      expect(
        buildHrefFromLinkField({
          href: '/p',
          querystring: 'a=1',
          anchor: 'sec',
          linktype: 'internal',
        })
      ).toBe('/p?a=1#sec');
    });
  });

  describe('applyLinkFieldToAnchor', () => {
    it('should remove href when the link field is empty', () => {
      const renderer = createDomRenderer();
      const anchor = document.createElement('a');
      anchor.setAttribute('href', '/old');

      applyLinkFieldToAnchor(renderer, anchor, undefined, baseOptions());

      expect(anchor.hasAttribute('href')).toBe(false);
    });

    it('should restore originalClass, originalTitle, and originalTarget when the link field is empty', () => {
      const renderer = createDomRenderer();
      const anchor = document.createElement('a');
      anchor.href = '/gone';
      anchor.className = 'stale';
      anchor.title = 'Stale title';
      anchor.target = '_top';

      applyLinkFieldToAnchor(
        renderer,
        anchor,
        undefined,
        baseOptions({
          originalClass: 'btn btn-primary',
          originalTitle: 'Home',
          originalTarget: '_self',
        })
      );

      expect(anchor.hasAttribute('href')).toBe(false);
      expect(Array.from(anchor.classList).sort()).toEqual(['btn', 'btn-primary']);
      expect(anchor.getAttribute('title')).toBe('Home');
      expect(anchor.getAttribute('target')).toBe('_self');
    });

    it('should set href from the link value when the link field is present', () => {
      const renderer = createDomRenderer();
      const anchor = document.createElement('a');
      const link: LinkFieldValue = { href: '/page', linktype: 'internal' };

      applyLinkFieldToAnchor(renderer, anchor, link, baseOptions());

      expect(anchor.getAttribute('href')).toBe('/page');
    });

    it('should add class tokens from the field and keep existing host classes when the field defines a class', () => {
      const renderer = createDomRenderer();
      const anchor = document.createElement('a');
      anchor.className = 'host-a';
      const link: LinkFieldValue = {
        href: '/x',
        linktype: 'internal',
        className: 'field-b field-c',
      };

      applyLinkFieldToAnchor(renderer, anchor, link, baseOptions());

      const classes = Array.from(anchor.classList).sort();
      expect(classes).toEqual(['field-b', 'field-c', 'host-a']);
    });

    it('should not set title, target, rel, or text from the link when the field supplies a class (only href and classes apply)', () => {
      const renderer = createDomRenderer();
      const anchor = document.createElement('a');
      anchor.textContent = 'Host label';
      const link: LinkFieldValue = {
        href: '/x',
        linktype: 'internal',
        className: 'from-field',
        title: 'Field title',
        target: '_blank',
        text: 'Field text',
      };

      applyLinkFieldToAnchor(renderer, anchor, link, baseOptions({ preferTextFromField: true }));

      expect(anchor.getAttribute('title')).toBeNull();
      expect(anchor.getAttribute('target')).toBeNull();
      expect(anchor.getAttribute('rel')).toBeNull();
      expect(anchor.textContent).toBe('Host label');
    });

    it('should remove the class attribute then restore originalClass tokens when the field has no class but originalClass is provided', () => {
      const renderer = createDomRenderer();
      const anchor = document.createElement('a');
      anchor.className = 'stale';
      const link: LinkFieldValue = { href: '/y', linktype: 'internal' };

      applyLinkFieldToAnchor(renderer, anchor, link, baseOptions({ originalClass: 'restored-a restored-b' }));

      const classes = Array.from(anchor.classList).sort();
      expect(classes).toEqual(['restored-a', 'restored-b']);
    });

    it('should clear the class attribute when the field has no class and originalClass is omitted', () => {
      const renderer = createDomRenderer();
      const anchor = document.createElement('a');
      anchor.className = 'only-stale';
      const link: LinkFieldValue = { href: '/z', linktype: 'internal' };

      applyLinkFieldToAnchor(renderer, anchor, link, baseOptions());

      expect(anchor.className).toBe('');
    });

    it('should set title from the link when the field has no class and the link has a title', () => {
      const renderer = createDomRenderer();
      const anchor = document.createElement('a');

      applyLinkFieldToAnchor(
        renderer,
        anchor,
        { href: '/t', linktype: 'internal', title: 'From field' },
        baseOptions()
      );

      expect(anchor.getAttribute('title')).toBe('From field');
    });

    it('should remove title then restore originalTitle when the link has no title but originalTitle is provided', () => {
      const renderer = createDomRenderer();
      const anchor = document.createElement('a');
      anchor.setAttribute('title', 'Stale');

      applyLinkFieldToAnchor(
        renderer,
        anchor,
        { href: '/t', linktype: 'internal' },
        baseOptions({ originalTitle: 'Host title' })
      );

      expect(anchor.getAttribute('title')).toBe('Host title');
    });

    it('should remove title and leave it unset when the link has no title and originalTitle is omitted', () => {
      const renderer = createDomRenderer();
      const anchor = document.createElement('a');
      anchor.setAttribute('title', 'Stale');

      applyLinkFieldToAnchor(renderer, anchor, { href: '/t', linktype: 'internal' }, baseOptions());

      expect(anchor.hasAttribute('title')).toBe(false);
    });

    it('should set rel to noopener noreferrer when target is _blank and originalRel is absent', () => {
      const renderer = createDomRenderer();
      const anchor = document.createElement('a');

      applyLinkFieldToAnchor(
        renderer,
        anchor,
        { href: '/ext', linktype: 'external', target: '_blank' },
        baseOptions()
      );

      expect(anchor.getAttribute('rel')).toBe('noopener noreferrer');
    });

    it('should set rel to originalRel when target is _blank and the host had rel', () => {
      const renderer = createDomRenderer();
      const anchor = document.createElement('a');

      applyLinkFieldToAnchor(
        renderer,
        anchor,
        { href: '/ext', linktype: 'external', target: '_blank' },
        baseOptions({ originalRel: 'nofollow' })
      );

      expect(anchor.getAttribute('rel')).toBe('nofollow');
    });

    it('should remove rel when target is not _blank and originalRel is absent', () => {
      const renderer = createDomRenderer();
      const anchor = document.createElement('a');
      anchor.setAttribute('rel', 'nofollow');

      applyLinkFieldToAnchor(
        renderer,
        anchor,
        { href: '/same', linktype: 'internal', target: '_self' },
        baseOptions()
      );

      expect(anchor.hasAttribute('rel')).toBe(false);
    });

    it('should set rel to originalRel when target is not _blank and the host had rel', () => {
      const renderer = createDomRenderer();
      const anchor = document.createElement('a');

      applyLinkFieldToAnchor(
        renderer,
        anchor,
        { href: '/same', linktype: 'internal', target: '_self' },
        baseOptions({ originalRel: 'noopener' })
      );

      expect(anchor.getAttribute('rel')).toBe('noopener');
    });

    it('should remove target then restore originalTarget when the link has no target but originalTarget is provided', () => {
      const renderer = createDomRenderer();
      const anchor = document.createElement('a');
      anchor.setAttribute('target', '_top');

      applyLinkFieldToAnchor(
        renderer,
        anchor,
        { href: '/t', linktype: 'internal' },
        baseOptions({ originalTarget: '_parent' })
      );

      expect(anchor.getAttribute('target')).toBe('_parent');
    });

    it('should remove target when the link has no target and originalTarget is omitted', () => {
      const renderer = createDomRenderer();
      const anchor = document.createElement('a');
      anchor.setAttribute('target', '_top');

      applyLinkFieldToAnchor(renderer, anchor, { href: '/t', linktype: 'internal' }, baseOptions());

      expect(anchor.hasAttribute('target')).toBe(false);
    });

    it('should set textContent from link text when the anchor has no meaningful text and the field has no class', () => {
      const renderer = createDomRenderer();
      const anchor = document.createElement('a');

      applyLinkFieldToAnchor(
        renderer,
        anchor,
        { href: '/go', linktype: 'internal', text: 'Go here' },
        baseOptions()
      );

      expect(anchor.textContent).toBe('Go here');
    });

    it('should set textContent from href when the anchor is empty and the link has no text', () => {
      const renderer = createDomRenderer();
      const anchor = document.createElement('a');

      applyLinkFieldToAnchor(renderer, anchor, { href: '/only-href', linktype: 'internal' }, baseOptions());

      expect(anchor.textContent).toBe('/only-href');
    });

    it('should set textContent to empty string when the link is empty and the anchor has no meaningful text', () => {
      const renderer = createDomRenderer();
      const anchor = document.createElement('a');

      applyLinkFieldToAnchor(renderer, anchor, undefined, baseOptions());

      expect(anchor.textContent).toBe('');
    });

    it('should leave existing text content when the anchor already has text and preferTextFromField is false', () => {
      const renderer = createDomRenderer();
      const anchor = document.createElement('a');
      anchor.textContent = 'Keep me';

      applyLinkFieldToAnchor(
        renderer,
        anchor,
        { href: '/x', linktype: 'internal', text: 'Field text' },
        baseOptions({ preferTextFromField: false })
      );

      expect(anchor.textContent).toBe('Keep me');
    });

    it('should replace text content with field text when the anchor already has text and preferTextFromField is true', () => {
      const renderer = createDomRenderer();
      const anchor = document.createElement('a');
      anchor.textContent = 'Old';

      applyLinkFieldToAnchor(
        renderer,
        anchor,
        { href: '/x', linktype: 'internal', text: 'New' },
        baseOptions({ preferTextFromField: true })
      );

      expect(anchor.textContent).toBe('New');
    });

    it('should treat whitespace-only anchor text as empty and set text from the link', () => {
      const renderer = createDomRenderer();
      const anchor = document.createElement('a');
      anchor.textContent = '   \n  ';

      applyLinkFieldToAnchor(
        renderer,
        anchor,
        { href: '/x', linktype: 'internal', text: 'Visible' },
        baseOptions()
      );

      expect(anchor.textContent).toBe('Visible');
    });

    it('should merge className and class from the field into tokens on the anchor when both are present', () => {
      const renderer = createDomRenderer();
      const anchor = document.createElement('a');
      const link: LinkFieldValue = {
        href: '/m',
        linktype: 'internal',
        className: 'cn-a',
        class: 'c-b',
      };

      applyLinkFieldToAnchor(renderer, anchor, link, baseOptions());

      const classes = Array.from(anchor.classList).sort();
      expect(classes).toEqual(['c-b', 'cn-a']);
    });
  });
});
