import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import { CapabilityFilterContext } from '@sitecore-content-sdk/core';
import { hasDesignLibrary, importsDesignLibrary } from './DesignLibrary';

describe('importsDesignLibrary', () => {
  it('should match DesignLibrary imported from the Next.js package', () => {
    expect(
      importsDesignLibrary(
        "import { Placeholder, DesignLibrary, Page } from '@sitecore-content-sdk/nextjs';"
      )
    ).to.equal(true);
  });

  it('should match DesignLibraryApp imported from a package subpath', () => {
    expect(
      importsDesignLibrary('import { DesignLibraryApp } from "@sitecore-content-sdk/nextjs/client";')
    ).to.equal(true);
  });

  it('should match DesignLibrary imported from the React package', () => {
    expect(
      importsDesignLibrary("import { DesignLibrary } from '@sitecore-content-sdk/react';")
    ).to.equal(true);
  });

  it('should match aliased, multiline and default-combined imports', () => {
    expect(
      importsDesignLibrary(`import Sdk, {
  Placeholder,
  DesignLibrary as Studio,
} from '@sitecore-content-sdk/nextjs';`)
    ).to.equal(true);
  });

  it('should not match type-only imports', () => {
    expect(
      importsDesignLibrary("import type { DesignLibrary } from '@sitecore-content-sdk/nextjs';")
    ).to.equal(false);
    expect(
      importsDesignLibrary("import { type DesignLibrary } from '@sitecore-content-sdk/nextjs';")
    ).to.equal(false);
  });

  it('should not match other modules or other exports', () => {
    expect(
      importsDesignLibrary("import { DesignLibrary } from './components/DesignLibrary';")
    ).to.equal(false);
    expect(
      importsDesignLibrary("import { DesignLibraryMode } from '@sitecore-content-sdk/nextjs';")
    ).to.equal(false);
  });
});

describe('hasDesignLibrary', () => {
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

  it('should pass when any source file imports a Design Library component', async () => {
    stubSourceEntries(['index.ts', 'layouts/MainLayout.tsx']);
    const context = createContext({
      'src/index.ts': 'export {};',
      'src/layouts/MainLayout.tsx': "import { DesignLibrary } from '@sitecore-content-sdk/nextjs';",
    });

    expect(await hasDesignLibrary(context)).to.equal(true);
  });

  it('should ignore declaration, test and non-source files', async () => {
    const source = "import { DesignLibrary } from '@sitecore-content-sdk/nextjs';";
    stubSourceEntries(['Layout.test.tsx', 'types.d.ts', 'Layout.spec.ts', 'notes.md']);
    const context = createContext({
      'src/Layout.test.tsx': source,
      'src/types.d.ts': source,
      'src/Layout.spec.ts': source,
      'src/notes.md': source,
    });

    expect(await hasDesignLibrary(context)).to.equal(false);
  });

  it('should fail when the source directory is missing', async () => {
    sandbox.stub(fs, 'readdirSync').throws(new Error('ENOENT'));

    expect(await hasDesignLibrary(createContext({}))).to.equal(false);
  });
});
