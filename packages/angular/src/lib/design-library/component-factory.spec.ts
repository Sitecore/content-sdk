/* eslint-disable */
import { TestBed } from '@angular/core/testing';
import { describe, it, expect } from 'vitest';
import { NgIf } from '@angular/common';
import type { ImportEntry } from '@sitecore-content-sdk/content/codegen';
import {
  RuntimeCompileComponentFactory,
  DESIGN_LIBRARY_COMPONENT_FACTORY,
  type DesignLibraryComponentFactory,
} from './component-factory';

/**
 * Plain-JS preview payload: assigns a decorator-free class to `exports.component` and inline
 * metadata to `exports.metadata`. The factory compiles it explicitly via `@angular/compiler`.
 */
const COMPONENT_PAYLOAD = `
  exports.component = class GeneratedComponent {
    title = '';
  };
  exports.metadata = {
    selector: 'app-generated',
    template: '<p>{{ title }}</p>',
    inputs: ['title'],
  };
`;

describe('RuntimeCompileComponentFactory.compile', () => {
  const factory = new RuntimeCompileComponentFactory();

  it('should compile a preview payload into a renderable Angular component class', async () => {
    const component = await factory.compile(COMPONENT_PAYLOAD, []);

    expect(typeof component).toBe('function');
    // The explicit `ɵcompileComponent` call attaches ɵcmp.
    expect('ɵcmp' in component).toBe(true);
  });

  it('should produce a class that can be instantiated and rendered', async () => {
    const component = await factory.compile(COMPONENT_PAYLOAD, []);

    const fixture = TestBed.createComponent(component);
    fixture.componentRef.setInput('title', 'Hello Design Library');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Hello Design Library');
  });

  it('should resolve namespace (`*`) imports from the import map', async () => {
    const importMap: ImportEntry[] = [
      { module: '@angular/common', exports: [{ name: '*', value: { NgIf } }] },
    ];
    const source = `
      const common = imports['@angular/common'];
      exports.component = class NsComponent {};
      exports.metadata = { selector: 'app-ns', template: 'ns', imports: [common.NgIf] };
    `;

    const component = await factory.compile(source, importMap);
    expect('ɵcmp' in component).toBe(true);
  });

  it('should throw when the payload does not provide a component and metadata', async () => {
    const source = `exports.notAComponent = 42;`;

    await expect(factory.compile(source, [])).rejects.toThrow(
      /must assign `exports.component` and `exports.metadata`/
    );
  });

  it('should throw when an imported module is missing from the import map', async () => {
    const source = `
      const missing = imports['unregistered-module'];
      exports.component = class XComponent {};
      exports.metadata = { selector: 'app-x', template: 'x' };
    `;

    await expect(factory.compile(source, [])).rejects.toThrow(
      /Module 'unregistered-module' is not in the import map/
    );
  });

  it('should implement the DesignLibraryComponentFactory contract', () => {
    const typed: DesignLibraryComponentFactory = factory;
    expect(typeof typed.compile).toBe('function');
  });
});

describe('DESIGN_LIBRARY_COMPONENT_FACTORY token', () => {
  it('should default to RuntimeCompileComponentFactory', () => {
    const factory = TestBed.inject(DESIGN_LIBRARY_COMPONENT_FACTORY);
    expect(factory).toBeInstanceOf(RuntimeCompileComponentFactory);
  });

  it('should allow overriding with a custom implementation', () => {
    class StubFactory implements DesignLibraryComponentFactory {
      compile = () => Promise.resolve(class {});
    }

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: DESIGN_LIBRARY_COMPONENT_FACTORY, useClass: StubFactory }],
    });

    expect(TestBed.inject(DESIGN_LIBRARY_COMPONENT_FACTORY)).toBeInstanceOf(StubFactory);
  });
});
