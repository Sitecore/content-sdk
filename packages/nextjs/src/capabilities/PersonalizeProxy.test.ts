import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import { CapabilityFilterContext } from '@sitecore-content-sdk/core';
import { hasPersonalizeProxy, importsPersonalizeProxy } from './PersonalizeProxy';

describe('importsPersonalizeProxy', () => {
  it('should match PersonalizeProxy imported from the proxy module', () => {
    expect(
      importsPersonalizeProxy(`import {
  defineProxy,
  PersonalizeProxy,
  type ProxyBase,
} from '@sitecore-content-sdk/nextjs/proxy';`)
    ).to.equal(true);
  });

  it('should match an aliased PersonalizeProxy', () => {
    expect(
      importsPersonalizeProxy(
        "import { PersonalizeProxy as Personalize } from '@sitecore-content-sdk/nextjs/proxy';"
      )
    ).to.equal(true);
  });

  it('should not match other proxies', () => {
    expect(
      importsPersonalizeProxy(
        "import { defineProxy, RedirectsProxy } from '@sitecore-content-sdk/nextjs/proxy';"
      )
    ).to.equal(false);
  });

  it('should not match PersonalizeProxy imported from another module', () => {
    expect(
      importsPersonalizeProxy("import { PersonalizeProxy } from './lib/personalize-proxy';")
    ).to.equal(false);
  });

  it('should not match type-only imports', () => {
    expect(
      importsPersonalizeProxy(
        "import type { PersonalizeProxy } from '@sitecore-content-sdk/nextjs/proxy';"
      )
    ).to.equal(false);
  });
});

describe('hasPersonalizeProxy', () => {
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

  it('should pass when any source file imports PersonalizeProxy', async () => {
    stubSourceEntries(['proxy.ts', 'lib/proxies/personalize.ts']);
    const context = createContext({
      'src/proxy.ts': "import { defineProxy } from '@sitecore-content-sdk/nextjs/proxy';",
      'src/lib/proxies/personalize.ts':
        "import { PersonalizeProxy } from '@sitecore-content-sdk/nextjs/proxy';",
    });

    expect(await hasPersonalizeProxy(context)).to.equal(true);
  });

  it('should fail when no source file imports PersonalizeProxy', async () => {
    stubSourceEntries(['proxy.ts']);
    const context = createContext({
      'src/proxy.ts': "import { defineProxy } from '@sitecore-content-sdk/nextjs/proxy';",
    });

    expect(await hasPersonalizeProxy(context)).to.equal(false);
  });

  it('should fail when the source directory is missing', async () => {
    sandbox.stub(fs, 'readdirSync').throws(new Error('ENOENT'));

    expect(await hasPersonalizeProxy(createContext({}))).to.equal(false);
  });
});
