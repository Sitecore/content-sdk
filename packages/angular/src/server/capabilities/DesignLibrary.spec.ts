import fs from 'fs';
import path from 'path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { CapabilityFilterContext } from '@sitecore-content-sdk/core';
import type * as AngularExports from '../../public-api';
import { DESIGN_LIBRARY_EXPORTS, hasDesignLibrary, importsDesignLibrary } from './DesignLibrary';

// Compile-time guard: fails when a listed export is renamed or removed from the package.
const exportedNames: ReadonlyArray<keyof typeof AngularExports> = DESIGN_LIBRARY_EXPORTS;

describe('importsDesignLibrary', () => {
  it('lists only package exports', () => {
    expect(exportedNames).toEqual(['ScDesignLibraryComponent']);
  });

  it('matches the Design Library component', () => {
    expect(
      importsDesignLibrary("import { ScDesignLibraryComponent } from '@sitecore-content-sdk/angular';")
    ).toBe(true);
  });

  it('matches an aliased component in a multiline import', () => {
    expect(
      importsDesignLibrary(`import {
  ScPlaceholderComponent,
  ScDesignLibraryComponent as DesignLibrary,
} from '@sitecore-content-sdk/angular';`)
    ).toBe(true);
  });

  it('does not match the Design Library preview data guard', () => {
    expect(
      importsDesignLibrary(
        "import { isDesignLibraryPreviewData } from '@sitecore-content-sdk/angular';"
      )
    ).toBe(false);
  });

  it('does not match type-only imports, other exports or other modules', () => {
    expect(
      importsDesignLibrary(
        "import type { ScDesignLibraryComponent } from '@sitecore-content-sdk/angular';"
      )
    ).toBe(false);
    expect(
      importsDesignLibrary("import { getEditingPreviewData } from '@sitecore-content-sdk/angular';")
    ).toBe(false);
    expect(
      importsDesignLibrary("import { ScDesignLibraryComponent } from './design-library';")
    ).toBe(false);
  });
});

describe('hasDesignLibrary', () => {
  const appRoot = '/app';

  const createContext = (files: Record<string, string>): CapabilityFilterContext =>
    ({
      appRoot,
      readFile: (filePath: string) => files[filePath.replace(/\\/g, '/')],
    } as unknown as CapabilityFilterContext);

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('passes when any source file imports the Design Library component', async () => {
    vi.spyOn(fs, 'readdirSync').mockReturnValue([
      'server.ts',
      'app/shared/layout.component.ts',
    ] as never);
    const context = createContext({
      'src/server.ts': 'export {};',
      'src/app/shared/layout.component.ts':
        "import { ScDesignLibraryComponent } from '@sitecore-content-sdk/angular';",
    });

    expect(await hasDesignLibrary(context)).toBe(true);
    expect(fs.readdirSync).toHaveBeenCalledWith(path.join(appRoot, 'src'), { recursive: true });
  });

  it('ignores declaration, spec and non-TypeScript files', async () => {
    const source = "import { ScDesignLibraryComponent } from '@sitecore-content-sdk/angular';";
    vi.spyOn(fs, 'readdirSync').mockReturnValue([
      'layout.component.spec.ts',
      'types.d.ts',
      'layout.component.html',
    ] as never);
    const context = createContext({
      'src/layout.component.spec.ts': source,
      'src/types.d.ts': source,
      'src/layout.component.html': source,
    });

    expect(await hasDesignLibrary(context)).toBe(false);
  });

  it('fails when the source directory is missing', async () => {
    vi.spyOn(fs, 'readdirSync').mockImplementation(() => {
      throw new Error('ENOENT');
    });

    expect(await hasDesignLibrary(createContext({}))).toBe(false);
  });
});
