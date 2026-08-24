/* eslint-disable jsdoc/require-jsdoc */
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Component, Input, PLATFORM_ID, input } from '@angular/core';
import type { Page } from '@sitecore-content-sdk/content/client';
import {
  EDITING_COMPONENT_PLACEHOLDER,
  LayoutServicePageState,
  type ComponentRendering,
} from '@sitecore-content-sdk/content/layout';
import type { ImportEntry } from '@sitecore-content-sdk/content/codegen';
import { ScDesignLibraryComponent } from './sc-design-library.component';
import { SITECORE_COMPONENT_MAP } from '../../components/tokens';
import {
  DESIGN_LIBRARY_COMPONENT_FACTORY,
  type DesignLibraryComponentFactory,
} from './component-factory';
import { DESIGN_LIBRARY_IMPORT_MAP } from './import-map.token';
import {
  provideMockSitecoreContext,
  setMockContextPage,
} from '../../testing/mock-sitecore-context';

@Component({
  standalone: true,
  selector: 'stub-generated',
  template: '<span class="generated">GENERATED {{ params?.size }}</span>',
})
class StubGeneratedComponent {
  @Input() fields: unknown;
  @Input() params: { size?: string } | undefined;
}

// A generated component that declares only `fields` (no `params`). NgComponentOutlet's setInput
// would throw NG0303 if the design library set undeclared inputs on it.
@Component({
  standalone: true,
  selector: 'stub-fields-only',
  template: '<span class="generated">FIELDS-ONLY</span>',
})
class StubFieldsOnlyComponent {
  @Input() fields: unknown;
}

// A generated component that throws during change detection (its template calls a throwing method).
// This exercises the built-in error boundary: manual instantiation + detectChanges must contain the
// failure instead of leaking it to the root ErrorHandler.
@Component({
  standalone: true,
  selector: 'stub-throws',
  template: '<span>{{ boom() }}</span>',
})
class StubThrowingComponent {
  boom(): string {
    throw new Error('render boom');
  }
}

// A "real" mapped component (rendered via the editing placeholder) that reads a field value, so a
// component:update is observable in the DOM.
@Component({
  standalone: true,
  selector: 'stub-real',
  template: '<span class="real">{{ text() }}</span>',
})
class StubRealComponent {
  readonly fields = input<{ Text?: { value: string } }>();
  text = () => this.fields()?.Text?.value ?? '';
}

const importMap: ImportEntry[] = [
  { module: '@angular/core', exports: [{ name: 'Component', value: Component }] },
];

/**
 * The component has no direct import-map input — the map is always supplied (and code-split) through
 * DESIGN_LIBRARY_IMPORT_MAP. A lazy loader mirrors how the starter registers it.
 */
const provideImportMap = {
  provide: DESIGN_LIBRARY_IMPORT_MAP,
  useValue: () => Promise.resolve(importMap),
};

function previewPayload(uid = 'uid-1') {
  return {
    uid,
    code: { type: 'function', content: 'export class Generated {}' },
    styles: {
      type: 'style-element',
      content: '.generated { color: red; }',
      styleImport: { name: 'styles', content: {} },
    },
    imports: [],
  };
}

function previewMessage(
  payload: ReturnType<typeof previewPayload>,
  overrides: { name?: string; origin?: string } = {}
): MessageEvent {
  return new MessageEvent('message', {
    origin: overrides.origin ?? 'http://localhost',
    data: { name: overrides.name ?? 'component:generation:component-preview', message: payload },
  });
}

function stubFactory(
  component: unknown = StubGeneratedComponent
): DesignLibraryComponentFactory & { compile: ReturnType<typeof vi.fn> } {
  return { compile: vi.fn().mockResolvedValue(component) };
}

/**
 * Build a Design Library page whose editing placeholder holds `rendering`.
 * @param {ComponentRendering | null} rendering editing rendering, or null for none
 * @param {boolean} isVariantGeneration variant-generation flag
 * @returns {Page} the mock page
 */
function makeDlPage(rendering: ComponentRendering | null, isVariantGeneration = false): Page {
  return {
    locale: 'en',
    layout: {
      sitecore: {
        context: {},
        route: {
          name: 'route',
          placeholders: {
            [EDITING_COMPONENT_PLACEHOLDER]: rendering ? [rendering] : [],
          },
        },
      },
    },
    mode: {
      name: LayoutServicePageState.Normal,
      isNormal: false,
      isPreview: false,
      isEditing: false,
      isDesignLibrary: true,
      designLibrary: { isVariantGeneration },
    },
  } as unknown as Page;
}

function makeRendering(uid = 'uid-1'): ComponentRendering {
  return {
    componentName: 'Hero',
    uid,
    fields: { Title: { value: 'Original' } },
    params: { size: 'sm' },
  } as unknown as ComponentRendering;
}

function updateMessage(
  uid: string,
  fields?: Record<string, unknown>,
  params?: Record<string, string>,
  overrides: { name?: string; origin?: string } = {}
): MessageEvent {
  return new MessageEvent('message', {
    origin: overrides.origin ?? 'http://localhost',
    data: {
      name: overrides.name ?? 'component:update',
      details: { uid, fields, params },
    },
  });
}

describe('ScDesignLibraryComponent', () => {
  let postSpy: ReturnType<typeof vi.spyOn>;

  /** Statuses posted to Design Library Studio, in order (ready / rendered). */
  function postedStatuses(): string[] {
    return (postSpy.mock.calls as unknown[][])
      .map((call) => call[0] as { name?: string; message?: { status?: string } })
      .filter((evt) => evt?.name === 'component:status')
      .map((evt) => evt.message?.status ?? '');
  }

  async function flush(fixture: ComponentFixture<ScDesignLibraryComponent>): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
  }

  function createFixture(): ComponentFixture<ScDesignLibraryComponent> {
    return TestBed.createComponent(ScDesignLibraryComponent);
  }

  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'debug').mockImplementation(() => {});
    // window.parent === window in jsdom, so postToDesignLibrary targets window.postMessage.
    postSpy = vi.spyOn(window, 'postMessage').mockImplementation(() => {});

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [ScDesignLibraryComponent],
      providers: [...provideMockSitecoreContext(), { provide: PLATFORM_ID, useValue: 'browser' }],
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render nothing when the page is not in design library mode', async () => {
    setMockContextPage({
      locale: 'en',
      layout: { sitecore: { context: {}, route: null } },
      mode: {
        name: LayoutServicePageState.Normal,
        isNormal: true,
        isPreview: false,
        isEditing: false,
        isDesignLibrary: false,
        designLibrary: { isVariantGeneration: false },
      },
    } as unknown as Page);

    const fixture = createFixture();
    await flush(fixture);

    expect(fixture.nativeElement.textContent).toBe('');
    expect(postedStatuses()).toEqual([]);
  });

  it('should render an error when the rendering UID is missing', async () => {
    setMockContextPage(makeDlPage(null));

    const fixture = createFixture();
    await flush(fixture);

    expect(fixture.nativeElement.textContent).toContain('Rendering UID is missing');
    expect(postedStatuses()).toEqual([]);
  });

  it('should post ready then rendered on mount for a library-mode page', async () => {
    setMockContextPage(makeDlPage(makeRendering()));

    const fixture = createFixture();
    await flush(fixture);

    // ready is posted once; the initial render handshake posts rendered.
    expect(postedStatuses()[0]).toBe('ready');
    expect(postedStatuses()).toContain('rendered');
    expect(postedStatuses().filter((s) => s === 'ready')).toHaveLength(1);
  });

  it('should merge fields/params from a component:update and post a rendered status', async () => {
    const rendering = makeRendering();
    setMockContextPage(makeDlPage(rendering));

    const fixture = createFixture();
    await flush(fixture);
    const renderedBefore = postedStatuses().filter((s) => s === 'rendered').length;

    window.dispatchEvent(updateMessage('uid-1', { Title: { value: 'Updated' } }, { size: 'lg' }));
    await flush(fixture);

    // The shared handler mutates the rendering in place, merging the new field/param values.
    expect((rendering.fields as Record<string, { value: string }>).Title.value).toBe('Updated');
    expect((rendering.params as Record<string, string>).size).toBe('lg');
    // Another rendered status follows the update.
    expect(postedStatuses().filter((s) => s === 'rendered').length).toBeGreaterThan(renderedBefore);
  });

  it('should re-render the real component in the DOM when a component:update changes fields', async () => {
    // Guards the routeView re-clone: without a new route reference the placeholder input is
    // Object.is-equal and the mapped component never re-renders with the mutated fields.
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [ScDesignLibraryComponent],
      providers: [
        ...provideMockSitecoreContext(),
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: SITECORE_COMPONENT_MAP, useValue: new Map([['Hero', StubRealComponent]]) },
      ],
    });
    const rendering = makeRendering();
    rendering.fields = { Text: { value: 'Before' } };
    setMockContextPage(makeDlPage(rendering));

    const fixture = createFixture();
    await flush(fixture);
    expect(fixture.nativeElement.textContent).toContain('Before');

    window.dispatchEvent(updateMessage('uid-1', { Text: { value: 'After' } }));
    await flush(fixture);

    expect(fixture.nativeElement.textContent).toContain('After');
    expect(fixture.nativeElement.textContent).not.toContain('Before');
  });

  it('should ignore messages with the wrong event name', async () => {
    const rendering = makeRendering();
    setMockContextPage(makeDlPage(rendering));

    const fixture = createFixture();
    await flush(fixture);
    const renderedBefore = postedStatuses().filter((s) => s === 'rendered').length;

    window.dispatchEvent(
      updateMessage('uid-1', { Title: { value: 'Nope' } }, undefined, { name: 'component:other' })
    );
    await flush(fixture);

    expect((rendering.fields as Record<string, { value: string }>).Title.value).toBe('Original');
    expect(postedStatuses().filter((s) => s === 'rendered').length).toBe(renderedBefore);
  });

  it('should ignore messages with an empty origin', async () => {
    const rendering = makeRendering();
    setMockContextPage(makeDlPage(rendering));

    const fixture = createFixture();
    await flush(fixture);

    window.dispatchEvent(
      updateMessage('uid-1', { Title: { value: 'Nope' } }, undefined, { origin: '' })
    );
    await flush(fixture);

    expect((rendering.fields as Record<string, { value: string }>).Title.value).toBe('Original');
  });

  it('should unsubscribe the update handler on destroy', async () => {
    const rendering = makeRendering();
    setMockContextPage(makeDlPage(rendering));

    const fixture = createFixture();
    await flush(fixture);

    fixture.destroy();

    window.dispatchEvent(
      updateMessage('uid-1', { Title: { value: 'AfterDestroy' } }, { size: 'xl' })
    );
    await Promise.resolve();

    expect((rendering.fields as Record<string, { value: string }>).Title.value).toBe('Original');
  });
});

describe('ScDesignLibraryComponent variant generation', () => {
  let postSpy: ReturnType<typeof vi.spyOn>;

  function postedEventNames(): string[] {
    return (postSpy.mock.calls as unknown[][])
      .map((call) => (call[0] as { name?: string })?.name ?? '')
      .filter(Boolean);
  }

  async function flush(fixture: ComponentFixture<ScDesignLibraryComponent>): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise((r) => setTimeout(r, 0));
    fixture.detectChanges();
    await fixture.whenStable();
  }

  function configure(providers: unknown[] = []): void {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [ScDesignLibraryComponent],
      providers: [
        ...provideMockSitecoreContext(),
        { provide: PLATFORM_ID, useValue: 'browser' },
        ...(providers as never[]),
      ],
    });
  }

  function createFixture(): ComponentFixture<ScDesignLibraryComponent> {
    return TestBed.createComponent(ScDesignLibraryComponent);
  }

  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'debug').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    postSpy = vi.spyOn(window, 'postMessage').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should post import-map and props events and render the generated component', async () => {
    const factory = stubFactory();
    configure([{ provide: DESIGN_LIBRARY_COMPONENT_FACTORY, useValue: factory }, provideImportMap]);
    setMockContextPage(makeDlPage(makeRendering(), true));

    const fixture = createFixture();
    await flush(fixture);

    // Handshake events posted after subscribing to the preview channel.
    expect(postedEventNames()).toContain('component:generation:import-map');
    expect(postedEventNames()).toContain('component:generation:component-props');

    window.dispatchEvent(previewMessage(previewPayload()));
    await flush(fixture);

    expect(factory.compile).toHaveBeenCalledWith('export class Generated {}', importMap);
    expect(fixture.nativeElement.textContent).toContain('GENERATED');
  });

  it('should resolve the import map from the DESIGN_LIBRARY_IMPORT_MAP provider', async () => {
    const factory = stubFactory();
    configure([
      { provide: DESIGN_LIBRARY_COMPONENT_FACTORY, useValue: factory },
      { provide: DESIGN_LIBRARY_IMPORT_MAP, useValue: () => Promise.resolve(importMap) },
    ]);
    setMockContextPage(makeDlPage(makeRendering(), true));

    const fixture = createFixture();
    await flush(fixture);

    expect(postedEventNames()).toContain('component:generation:import-map');

    window.dispatchEvent(previewMessage(previewPayload()));
    await flush(fixture);

    expect(factory.compile).toHaveBeenCalledWith('export class Generated {}', importMap);
    expect(fixture.nativeElement.textContent).toContain('GENERATED');
  });

  it('should post an error event when no import map is available', async () => {
    const factory = stubFactory();
    configure([{ provide: DESIGN_LIBRARY_COMPONENT_FACTORY, useValue: factory }]);
    setMockContextPage(makeDlPage(makeRendering(), true));

    const fixture = createFixture();
    await flush(fixture);

    // ImportMapMissing maps to the general design-library error event.
    expect(postedEventNames()).toContain('component:generation:error');
    expect(postedEventNames()).not.toContain('component:generation:import-map');
  });

  it('should not subscribe to preview events in library (non-variant-generation) mode', async () => {
    const factory = stubFactory();
    configure([{ provide: DESIGN_LIBRARY_COMPONENT_FACTORY, useValue: factory }, provideImportMap]);
    setMockContextPage(makeDlPage(makeRendering(), false));

    const fixture = createFixture();
    await flush(fixture);

    window.dispatchEvent(previewMessage(previewPayload()));
    await flush(fixture);

    expect(factory.compile).not.toHaveBeenCalled();
    expect(postedEventNames()).not.toContain('component:generation:import-map');
  });

  it('should render a generated component that declares only some inputs without NG0303', async () => {
    // StubFieldsOnlyComponent declares `fields` but not `params`; the outlet must set only declared
    // inputs, otherwise NgComponentOutlet's setInput throws NG0303 during change detection.
    const factory = stubFactory(StubFieldsOnlyComponent);
    configure([{ provide: DESIGN_LIBRARY_COMPONENT_FACTORY, useValue: factory }, provideImportMap]);
    setMockContextPage(makeDlPage(makeRendering(), true));

    const fixture = createFixture();
    await flush(fixture);

    window.dispatchEvent(previewMessage(previewPayload()));
    await flush(fixture);

    // A clean render (with content) proves the undeclared `params` input was filtered out.
    expect(fixture.nativeElement.textContent).toContain('FIELDS-ONLY');
  });

  /** Preview-error events posted to Studio, with their error `type`. */
  function postedPreviewErrors(): string[] {
    return (postSpy.mock.calls as unknown[][])
      .map((call) => call[0] as { name?: string; message?: { type?: string } })
      .filter((evt) => evt?.name === 'component:generation:component-preview-error')
      .map((evt) => evt.message?.type ?? '');
  }

  it('should contain a render-time error in the generated component and report it as Render', async () => {
    const factory = stubFactory(StubThrowingComponent);
    configure([{ provide: DESIGN_LIBRARY_COMPONENT_FACTORY, useValue: factory }, provideImportMap]);
    setMockContextPage(makeDlPage(makeRendering(), true));

    const fixture = createFixture();
    await flush(fixture);

    window.dispatchEvent(previewMessage(previewPayload()));
    await flush(fixture);

    // The boundary shows the fallback instead of a blank/broken preview.
    expect(fixture.nativeElement.textContent).toContain('Error during component rendering');
    // ...and reports a render-time error so Studio can regenerate
    expect(postedPreviewErrors()).toContain('render');
  });

  it('should recover on a subsequent successful preview after a render error', async () => {
    const factory: DesignLibraryComponentFactory & { compile: ReturnType<typeof vi.fn> } = {
      compile: vi
        .fn()
        .mockResolvedValueOnce(StubThrowingComponent)
        .mockResolvedValueOnce(StubGeneratedComponent),
    };
    configure([{ provide: DESIGN_LIBRARY_COMPONENT_FACTORY, useValue: factory }, provideImportMap]);
    setMockContextPage(makeDlPage(makeRendering(), true));

    const fixture = createFixture();
    await flush(fixture);

    window.dispatchEvent(previewMessage(previewPayload()));
    await flush(fixture);
    expect(fixture.nativeElement.textContent).toContain('Error during component rendering');

    // A new preview (renderKey bump) recreates the component and clears the error.
    window.dispatchEvent(previewMessage(previewPayload()));
    await flush(fixture);
    expect(fixture.nativeElement.textContent).toContain('GENERATED');
    expect(fixture.nativeElement.textContent).not.toContain('Error during component rendering');
  });
});
