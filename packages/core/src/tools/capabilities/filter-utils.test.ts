/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import type { CapabilityFilterContext } from '../../capabilities';
import { importsNamedExport, someSourceFile } from './filter-utils';

describe('someSourceFile', () => {
  const sandbox = sinon.createSandbox();
  const appRoot = '/app';

  const createContext = (files: Record<string, string>): CapabilityFilterContext =>
    (({
      appRoot,
      readFile: (filePath: string) => files[filePath.replace(/\\/g, '/')],
    } as unknown) as CapabilityFilterContext);

  const stubSourceEntries = (entries: string[]) =>
    sandbox
      .stub(fs, 'readdirSync')
      .withArgs(path.join(appRoot, 'src'), sinon.match.any)
      .returns(entries as any);

  afterEach(() => {
    sandbox.restore();
  });

  it('should pass when any source file satisfies the predicate', () => {
    stubSourceEntries(['index.ts', 'layouts/MainLayout.tsx']);
    const context = createContext({
      'src/index.ts': 'export {};',
      'src/layouts/MainLayout.tsx': 'export const layout = true;',
    });

    expect(someSourceFile(context, (source) => source.includes('layout'))).to.equal(true);
  });

  it('should ignore declaration, test and non-source files', () => {
    stubSourceEntries(['Layout.test.tsx', 'types.d.ts', 'Layout.spec.ts', 'notes.md']);
    const context = createContext({
      'src/Layout.test.tsx': 'match',
      'src/types.d.ts': 'match',
      'src/Layout.spec.ts': 'match',
      'src/notes.md': 'match',
    });

    expect(someSourceFile(context, (source) => source.includes('match'))).to.equal(false);
  });

  it('should fail when the source directory is missing', () => {
    sandbox.stub(fs, 'readdirSync').throws(new Error('ENOENT'));

    expect(someSourceFile(createContext({}), () => true)).to.equal(false);
  });
});

describe('importsNamedExport', () => {
  const modulePattern = /^@sitecore-content-sdk\/(?:nextjs|react)(?:\/.*)?$/;
  const names = ['DesignLibrary', 'DesignLibraryApp'];

  it('should match a named import from a matching module', () => {
    expect(
      importsNamedExport(
        "import { Placeholder, DesignLibrary, Page } from '@sitecore-content-sdk/nextjs';",
        modulePattern,
        names
      )
    ).to.equal(true);
  });

  it('should match aliased, multiline and default-combined imports', () => {
    expect(
      importsNamedExport(
        `import Sdk, {
  Placeholder,
  DesignLibrary as Studio,
} from '@sitecore-content-sdk/nextjs';`,
        modulePattern,
        names
      )
    ).to.equal(true);
  });

  it('should not match type-only imports', () => {
    expect(
      importsNamedExport(
        "import type { DesignLibrary } from '@sitecore-content-sdk/nextjs';",
        modulePattern,
        names
      )
    ).to.equal(false);
    expect(
      importsNamedExport(
        "import { type DesignLibrary } from '@sitecore-content-sdk/nextjs';",
        modulePattern,
        names
      )
    ).to.equal(false);
  });

  it('should not match other modules or other exports', () => {
    expect(
      importsNamedExport(
        "import { DesignLibrary } from './components/DesignLibrary';",
        modulePattern,
        names
      )
    ).to.equal(false);
    expect(
      importsNamedExport(
        "import { DesignLibraryMode } from '@sitecore-content-sdk/nextjs';",
        modulePattern,
        names
      )
    ).to.equal(false);
  });
});
