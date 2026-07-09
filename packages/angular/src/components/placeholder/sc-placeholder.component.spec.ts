/* eslint-disable jsdoc/require-jsdoc */
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { Component, input } from '@angular/core';
import { ComponentRendering, RouteData } from '@sitecore-content-sdk/content/layout';
import { LayoutServicePageState } from '@sitecore-content-sdk/content/layout';
import type { Page } from '@sitecore-content-sdk/content/client';
import { ScPlaceholderComponent } from './sc-placeholder.component';
import { SITECORE_COMPONENT_MAP } from '../tokens';
import type { ComponentMap } from '../types';
import {
  provideMockSitecoreContext,
  setMockContextPage,
} from '../../testing/mock-sitecore-context';

@Component({
  selector: 'test-title',
  template: `<h1>{{ titleText() }}</h1>`,
})
class TitleComponent {
  readonly fields = input<{ [key: string]: unknown }>({});
  readonly params = input<{ [key: string]: string }>({});
  readonly rendering = input<ComponentRendering>();

  titleText = () => {
    const f = this.fields();
    const title = f?.Title as { value: string } | undefined;
    return title?.value ?? '';
  };
}

@Component({
  selector: 'test-content',
  template: `<p>Content</p>`,
})
class ContentComponent {
  readonly fields = input<{ [key: string]: unknown }>({});
  readonly params = input<{ [key: string]: string }>({});
  readonly rendering = input<ComponentRendering>();
}

@Component({
  selector: 'test-passthrough',
  template: `<span>{{ tag() }}</span>`,
})
class PassThroughChildComponent {
  readonly fields = input<{ [key: string]: unknown }>({});
  readonly params = input<{ [key: string]: string }>({});
  readonly rendering = input<ComponentRendering>();
  readonly tag = input<string>('');
}

const makePage = (isEditing = false): Page =>
  ({
    locale: 'en',
    layout: { sitecore: { context: {}, route: null } },
    mode: {
      name: isEditing ? LayoutServicePageState.Edit : LayoutServicePageState.Normal,
      isNormal: !isEditing,
      isPreview: false,
      isEditing,
      isDesignLibrary: false,
      designLibrary: { isVariantGeneration: false },
    },
  } as Page);

describe('ScPlaceholderComponent', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;
  let errorSpy: ReturnType<typeof vi.spyOn>;

  const componentMap: ComponentMap = new Map([
    ['Title', TitleComponent],
    ['ContentBlock', ContentComponent],
  ]);

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [ScPlaceholderComponent],
      providers: [
        ...provideMockSitecoreContext(),
        { provide: SITECORE_COMPONENT_MAP, useValue: componentMap },
      ],
    });

    setMockContextPage(makePage());
  });

  afterEach(() => {
    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });

  function createFixture(
    rendering: ComponentRendering | RouteData,
    name: string
  ): ComponentFixture<ScPlaceholderComponent> {
    const fixture = TestBed.createComponent(ScPlaceholderComponent);
    fixture.componentRef.setInput('rendering', rendering);
    fixture.componentRef.setInput('name', name);
    fixture.detectChanges();
    return fixture;
  }

  it('should render components from placeholder', () => {
    const rendering: RouteData = {
      name: 'route',
      placeholders: {
        main: [
          { componentName: 'Title', fields: { Title: { value: 'Hello' } } },
          { componentName: 'ContentBlock' },
        ],
      },
    };
    const fixture = createFixture(rendering, 'main');
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')?.textContent).toBe('Hello');
    expect(el.querySelector('p')?.textContent).toBe('Content');
  });

  it('should render missing component for unknown rendering', () => {
    const rendering: RouteData = {
      name: 'route',
      placeholders: {
        main: [{ componentName: 'DoesNotExist' }],
      },
    };
    const fixture = createFixture(rendering, 'main');
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('DoesNotExist');
    expect(el.textContent).toContain('missing');
  });

  it('should render nothing for empty placeholder', () => {
    const rendering: RouteData = {
      name: 'route',
      placeholders: { main: [] },
    };
    const fixture = createFixture(rendering, 'main');
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent?.trim()).toBe('');
  });

  it('should warn when placeholder not found', () => {
    const rendering: RouteData = {
      name: 'route',
      placeholders: { other: [] },
    };
    createFixture(rendering, 'main');
    expect(warnSpy).toHaveBeenCalled();
  });

  it('should render hidden rendering component', () => {
    const rendering: RouteData = {
      name: 'route',
      placeholders: {
        main: [{ componentName: 'Hidden Rendering' }],
      },
    };
    const fixture = createFixture(rendering, 'main');
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('hidden');
  });

  it('should set passThroughProps as extra inputs on child components', () => {
    const map: ComponentMap = new Map([['TagItem', PassThroughChildComponent]]);
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [ScPlaceholderComponent],
      providers: [
        ...provideMockSitecoreContext(),
        { provide: SITECORE_COMPONENT_MAP, useValue: map },
      ],
    });
    setMockContextPage(makePage());

    const fixture = TestBed.createComponent(ScPlaceholderComponent);
    fixture.componentRef.setInput('rendering', {
      name: 'route',
      placeholders: { main: [{ componentName: 'TagItem' }] },
    });
    fixture.componentRef.setInput('name', 'main');
    fixture.componentRef.setInput('passThroughProps', { tag: 'from-parent' });
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('from-parent');
  });

  it('should pass merged fields and params to child components', () => {
    const rendering: RouteData = {
      name: 'route',
      placeholders: {
        main: [
          {
            componentName: 'Title',
            fields: { Title: { value: 'FromRendering' } },
            params: { style: 'bold' },
          },
        ],
      },
    };
    const fixture = createFixture(rendering, 'main');
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')?.textContent).toBe('FromRendering');
  });
});

describe('ScPlaceholderComponent editing chrome', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;
  let errorSpy: ReturnType<typeof vi.spyOn>;

  const componentMap: ComponentMap = new Map([
    ['Title', TitleComponent],
    ['ContentBlock', ContentComponent],
  ]);

  function setupEditing() {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [ScPlaceholderComponent],
      providers: [
        ...provideMockSitecoreContext(),
        { provide: SITECORE_COMPONENT_MAP, useValue: componentMap },
      ],
    });
    setMockContextPage(makePage(true));
  }

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    setupEditing();
  });

  afterEach(() => {
    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });

  function chromeMarkers(el: HTMLElement) {
    return Array.from(el.querySelectorAll('code.scpm')) as HTMLElement[];
  }

  it('should emit ONE outer placeholder pair around ALL children', () => {
    const rendering: RouteData = {
      name: 'route',
      placeholders: {
        main: [
          { componentName: 'Title', uid: 'uid-A', fields: { Title: { value: 'A' } } },
          { componentName: 'ContentBlock', uid: 'uid-B' },
        ],
      },
    };

    const fixture = TestBed.createComponent(ScPlaceholderComponent);
    fixture.componentRef.setInput('rendering', rendering);
    fixture.componentRef.setInput('name', 'main');
    fixture.detectChanges();

    const markers = chromeMarkers(fixture.nativeElement as HTMLElement);

    const placeholderMarkers = markers.filter(
      (m) => m.getAttribute('chrometype') === 'placeholder'
    );
    const renderingMarkers = markers.filter((m) => m.getAttribute('chrometype') === 'rendering');

    expect(placeholderMarkers.length).toBe(2);
    expect(placeholderMarkers[0].getAttribute('kind')).toBe('open');
    expect(placeholderMarkers[1].getAttribute('kind')).toBe('close');

    expect(renderingMarkers.length).toBe(4);
    expect(renderingMarkers.map((m) => m.getAttribute('kind'))).toEqual([
      'open',
      'close',
      'open',
      'close',
    ]);
    expect(renderingMarkers[0].getAttribute('id')).toBe('uid-A');
    expect(renderingMarkers[2].getAttribute('id')).toBe('uid-B');
  });

  it('should compute outer placeholder id as placeholderName_DEFAULT_PLACEHOLDER_UID for root route', () => {
    const rendering: RouteData = {
      name: 'route',
      placeholders: {
        main: [{ componentName: 'Title', uid: 'uid-A', fields: { Title: { value: 'A' } } }],
      },
    };

    const fixture = TestBed.createComponent(ScPlaceholderComponent);
    fixture.componentRef.setInput('rendering', rendering);
    fixture.componentRef.setInput('name', 'main');
    fixture.detectChanges();

    const markers = chromeMarkers(fixture.nativeElement as HTMLElement);
    const outerOpen = markers.find(
      (m) => m.getAttribute('chrometype') === 'placeholder' && m.getAttribute('kind') === 'open'
    );
    expect(outerOpen?.getAttribute('id')).toBe('main_00000000-0000-0000-0000-000000000000');
  });

  it('should compute outer placeholder id from parent rendering uid when nested', () => {
    const rendering: ComponentRendering = {
      componentName: 'Parent',
      uid: 'parent-uid',
      placeholders: {
        inner: [{ componentName: 'Title', uid: 'child-uid', fields: { Title: { value: 'A' } } }],
      },
    };

    const fixture = TestBed.createComponent(ScPlaceholderComponent);
    fixture.componentRef.setInput('rendering', rendering);
    fixture.componentRef.setInput('name', 'inner');
    fixture.detectChanges();

    const markers = chromeMarkers(fixture.nativeElement as HTMLElement);
    const outerOpen = markers.find(
      (m) => m.getAttribute('chrometype') === 'placeholder' && m.getAttribute('kind') === 'open'
    );
    expect(outerOpen?.getAttribute('id')).toBe('inner_parent-uid');
  });

  it('should still emit outer placeholder pair when the placeholder is empty', () => {
    const rendering: RouteData = {
      name: 'route',
      placeholders: { main: [] },
    };

    const fixture = TestBed.createComponent(ScPlaceholderComponent);
    fixture.componentRef.setInput('rendering', rendering);
    fixture.componentRef.setInput('name', 'main');
    fixture.detectChanges();

    const markers = chromeMarkers(fixture.nativeElement as HTMLElement);
    expect(markers.length).toBe(2);
    expect(markers[0].getAttribute('chrometype')).toBe('placeholder');
    expect(markers[0].getAttribute('kind')).toBe('open');
    expect(markers[1].getAttribute('chrometype')).toBe('placeholder');
    expect(markers[1].getAttribute('kind')).toBe('close');
    expect(fixture.nativeElement.classList.contains('sc-jss-empty-placeholder')).toBe(true);
  });

  it('should not emit placeholder chrome when the name is undeclared on the parent rendering', () => {
    const rendering: RouteData = {
      name: 'route',
      placeholders: { main: [] },
    };

    const fixture = TestBed.createComponent(ScPlaceholderComponent);
    fixture.componentRef.setInput('rendering', rendering);
    fixture.componentRef.setInput('name', 'footer');
    fixture.detectChanges();

    expect(chromeMarkers(fixture.nativeElement as HTMLElement).length).toBe(0);
    expect(fixture.nativeElement.classList.contains('sc-jss-empty-placeholder')).toBe(false);
  });

  it('should not apply sc-jss-empty-placeholder when the placeholder has renderings', () => {
    const rendering: RouteData = {
      name: 'route',
      placeholders: {
        main: [{ componentName: 'Title', uid: 'uid-A', fields: { Title: { value: 'A' } } }],
      },
    };

    const fixture = TestBed.createComponent(ScPlaceholderComponent);
    fixture.componentRef.setInput('rendering', rendering);
    fixture.componentRef.setInput('name', 'main');
    fixture.detectChanges();

    expect(fixture.nativeElement.classList.contains('sc-jss-empty-placeholder')).toBe(false);
  });

  it('should emit no chrome when page is not in editing mode', () => {
    setMockContextPage(makePage(false));
    const rendering: RouteData = {
      name: 'route',
      placeholders: {
        main: [{ componentName: 'Title', uid: 'uid-A', fields: { Title: { value: 'A' } } }],
      },
    };

    const fixture = TestBed.createComponent(ScPlaceholderComponent);
    fixture.componentRef.setInput('rendering', rendering);
    fixture.componentRef.setInput('name', 'main');
    fixture.detectChanges();

    expect(chromeMarkers(fixture.nativeElement as HTMLElement).length).toBe(0);
  });
});

describe('ScPlaceholderComponent guard / data resolvers', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  const componentMap: ComponentMap = new Map([
    ['Title', TitleComponent],
    ['ContentBlock', ContentComponent],
  ]);

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('should apply a synchronous guard that filters out renderings before instantiation', async () => {
    const { PLACEHOLDER_GUARD_RESOLVER } = await import('./placeholder-tokens');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [ScPlaceholderComponent],
      providers: [
        ...provideMockSitecoreContext(),
        { provide: SITECORE_COMPONENT_MAP, useValue: componentMap },
        {
          provide: PLACEHOLDER_GUARD_RESOLVER,
          useValue: (renderings: ComponentRendering[]) =>
            renderings.filter((r) => r.componentName !== 'ContentBlock'),
        },
      ],
    });
    setMockContextPage(makePage());

    const rendering: RouteData = {
      name: 'route',
      placeholders: {
        main: [
          { componentName: 'Title', fields: { Title: { value: 'Kept' } } },
          { componentName: 'ContentBlock' },
        ],
      },
    };

    const fixture = TestBed.createComponent(ScPlaceholderComponent);
    fixture.componentRef.setInput('rendering', rendering);
    fixture.componentRef.setInput('name', 'main');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')?.textContent).toBe('Kept');
    expect(el.querySelector('p')).toBeNull();
  });

  it('should pass renderings through the data resolver after the guard', async () => {
    const { PLACEHOLDER_DATA_RESOLVER } = await import('./placeholder-tokens');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [ScPlaceholderComponent],
      providers: [
        ...provideMockSitecoreContext(),
        { provide: SITECORE_COMPONENT_MAP, useValue: componentMap },
        {
          provide: PLACEHOLDER_DATA_RESOLVER,
          useValue: (renderings: ComponentRendering[]) =>
            renderings.map((r) =>
              r.componentName === 'Title'
                ? { ...r, fields: { ...(r.fields ?? {}), Title: { value: 'DecoratedByResolver' } } }
                : r
            ),
        },
      ],
    });
    setMockContextPage(makePage());

    const rendering: RouteData = {
      name: 'route',
      placeholders: {
        main: [{ componentName: 'Title', fields: { Title: { value: 'Original' } } }],
      },
    };

    const fixture = TestBed.createComponent(ScPlaceholderComponent);
    fixture.componentRef.setInput('rendering', rendering);
    fixture.componentRef.setInput('name', 'main');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')?.textContent).toBe('DecoratedByResolver');
  });

  it('should warn and render nothing when the guard resolver throws', async () => {
    const { PLACEHOLDER_GUARD_RESOLVER } = await import('./placeholder-tokens');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [ScPlaceholderComponent],
      providers: [
        ...provideMockSitecoreContext(),
        { provide: SITECORE_COMPONENT_MAP, useValue: componentMap },
        {
          provide: PLACEHOLDER_GUARD_RESOLVER,
          useValue: () => {
            throw new Error('guard failed');
          },
        },
      ],
    });
    setMockContextPage(makePage());

    const rendering: RouteData = {
      name: 'route',
      placeholders: {
        main: [{ componentName: 'Title', fields: { Title: { value: 'Hidden' } } }],
      },
    };

    const fixture = TestBed.createComponent(ScPlaceholderComponent);
    fixture.componentRef.setInput('rendering', rendering);
    fixture.componentRef.setInput('name', 'main');
    fixture.detectChanges();

    expect(warnSpy).toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('h1')).toBeNull();
  });
});
