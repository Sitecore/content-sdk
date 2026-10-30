import { describe, expect, it } from 'vitest';
import type { CapabilityFilterContext } from '@sitecore-content-sdk/core';
import capabilities from './index';

const createContext = (
  files: Record<string, string> = {},
  sitecoreConfig?: CapabilityFilterContext['sitecoreConfig']
): CapabilityFilterContext => ({
  appRoot: '/app',
  sitecoreConfig,
  fileExists: (filePath) => filePath in files,
  readFile: (filePath) => files[filePath],
  fileContains: (filePaths, pattern) =>
    filePaths.some((filePath) => {
      const contents = files[filePath];
      return typeof pattern === 'string'
        ? contents?.includes(pattern) ?? false
        : pattern.test(contents ?? '');
    }),
});

describe('Angular capabilities', () => {
  it('nests AI capabilities under Design Studio component rendering', () => {
    expect(Object.keys(capabilities.designLibrary?.value ?? {})).toEqual([
      'variantGeneration',
      'variantPreview',
    ]);
    expect(Object.keys(capabilities.preview?.value ?? {})).toEqual(['timeBasedPreview']);
  });

  it('filters capabilities based on application wiring', async () => {
    const context = createContext({
      'src/server.ts': 'createEditingRenderMiddleware(); createPersonalizeMiddleware({});',
    });

    expect(await capabilities.abTesting?.filter?.(context)).toBe(true);
    expect(capabilities.designLibrary?.filter).toBeTypeOf('function');
  });

  it('filters capabilities out when application wiring is absent', async () => {
    const context = createContext();

    expect(await capabilities.abTesting?.filter?.(context)).toBe(false);
  });

  it('requires the personalize middleware in server.ts for A/B testing', async () => {
    const context = createContext({
      'src/server.ts': 'createEditingRenderMiddleware();',
      'src/app/personalize.ts': 'createPersonalizeMiddleware({});',
    });

    expect(await capabilities.abTesting?.filter?.(context)).toBe(false);
  });

  it('filters AI code generation using resolved Sitecore configuration', async () => {
    const filter = capabilities.designLibrary?.value.variantGeneration?.filter;

    expect(await filter?.(createContext())).toBe(true);
    expect(await filter?.(createContext({}, { disableCodeGeneration: true }))).toBe(false);
  });
});
