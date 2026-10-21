/* eslint-disable jsdoc/require-jsdoc */
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { Component } from '@angular/core';
import { ComponentRendering } from '@sitecore-content-sdk/content/layout';
import { ScPlaceholderMetadata } from './sc-placeholder-metadata';

// ---- host wrapper --------------------------------------------------------

@Component({
  standalone: true,
  imports: [ScPlaceholderMetadata],
  template: `
    <sc-placeholder-metadata [rendering]="rendering" [placeholderName]="placeholderName">
      <div [class]="childClass"></div>
    </sc-placeholder-metadata>
  `,
})
class TestHost {
  rendering!: ComponentRendering;
  placeholderName?: string;
  childClass = 'richtext-class';
}

// ---- helpers -------------------------------------------------------------

interface SetupResult {
  fixture: ComponentFixture<TestHost>;
  container: Element;
  open: Element;
  close: Element;
}

function setup(
  rendering: ComponentRendering,
  placeholderName?: string,
  childClass = 'richtext-class'
): SetupResult {
  const fixture = TestBed.createComponent(TestHost);
  fixture.componentInstance.rendering = rendering;
  fixture.componentInstance.placeholderName = placeholderName;
  fixture.componentInstance.childClass = childClass;
  fixture.detectChanges();

  const container = fixture.nativeElement.querySelector('sc-placeholder-metadata') as Element;
  const codes = Array.from(container.querySelectorAll('code'));
  expect(codes).toHaveLength(2);

  // Verify child content is rendered between the two chrome markers.
  const children = Array.from(container.children);
  expect(children).toHaveLength(3);
  expect(children[1].tagName.toLowerCase()).toBe('div');

  return { fixture, container, open: codes[0], close: codes[1] };
}

function expectCode(
  element: Element,
  attrs: { chrometype: string; kind: string; id?: string }
): void {
  expect(element.getAttribute('type')).toBe('text/sitecore');
  expect(element.getAttribute('class')).toBe('scpm');
  expect(element.getAttribute('chrometype')).toBe(attrs.chrometype);
  expect(element.getAttribute('kind')).toBe(attrs.kind);
  if ('id' in attrs) {
    expect(element.getAttribute('id')).toBe(attrs.id ?? null);
  } else {
    expect(element.hasAttribute('id')).toBe(false);
  }
}

// ---- tests ---------------------------------------------------------------

describe('ScPlaceholderMetadata', () => {
  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [TestHost] });
  });

  it('should render rendering chrome when no placeholderName is given', () => {
    const { open, close } = setup(
      { uid: '123', componentName: 'RichText' } as ComponentRendering
    );

    expectCode(open, { chrometype: 'rendering', kind: 'open', id: '123' });
    expectCode(close, { chrometype: 'rendering', kind: 'close' });
  });

  it('should render placeholder chrome when placeholderName matches a static placeholder key', () => {
    const { open, close } = setup(
      { uid: '123', componentName: 'RichText', placeholders: { main: [] } } as unknown as ComponentRendering,
      'main',
      'richtext-mock'
    );

    expectCode(open, { chrometype: 'placeholder', kind: 'open', id: 'main_123' });
    expectCode(close, { chrometype: 'placeholder', kind: 'close' });
  });

  it('should use DEFAULT_PLACEHOLDER_UID in placeholder chrome when rendering uid is absent', () => {
    const { open, close } = setup(
      { componentName: 'RichText', placeholders: { main: [] } } as unknown as ComponentRendering,
      'main',
      'richtext-mock'
    );

    expectCode(open, {
      chrometype: 'placeholder',
      kind: 'open',
      id: 'main_00000000-0000-0000-0000-000000000000',
    });
    expectCode(close, { chrometype: 'placeholder', kind: 'close' });
  });

  it('should resolve a dynamic placeholder key and use the rendering uid', () => {
    const { open, close } = setup(
      {
        uid: 'renderinguid',
        componentName: 'RichText',
        placeholders: { 'main-{*}': [] },
      } as unknown as ComponentRendering,
      'main-1',
      'richtext-mock'
    );

    expectCode(open, { chrometype: 'placeholder', kind: 'open', id: 'main-{*}_renderinguid' });
    expectCode(close, { chrometype: 'placeholder', kind: 'close' });
  });

  it('should use DEFAULT_PLACEHOLDER_UID for dynamic placeholder when rendering uid is absent', () => {
    const { open, close } = setup(
      { componentName: 'RichText', placeholders: { 'main-{*}': [] } } as unknown as ComponentRendering,
      'main-1',
      'richtext-mock'
    );

    expectCode(open, {
      chrometype: 'placeholder',
      kind: 'open',
      id: 'main-{*}_00000000-0000-0000-0000-000000000000',
    });
    expectCode(close, { chrometype: 'placeholder', kind: 'close' });
  });

  it('should resolve a multi-segment dynamic placeholder key', () => {
    const { open, close } = setup(
      {
        uid: 'renderinguid',
        componentName: 'RichText',
        placeholders: { 'main-1-{*}': [] },
      } as unknown as ComponentRendering,
      'main-1-1',
      'richtext-mock'
    );

    expectCode(open, { chrometype: 'placeholder', kind: 'open', id: 'main-1-{*}_renderinguid' });
    expectCode(close, { chrometype: 'placeholder', kind: 'close' });
  });
});
