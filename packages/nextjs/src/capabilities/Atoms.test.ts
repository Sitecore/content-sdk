import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import { CapabilityFilterContext } from '@sitecore-content-sdk/core';
import { hasAtomsConfig, usesAtomsConfig } from './Atoms';

describe('usesAtomsConfig', () => {
  it('should match atomsConfig passed to SitecoreProvider from the Next.js package', () => {
    expect(
      usesAtomsConfig(`
import { SitecoreProvider } from '@sitecore-content-sdk/nextjs';

export function Providers() {
  return (
    <SitecoreProvider atomsConfig={{ catalog, registry }}>
      <div />
    </SitecoreProvider>
  );
}
`)
    ).to.equal(true);
  });

  it('should match SitecoreProvider imported from the React package', () => {
    expect(
      usesAtomsConfig(
        "import { SitecoreProvider } from '@sitecore-content-sdk/react';\nconst x = { atomsConfig: {} };"
      )
    ).to.equal(true);
  });

  it('should not match when atomsConfig is absent', () => {
    expect(
      usesAtomsConfig("import { SitecoreProvider } from '@sitecore-content-sdk/nextjs';")
    ).to.equal(false);
  });

  it('should not match type-only SitecoreProvider imports', () => {
    expect(
      usesAtomsConfig(
        "import type { SitecoreProvider } from '@sitecore-content-sdk/nextjs';\nconst atomsConfig = {};"
      )
    ).to.equal(false);
  });
});

describe('hasAtomsConfig', () => {
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

  it('should pass when Providers wires atomsConfig', async () => {
    stubSourceEntries(['Providers.tsx']);
    const context = createContext({
      'src/Providers.tsx': `
import { SitecoreProvider } from '@sitecore-content-sdk/nextjs';
export default function Providers() {
  return <SitecoreProvider atomsConfig={{ catalog, registry }} />;
}
`,
    });

    expect(await hasAtomsConfig(context)).to.equal(true);
  });

  it('should fail when no source file wires atomsConfig', async () => {
    stubSourceEntries([]);
    expect(await hasAtomsConfig(createContext({}))).to.equal(false);
  });
});
