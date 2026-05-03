/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Component } from '@angular/core';
import { ComponentRendering, RouteData } from '@sitecore-content-sdk/content/layout';
import {
  getPlaceholderRenderings,
  getSXAParams,
  getChildComponentProps,
  resolveComponentForRendering,
  ComponentMap,
  AngularModule,
  DEFAULT_EXPORT_NAME,
} from './placeholder-utils';

@Component({ selector: 'test-a', template: 'A' })
class TestComponentA {}

@Component({ selector: 'test-b', template: 'B' })
class TestComponentB {}

@Component({ selector: 'test-missing', template: 'Missing' })
class CustomMissingComponent {}

@Component({ selector: 'test-hidden', template: 'Hidden' })
class CustomHiddenComponent {}

describe('getPlaceholderRenderings', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('should return empty array and warn when placeholder not found', () => {
    const rendering: ComponentRendering = {
      componentName: 'Root',
      placeholders: {},
    };
    const result = getPlaceholderRenderings(rendering, 'nonexistent', false);
    expect(result).toEqual([]);
    expect(warnSpy).toHaveBeenCalled();
  });

  it('should return renderings for a named placeholder', () => {
    const child: ComponentRendering = { componentName: 'Child' };
    const rendering: ComponentRendering = {
      componentName: 'Root',
      placeholders: { main: [child] },
    };
    const result = getPlaceholderRenderings(rendering, 'main', false);
    expect(result).toEqual([child]);
  });

  it('should handle dynamic placeholders in non-editing mode without mutating source', () => {
    const child: ComponentRendering = { componentName: 'Child' };
    const rendering: ComponentRendering = {
      componentName: 'Root',
      placeholders: { 'container-{*}': [child] },
    };
    const result = getPlaceholderRenderings(rendering, 'container-1', false);
    expect(result).toEqual([child]);
    expect(rendering.placeholders!['container-{*}']).toEqual([child]);
    expect(rendering.placeholders!['container-1']).toBeUndefined();
  });

  it('should keep raw placeholder name in editing mode', () => {
    const child: ComponentRendering = { componentName: 'Child' };
    const rendering: ComponentRendering = {
      componentName: 'Root',
      placeholders: { 'container-{*}': [child] },
    };
    const result = getPlaceholderRenderings(rendering, 'container-1', true);
    expect(result).toEqual([child]);
    expect(rendering.placeholders!['container-{*}']).toEqual([child]);
  });

  it('should return empty array when rendering has no placeholders', () => {
    const rendering: ComponentRendering = { componentName: 'Root' };
    const result = getPlaceholderRenderings(rendering, 'main', false);
    expect(result).toEqual([]);
  });

  it('should work with RouteData', () => {
    const child: ComponentRendering = { componentName: 'Child' };
    const route: RouteData = {
      name: 'route',
      placeholders: { main: [child] },
    };
    const result = getPlaceholderRenderings(route, 'main', false);
    expect(result).toEqual([child]);
  });
});

describe('getSXAParams', () => {
  it('should return empty styles when no params', () => {
    const rendering: ComponentRendering = { componentName: 'Test' };
    expect(getSXAParams(rendering)).toEqual({ Styles: '' });
  });

  it('should return styles with GridParameters and Styles', () => {
    const rendering: ComponentRendering = {
      componentName: 'Test',
      params: { GridParameters: 'col-9', Styles: 'custom-class' },
    };
    expect(getSXAParams(rendering)).toEqual({ Styles: 'col-9 custom-class' });
  });

  it('should return styles with only GridParameters', () => {
    const rendering: ComponentRendering = {
      componentName: 'Test',
      params: { GridParameters: 'col-12' },
    };
    expect(getSXAParams(rendering)).toEqual({ Styles: 'col-12 ' });
  });

  it('should return falsy when neither GridParameters nor Styles exist', () => {
    const rendering: ComponentRendering = {
      componentName: 'Test',
      params: { other: 'value' },
    };
    expect(getSXAParams(rendering)).toBeFalsy();
  });
});

describe('getChildComponentProps', () => {
  it('should merge placeholder and rendering fields/params', () => {
    const rendering: ComponentRendering = {
      componentName: 'Child',
      fields: { title: { value: 'Hello' } },
      params: { style: 'bold', GridParameters: 'col-6', Styles: 'test' },
    };
    const result = getChildComponentProps(
      { shared: { value: 'shared' } },
      { global: 'param' },
      rendering
    );
    expect(result.fields).toEqual({
      shared: { value: 'shared' },
      title: { value: 'Hello' },
    });
    expect(result.params.global).toBe('param');
    expect(result.params.style).toBe('bold');
    expect(result.params.Styles).toBe('col-6 test');
    expect(result.rendering).toBe(rendering);
  });

  it('should handle undefined placeholder fields/params', () => {
    const rendering: ComponentRendering = {
      componentName: 'Child',
      fields: { a: { value: 1 } },
    };
    const result = getChildComponentProps(undefined, undefined, rendering);
    expect(result.fields).toEqual({ a: { value: 1 } });
    expect(result.rendering).toBe(rendering);
    expect(result.params).toEqual({ Styles: '' });
  });
});

describe('resolveComponentForRendering', () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    errorSpy.mockRestore();
    warnSpy.mockRestore();
  });

  it('should return null component for hidden rendering', () => {
    const rendering: ComponentRendering = { componentName: 'Hidden Rendering' };
    const result = resolveComponentForRendering(rendering, 'main');
    expect(result.component).toBeNull();
    expect(result.isEmpty).toBe(true);
  });

  it('should use custom hidden rendering component when provided', () => {
    const rendering: ComponentRendering = { componentName: 'Hidden Rendering' };
    const result = resolveComponentForRendering(
      rendering,
      'main',
      undefined,
      CustomHiddenComponent
    );
    expect(result.component).toBe(CustomHiddenComponent);
    expect(result.isEmpty).toBe(true);
  });

  it('should return null for empty component name', () => {
    const rendering: ComponentRendering = { componentName: '' };
    const result = resolveComponentForRendering(rendering, 'main');
    expect(result.component).toBeNull();
    expect(result.isEmpty).toBe(true);
  });

  it('should warn when no component map provided', () => {
    const rendering: ComponentRendering = { componentName: 'Widget' };
    resolveComponentForRendering(rendering, 'main');
    expect(warnSpy).toHaveBeenCalled();
  });

  it('should error when component not found in map', () => {
    const map: ComponentMap = new Map([['Other', TestComponentA]]);
    const rendering: ComponentRendering = { componentName: 'Unknown' };
    const result = resolveComponentForRendering(rendering, 'main', map);
    expect(result.component).toBeNull();
    expect(result.isEmpty).toBe(true);
    expect(errorSpy).toHaveBeenCalled();
  });

  it('should use custom missing component when provided', () => {
    const map: ComponentMap = new Map();
    const rendering: ComponentRendering = { componentName: 'Unknown' };
    const result = resolveComponentForRendering(
      rendering,
      'main',
      map,
      undefined,
      CustomMissingComponent
    );
    expect(result.component).toBe(CustomMissingComponent);
    expect(result.isEmpty).toBe(true);
  });

  it('should resolve direct component type from map', () => {
    const map: ComponentMap = new Map([['Widget', TestComponentA]]);
    const rendering: ComponentRendering = { componentName: 'Widget' };
    const result = resolveComponentForRendering(rendering, 'main', map);
    expect(result.component).toBe(TestComponentA);
    expect(result.isEmpty).toBe(false);
  });

  it('should resolve default from AngularModule', () => {
    const mod: AngularModule = { default: TestComponentA };
    const map: ComponentMap = new Map([['Widget', mod]]);
    const rendering: ComponentRendering = { componentName: 'Widget' };
    const result = resolveComponentForRendering(rendering, 'main', map);
    expect(result.component).toBe(TestComponentA);
    expect(result.isEmpty).toBe(false);
  });

  it('should resolve Default (uppercase) from AngularModule', () => {
    const mod: AngularModule = { Default: TestComponentB };
    const map: ComponentMap = new Map([['Widget', mod]]);
    const rendering: ComponentRendering = { componentName: 'Widget' };
    const result = resolveComponentForRendering(rendering, 'main', map);
    expect(result.component).toBe(TestComponentB);
    expect(result.isEmpty).toBe(false);
  });

  it('should resolve SXA variant by FieldNames param', () => {
    const mod: AngularModule = {
      default: TestComponentA,
      CustomVariant: TestComponentB,
    };
    const map: ComponentMap = new Map([['Widget', mod]]);
    const rendering: ComponentRendering = {
      componentName: 'Widget',
      params: { FieldNames: 'CustomVariant' },
    };
    const result = resolveComponentForRendering(rendering, 'main', map);
    expect(result.component).toBe(TestComponentB);
    expect(result.isEmpty).toBe(false);
  });

  it('should fall back to default when FieldNames is DEFAULT_EXPORT_NAME', () => {
    const mod: AngularModule = { default: TestComponentA };
    const map: ComponentMap = new Map([['Widget', mod]]);
    const rendering: ComponentRendering = {
      componentName: 'Widget',
      params: { FieldNames: DEFAULT_EXPORT_NAME },
    };
    const result = resolveComponentForRendering(rendering, 'main', map);
    expect(result.component).toBe(TestComponentA);
    expect(result.isEmpty).toBe(false);
  });

  it('should error when variant not found in module', () => {
    const mod: AngularModule = { default: TestComponentA };
    const map: ComponentMap = new Map([['Widget', mod]]);
    const rendering: ComponentRendering = {
      componentName: 'Widget',
      params: { FieldNames: 'NonExistent' },
    };
    const result = resolveComponentForRendering(rendering, 'main', map);
    expect(result.component).toBeNull();
    expect(result.isEmpty).toBe(true);
    expect(errorSpy).toHaveBeenCalled();
  });
});
