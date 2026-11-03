import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import { z } from 'zod';
import { CapabilityFilterContext } from '@sitecore-content-sdk/core';
import { ATOMS_CATALOG_METADATA_KEY } from '@sitecore-content-sdk/content/atoms';
import { defineAtomsCatalog } from '@sitecore-content-sdk/react';
import { getAtomsMetadata, hasAtomsConfig, usesAtomsConfig } from './Atoms';

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

describe('getAtomsMetadata', () => {
  const sandbox = sinon.createSandbox();

  const createContext = (appInputs?: Record<string, unknown>): CapabilityFilterContext =>
    (({ appRoot: '/app', appInputs } as unknown) as CapabilityFilterContext);

  afterEach(() => {
    sandbox.restore();
  });

  it('should serialize the catalog passed in app inputs', async () => {
    const catalog = defineAtomsCatalog({
      version: '1.0.0',
      stylingSolution: 'tailwind',
      components: {
        Text: { props: z.object({ content: z.string() }), description: 'A text node' },
      },
      actions: {},
    });

    const metadata = await getAtomsMetadata(
      createContext({ [ATOMS_CATALOG_METADATA_KEY]: catalog })
    );

    expect(metadata.catalog).to.deep.include({ version: '1.0.0', stylingSolution: 'tailwind' });
    expect((metadata.catalog as { components: { name: string }[] }).components).to.have.length(1);
    expect((metadata.catalog as { components: { name: string }[] }).components[0].name).to.equal(
      'Text'
    );
  });

  it('should serialize schemas without a JSON Schema equivalent instead of throwing', async () => {
    const catalog = defineAtomsCatalog({
      components: {
        Event: { props: z.object({ date: z.date() }), description: 'An event' },
      },
      actions: {},
    });

    const metadata = await getAtomsMetadata(
      createContext({ [ATOMS_CATALOG_METADATA_KEY]: catalog })
    );

    expect((metadata.catalog as { components: unknown[] }).components).to.have.length(1);
  });

  it('should write an empty catalog when no catalog is passed', async () => {
    expect(await getAtomsMetadata(createContext())).to.deep.equal({ catalog: {} });
    expect(await getAtomsMetadata(createContext({}))).to.deep.equal({ catalog: {} });
  });

  it('should write an empty catalog and log when the catalog cannot be serialized', async () => {
    const logStub = sandbox.stub(console, 'error');

    const metadata = await getAtomsMetadata(
      createContext({ [ATOMS_CATALOG_METADATA_KEY]: { data: null } })
    );

    expect(metadata).to.deep.equal({ catalog: {} });
    expect(logStub.calledOnce).to.equal(true);
  });
});
