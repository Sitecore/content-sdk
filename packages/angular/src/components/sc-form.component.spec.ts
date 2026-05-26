/* eslint-disable jsdoc/require-jsdoc */
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PLATFORM_ID } from '@angular/core';
import type { Page } from '@sitecore-content-sdk/content/client';
import { LayoutServicePageState } from '@sitecore-content-sdk/content/layout';
import type { ComponentRendering } from '@sitecore-content-sdk/content/layout';
import { ScFormComponent } from './sc-form.component';
import { SITECORE_CONFIG_TOKEN } from '../lib/tokens';
import {
  provideMockSitecoreContext,
  setMockContextPage,
} from '../testing/mock-sitecore-context';

const mocks = vi.hoisted(() => ({
  loadForm: vi.fn(),
  executeScriptElements: vi.fn(),
  subscribeToFormSubmitEvent: vi.fn(),
}));

vi.mock('@sitecore-content-sdk/content', async (importOriginal) => {
  const original = await importOriginal<typeof import('@sitecore-content-sdk/content')>();
  return {
    ...original,
    form: {
      loadForm: (...args: unknown[]) => mocks.loadForm(...args),
      executeScriptElements: mocks.executeScriptElements,
      subscribeToFormSubmitEvent: mocks.subscribeToFormSubmitEvent,
    },
  };
});

const testSitecoreConfig = {
  api: {
    edge: {
      clientContextId: 'test-edge-context-id',
      edgeUrl: 'https://edge.example.com',
    },
  },
} as const;

function formRendering(
  params: Record<string, string>,
  extra: Partial<ComponentRendering> = {}
): ComponentRendering {
  return { componentName: 'Form', params, ...extra } as ComponentRendering;
}

const makePage = (isEditing: boolean): Page =>
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
  } as unknown as Page);

/**
 * Flush afterNextRender and loadForm promise (scripts / subscribe run in the same microtask).
 * @param {ComponentFixture} fixture
 */
async function flushFormLoadPipeline(fixture: ComponentFixture<ScFormComponent>): Promise<void> {
  fixture.detectChanges();
  await fixture.whenStable();
  await vi.waitFor(() => mocks.loadForm.mock.calls.length > 0, { timeout: 3000, interval: 5 });
  await fixture.whenStable();
  fixture.detectChanges();
  await fixture.whenStable();
  for (let i = 0; i < 50; i++) {
    if (mocks.executeScriptElements.mock.calls.length > 0) break;
    await new Promise<void>((r) => setTimeout(r, 0));
  }
  expect(mocks.executeScriptElements.mock.calls.length).toBeGreaterThan(0);
  fixture.detectChanges();
  await fixture.whenStable();
}

describe('ScFormComponent', () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;
  let warnSpy: ReturnType<typeof vi.spyOn>;

  function createFixture(): ComponentFixture<ScFormComponent> {
    return TestBed.createComponent(ScFormComponent);
  }

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.loadForm.mockResolvedValue('<p data-sc-form="1">loaded</p>');

    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [ScFormComponent],
      providers: [
        ...provideMockSitecoreContext(),
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: SITECORE_CONFIG_TOKEN, useValue: testSitecoreConfig },
      ],
    });
  });

  afterEach(() => {
    errorSpy.mockRestore();
    warnSpy.mockRestore();
  });

  it('should not call loadForm on the server', async () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [ScFormComponent],
      providers: [
        ...provideMockSitecoreContext(),
        { provide: PLATFORM_ID, useValue: 'server' },
        { provide: SITECORE_CONFIG_TOKEN, useValue: testSitecoreConfig },
      ],
    });

    const fixture = createFixture();
    fixture.componentRef.setInput('rendering', formRendering({ FormId: 'form-1' }));
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise<void>((r) => setTimeout(r, 50));

    expect(mocks.loadForm).not.toHaveBeenCalled();
  });

  it('should not call loadForm when FormId is missing', async () => {
    const fixture = createFixture();
    fixture.componentRef.setInput('rendering', formRendering({}));
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise<void>((r) => setTimeout(r, 50));

    expect(mocks.loadForm).not.toHaveBeenCalled();
  });

  it('should call loadForm with edge context id, FormId, and edgeUrl from config', async () => {
    const fixture = createFixture();
    fixture.componentRef.setInput('rendering', formRendering({ FormId: 'my-form-id' }));
    await flushFormLoadPipeline(fixture);

    expect(mocks.loadForm).toHaveBeenCalledWith(
      'test-edge-context-id',
      'my-form-id',
      'https://edge.example.com'
    );
  });

  it('should use merged params when params input supplies FormId missing on rendering', async () => {
    const fixture = createFixture();
    fixture.componentRef.setInput('rendering', formRendering({ RenderingIdentifier: 'r-1' }));
    fixture.componentRef.setInput('params', { FormId: 'form-from-params-only' });
    await flushFormLoadPipeline(fixture);

    expect(mocks.loadForm).toHaveBeenCalledWith(
      'test-edge-context-id',
      'form-from-params-only',
      'https://edge.example.com'
    );
  });

  it('should prefer FormId from params input over rendering when both are provided', async () => {
    const fixture = createFixture();
    fixture.componentRef.setInput('rendering', formRendering({ FormId: 'rendering-form-id' }));
    fixture.componentRef.setInput('params', { FormId: 'component-form-id' });
    await flushFormLoadPipeline(fixture);

    expect(mocks.loadForm).toHaveBeenCalledWith(
      'test-edge-context-id',
      'component-form-id',
      'https://edge.example.com'
    );
  });

  it('should apply styles from params when rendering has no styles param', async () => {
    const fixture = createFixture();
    fixture.componentRef.setInput('rendering', formRendering({ FormId: 'f1' }));
    fixture.componentRef.setInput('params', { styles: '  from-params-style  ' });
    fixture.detectChanges();
    await fixture.whenStable();

    const host = fixture.nativeElement.querySelector('div') as HTMLDivElement;
    expect(host.className.trim()).toBe('from-params-style');
  });

  it('should not call loadForm when clientContextId is missing (no SITECORE_CONFIG_TOKEN)', async () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [ScFormComponent],
      providers: [
        ...provideMockSitecoreContext(),
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });

    const fixture = createFixture();
    fixture.componentRef.setInput('rendering', formRendering({ FormId: 'fid' }));
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise<void>((r) => setTimeout(r, 50));

    expect(mocks.loadForm).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalled();
    expect(String(warnSpy.mock.calls[0][0])).toContain('clientContextId');
  });

  it('should set loaded HTML into the container via innerHTML', async () => {
    // Markup is assigned on the container element ref (not [innerHTML], which sanitizes scripts).
    mocks.loadForm.mockResolvedValue('<p class="sc-form-inner" data-f="1">Inner</p>');

    const fixture = createFixture();
    fixture.componentRef.setInput('rendering', formRendering({ FormId: 'f1' }));
    await flushFormLoadPipeline(fixture);

    const host = fixture.nativeElement.querySelector('div') as HTMLDivElement;
    expect(host.querySelector('p.sc-form-inner')).toBeTruthy();
    expect(host.textContent).toContain('Inner');
  });

  it('should bind styles param as class with trailing whitespace trimmed', async () => {
    const fixture = createFixture();
    fixture.componentRef.setInput(
      'rendering',
      formRendering({
        FormId: 'f1',
        styles: '  my-form-style  ',
      })
    );
    fixture.detectChanges();
    await fixture.whenStable();

    const host = fixture.nativeElement.querySelector('div') as HTMLDivElement;
    expect(host.className.trim()).toBe('my-form-style');
  });

  it('should bind RenderingIdentifier as element id', async () => {
    const fixture = createFixture();
    fixture.componentRef.setInput(
      'rendering',
      formRendering({
        FormId: 'f1',
        RenderingIdentifier: 'form-rendering-42',
      })
    );
    fixture.detectChanges();
    await fixture.whenStable();

    const host = fixture.nativeElement.querySelector('div') as HTMLDivElement;
    expect(host.id).toBe('form-rendering-42');
  });

  it('should call executeScriptElements on the container after load', async () => {
    const fixture = createFixture();
    setMockContextPage(makePage(false));

    fixture.componentRef.setInput('rendering', formRendering({ FormId: 'f1' }));
    await flushFormLoadPipeline(fixture);

    expect(mocks.executeScriptElements).toHaveBeenCalledTimes(1);
    const elArg = mocks.executeScriptElements.mock.calls[0][0] as HTMLDivElement;
    expect(elArg.tagName).toBe('DIV');
  });

  it('should call subscribeToFormSubmitEvent when not in editing mode', async () => {
    const fixture = createFixture();
    setMockContextPage(makePage(false));

    fixture.componentRef.setInput(
      'rendering',
      formRendering({ FormId: 'f1' }, { uid: 'comp-uid-1' })
    );
    await flushFormLoadPipeline(fixture);

    expect(mocks.subscribeToFormSubmitEvent).toHaveBeenCalledTimes(1);
    expect(mocks.subscribeToFormSubmitEvent).toHaveBeenCalledWith(
      expect.any(HTMLElement),
      'comp-uid-1'
    );
  });

  it('should not call subscribeToFormSubmitEvent in editing mode', async () => {
    const fixture = createFixture();
    setMockContextPage(makePage(true));

    fixture.componentRef.setInput('rendering', formRendering({ FormId: 'f1' }, { uid: 'x' }));
    await flushFormLoadPipeline(fixture);

    expect(mocks.subscribeToFormSubmitEvent).not.toHaveBeenCalled();
    expect(mocks.executeScriptElements).toHaveBeenCalled();
  });

  it('should log when loadForm rejects', async () => {
    mocks.loadForm.mockRejectedValue(new Error('network'));

    const fixture = createFixture();
    fixture.componentRef.setInput('rendering', formRendering({ FormId: 'bad-form' }));
    fixture.detectChanges();
    await fixture.whenStable();
    await vi.waitFor(() => errorSpy.mock.calls.length > 0, { timeout: 3000, interval: 5 });

    expect(String(errorSpy.mock.calls[0][0])).toContain('bad-form');
  });
});
