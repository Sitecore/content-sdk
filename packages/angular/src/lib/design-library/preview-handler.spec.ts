/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { ImportEntry } from '@sitecore-content-sdk/content/codegen';
import { addAngularComponentPreviewHandler } from './preview-handler';
import type { DesignLibraryComponentFactory } from './component-factory';

const importMap: ImportEntry[] = [
  { module: '@angular/core', exports: [{ name: 'Component', value: class {} }] },
];

function previewPayload(uid = 'uid-1', content = 'export class Generated {}') {
  return {
    uid,
    code: { type: 'function', content },
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

describe('addAngularComponentPreviewHandler', () => {
  let postSpy: ReturnType<typeof vi.spyOn>;
  let unsubscribe: (() => void) | undefined;

  function postedEventNames(): string[] {
    return (postSpy.mock.calls as unknown[][])
      .map((call) => (call[0] as { name?: string })?.name ?? '')
      .filter(Boolean);
  }

  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'debug').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    postSpy = vi.spyOn(window, 'postMessage').mockImplementation(() => {});
  });

  afterEach(() => {
    unsubscribe?.();
    unsubscribe = undefined;
    vi.restoreAllMocks();
  });

  it('should compile the payload source with the factory and return the component', async () => {
    const StubComponent = class {};
    const factory: DesignLibraryComponentFactory = {
      compile: vi.fn().mockResolvedValue(StubComponent),
    };
    const callback = vi.fn();

    unsubscribe = addAngularComponentPreviewHandler(importMap, factory, callback);
    window.dispatchEvent(previewMessage(previewPayload()));

    await vi.waitFor(() => expect(callback).toHaveBeenCalled());
    expect(factory.compile).toHaveBeenCalledWith('export class Generated {}', importMap);
    expect(callback).toHaveBeenCalledWith(null, StubComponent);
  });

  it('should log a debug message when a valid preview message is received', async () => {
    const debugSpy = vi.spyOn(console, 'debug');
    const factory: DesignLibraryComponentFactory = { compile: vi.fn().mockResolvedValue(class {}) };
    const callback = vi.fn();

    unsubscribe = addAngularComponentPreviewHandler(importMap, factory, callback);
    window.dispatchEvent(previewMessage(previewPayload()));

    await vi.waitFor(() => expect(callback).toHaveBeenCalled());
    expect(debugSpy).toHaveBeenCalledWith('Component Library: message received', expect.anything());
  });

  it('should ignore messages with the wrong event name', async () => {
    const factory: DesignLibraryComponentFactory = { compile: vi.fn().mockResolvedValue(class {}) };
    const callback = vi.fn();

    unsubscribe = addAngularComponentPreviewHandler(importMap, factory, callback);
    window.dispatchEvent(previewMessage(previewPayload(), { name: 'component:generation:other' }));

    await new Promise((r) => setTimeout(r, 20));
    expect(factory.compile).not.toHaveBeenCalled();
    expect(callback).not.toHaveBeenCalled();
  });

  it('should ignore messages with an empty origin', async () => {
    const factory: DesignLibraryComponentFactory = { compile: vi.fn().mockResolvedValue(class {}) };
    const callback = vi.fn();

    unsubscribe = addAngularComponentPreviewHandler(importMap, factory, callback);
    window.dispatchEvent(previewMessage(previewPayload(), { origin: '' }));

    await new Promise((r) => setTimeout(r, 20));
    expect(callback).not.toHaveBeenCalled();
  });

  it('should send an error event and report the error when compilation fails', async () => {
    const factory: DesignLibraryComponentFactory = {
      compile: vi.fn().mockRejectedValue(new Error('boom')),
    };
    const callback = vi.fn();

    unsubscribe = addAngularComponentPreviewHandler(importMap, factory, callback);
    window.dispatchEvent(previewMessage(previewPayload()));

    await vi.waitFor(() => expect(callback).toHaveBeenCalled());
    // The shared sendErrorEvent posts a preview-error event to Studio.
    expect(postedEventNames()).toContain('component:generation:component-preview-error');
    expect(callback.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(callback.mock.calls[0][1]).toBeNull();
  });

  it('should stop handling messages after unsubscribe', async () => {
    const factory: DesignLibraryComponentFactory = { compile: vi.fn().mockResolvedValue(class {}) };
    const callback = vi.fn();

    const unsub = addAngularComponentPreviewHandler(importMap, factory, callback);
    unsub?.();
    window.dispatchEvent(previewMessage(previewPayload()));

    await new Promise((r) => setTimeout(r, 20));
    expect(factory.compile).not.toHaveBeenCalled();
    expect(callback).not.toHaveBeenCalled();
  });
});
