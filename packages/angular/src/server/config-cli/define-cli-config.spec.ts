import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as contentConfigCli from '@sitecore-content-sdk/content/config-cli';
import type { SitecoreCliConfig } from '@sitecore-content-sdk/content/config';
import { ComponentTemplateType } from '@sitecore-content-sdk/content/config';
import type { AngularSitecoreConfig } from '../../config/define-config';
import { defineCliConfig, type AngularCsdkCliConfig } from './define-cli-config';

function createCliConfigInput(
  overrides: Omit<Partial<AngularCsdkCliConfig>, 'config'> & {
    config?: AngularSitecoreConfig;
  } = {}
): AngularCsdkCliConfig {
  return {
    config: overrides.config ?? ({} as AngularSitecoreConfig),
    ...overrides,
  };
}

describe('defineCliConfig', () => {
  beforeEach(() => {
    vi.spyOn(contentConfigCli, 'defineCliConfig').mockImplementation(
      (c) => c as unknown as SitecoreCliConfig
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should add a noop build command when build is not provided', () => {
    const result = defineCliConfig(createCliConfigInput());

    expect(result.build?.commands).toHaveLength(1);
    expect(typeof result.build!.commands![0]).toBe('function');
  });

  it('should initialize scaffold with the Angular default component template when not provided', () => {
    const result = defineCliConfig(createCliConfigInput());

    expect(result.scaffold.templates).toHaveLength(1);
    expect(result.scaffold.templates[0].name).toBe(ComponentTemplateType.DEFAULT);
    expect(result.scaffold.templates[0].fileExtension).toBe('.component.ts');

    const generated = result.scaffold.templates[0].generateTemplate('ComponentName');
    expect(generated).toContain(`import { Component } from '@angular/core'`);
    expect(generated).toContain('@Component');
    expect(generated).toContain('app-componentname');
    expect(generated).toContain('export class ComponentNameComponent');
  });

  it('should keep existing scaffold templates when provided', () => {
    const existing = { name: 'custom', fileExtension: '.ts', generateTemplate: () => 'x' };
    const result = defineCliConfig(
      createCliConfigInput({
        scaffold: { templates: [existing] },
      })
    );

    expect(result.scaffold.templates).toHaveLength(1);
    expect(result.scaffold.templates[0].name).toBe('custom');
  });

  it('should set default componentMap generator and paths', () => {
    const result = defineCliConfig(createCliConfigInput());

    expect(typeof result.componentMap?.generator).toBe('function');
    expect(result.componentMap?.paths).toEqual(['src/app/components']);
  });

  it('should let user-provided componentMap values override defaults', () => {
    const result = defineCliConfig(
      createCliConfigInput({
        componentMap: { paths: ['src/custom'] },
      })
    );

    expect(result.componentMap?.paths).toEqual(['src/custom']);
    expect(typeof result.componentMap?.generator).toBe('function');
  });
});
