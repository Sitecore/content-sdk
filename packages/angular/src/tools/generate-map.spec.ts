import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getComponentList } from '@sitecore-content-sdk/content/node-tools';
import {
  buildComponentMapContent,
  prepareComponentsForMap,
} from '@sitecore-content-sdk/content/tools';
import type {
  ComponentFile,
  ComponentImport,
  ComponentMapEntry,
  EnhancedComponentMapTemplate,
} from '@sitecore-content-sdk/content/tools';

const readState = vi.hoisted(() => ({
  readFileImpl: (_filePath: string): string => '@Component({})\nexport class Default {}',
}));

const fsMock = vi.hoisted(() => ({
  readFileSync: vi.fn((filePath: unknown, _encoding?: unknown) =>
    readState.readFileImpl(String(filePath))
  ),
  mkdirSync: vi.fn(),
  writeFileSync: vi.fn(),
}));

vi.mock('node:fs', () => fsMock);

vi.mock('@sitecore-content-sdk/content/node-tools', () => ({
  getComponentList: vi.fn(),
}));

vi.mock('@sitecore-content-sdk/content/tools', () => ({
  prepareComponentsForMap: vi.fn(),
  buildComponentMapContent: vi.fn(() => '// generated map'),
}));

import { generateMap } from '../tools/generate-map';

const mockGetComponentList = vi.mocked(getComponentList);
const mockPrepareComponentsForMap = vi.mocked(prepareComponentsForMap);
const mockBuildComponentMapContent = vi.mocked(buildComponentMapContent);

const ANGULAR_BUILTIN_IMPORTS = `import { ScFormComponent } from '@sitecore-content-sdk/angular';`;

const ANGULAR_BUILTIN_MAP_ENTRIES = [`['Form', ScFormComponent]`];

const makeComponent = (
  overrides: Partial<ComponentFile> & Pick<ComponentFile, 'filePath'>
): ComponentFile => ({
  importPath: './',
  moduleName: 'Mod',
  componentName: 'Comp',
  ...overrides,
});

describe('generateMap', () => {
  const preparedEntries: ComponentMapEntry[] = [
    { key: 'Hero', imports: [], valueExpr: 'HeroMod', annotateClient: false },
  ];

  let cwdSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    cwdSpy = vi.spyOn(process, 'cwd').mockReturnValue('/project/root');
    readState.readFileImpl = () => '@Component({})\nexport class Default {}';
    fsMock.readFileSync.mockClear();
    fsMock.mkdirSync.mockClear();
    fsMock.writeFileSync.mockClear();
    mockPrepareComponentsForMap.mockReset();
    mockPrepareComponentsForMap.mockReturnValue(preparedEntries);
    mockBuildComponentMapContent.mockReset();
    mockBuildComponentMapContent.mockReturnValue('// map file body');
    mockGetComponentList.mockReset();
    mockGetComponentList.mockReturnValue([]);
  });

  afterEach(() => {
    cwdSpy.mockRestore();
  });

  it('should pass paths, exclude, includeVariants into getComponentList', () => {
    const paths = ['src/app/a', 'src/app/b'];
    const exclude = ['**/*.spec.ts'];

    generateMap({ paths, exclude, includeVariants: false });

    expect(mockGetComponentList).toHaveBeenCalledWith(paths, exclude, false);
  });

  it('should default includeVariants to true when omitted', () => {
    generateMap({ paths: ['src/components'] });

    expect(mockGetComponentList).toHaveBeenCalledWith(['src/components'], undefined, true);
  });

  it('should only add components with @Component directive for component map processing', () => {
    const withDecorator = makeComponent({
      filePath: '/project/root/src/with.component.ts',
      componentName: 'With',
      moduleName: 'With',
      importPath: 'src/with.component',
    });
    const withoutDecorator = makeComponent({
      filePath: '/project/root/src/plain.ts',
      componentName: 'Plain',
      moduleName: 'Plain',
      importPath: 'src/plain',
    });
    mockGetComponentList.mockReturnValue([withDecorator, withoutDecorator]);

    readState.readFileImpl = (filePath) => {
      const p = String(filePath).replace(/\\/g, '/');
      if (p.includes('with.component')) {
        return `import { Component } from '@angular/core';\n@Component({ standalone: true })\nexport class With {}`;
      }
      return `export const x = 1;`;
    };

    generateMap({ paths: ['src'] });

    expect(fsMock.readFileSync).toHaveBeenCalled();
    expect(mockPrepareComponentsForMap).toHaveBeenCalledTimes(1);
    const [passedComponents] = mockPrepareComponentsForMap.mock.calls[0];
    expect(passedComponents).toHaveLength(1);
    expect(passedComponents[0].filePath).toContain('with.component');
  });

  it('should use default buildAngularComponentMap function when no mapTemplate is provided', () => {
    const comp = makeComponent({
      filePath: '/project/root/src/a.component.ts',
      componentName: 'A',
      moduleName: 'A',
      importPath: 'src/a.component',
    });
    mockGetComponentList.mockReturnValue([comp]);

    generateMap({ paths: ['src'] });

    expect(mockBuildComponentMapContent).toHaveBeenCalledTimes(1);
  });

  it('should pass angular default imports and builtin entries into component map', () => {
    const comp = makeComponent({
      filePath: '/project/root/src/x.component.ts',
      componentName: 'X',
      moduleName: 'X',
      importPath: 'src/x.component',
    });
    mockGetComponentList.mockReturnValue([comp]);

    const componentImports: ComponentImport[] = [
      { importName: 'Lib', importInfo: { importFrom: '@lib/pkg', namedImports: ['A'] } },
    ];

    generateMap({ paths: ['src'], componentImports });

    const [entries, passedImports, options] = mockBuildComponentMapContent.mock.calls[0];
    expect(entries).toEqual(preparedEntries);
    expect(passedImports).toEqual(componentImports);
    const opts = options as { builtInImports?: string; builtInMapEntries?: string[] };
    expect(opts.builtInImports).toBe(ANGULAR_BUILTIN_IMPORTS);
    expect(opts.builtInMapEntries).toEqual(ANGULAR_BUILTIN_MAP_ENTRIES);
  });

  it('should pass angular as framework to buildComponentMapContent', () => {
    const comp = makeComponent({
      filePath: '/project/root/src/a.component.ts',
      componentName: 'A',
      moduleName: 'A',
      importPath: 'src/a.component',
    });
    mockGetComponentList.mockReturnValue([comp]);

    generateMap({ paths: ['src'] });

    expect(mockBuildComponentMapContent).toHaveBeenCalledWith(
      preparedEntries,
      undefined,
      expect.objectContaining({ framework: 'angular' })
    );
  });

  it('should use mapTemplate override function when provided', () => {
    const comp = makeComponent({
      filePath: '/project/root/src/a.component.ts',
      componentName: 'A',
      moduleName: 'A',
      importPath: 'src/a.component',
    });
    mockGetComponentList.mockReturnValue([comp]);

    const customTemplate = vi.fn().mockReturnValue('CUSTOM_MAP_BODY');

    generateMap({ paths: ['src'], mapTemplate: customTemplate as EnhancedComponentMapTemplate });

    expect(customTemplate).toHaveBeenCalledTimes(1);
    const [comps, imports, ctx] = customTemplate.mock.calls[0];
    expect(comps).toHaveLength(1);
    expect(comps[0]).toEqual(comp);
    expect(imports).toBeUndefined();
    expect(ctx).toEqual({ entries: preparedEntries, includeVariants: true, isClientMap: false });
    expect(mockBuildComponentMapContent).not.toHaveBeenCalled();
    expect(fsMock.writeFileSync).toHaveBeenCalledWith(
      expect.stringMatching(/[\\/]component-map\.ts$/),
      'CUSTOM_MAP_BODY',
      'utf8'
    );
  });
});
