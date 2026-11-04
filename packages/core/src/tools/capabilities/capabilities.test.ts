/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import fs from 'fs';
import sinon from 'sinon';
import { CapabilityFilterContext } from '../../capabilities';
import {
  createCapabilityFilterContext,
  mergeCapabilityExports,
  MergedCapabilityTree,
  resolveCapabilities,
} from './index';

const context: CapabilityFilterContext = {
  appRoot: '/app',
  fileExists: () => false,
  readFile: () => undefined,
  fileContains: () => false,
};

describe('capabilities', () => {
  afterEach(() => sinon.restore());

  it('exposes resolved Sitecore configuration to filters', () => {
    const sitecoreConfig = { disableCodeGeneration: true };

    expect(createCapabilityFilterContext('/app', sitecoreConfig).sitecoreConfig).to.equal(
      sitecoreConfig
    );
  });

  it('exposes custom application inputs to filters and metadata resolvers', () => {
    const appInputs = { atomsCatalog: { components: [] } };

    expect(createCapabilityFilterContext('/app', undefined, appInputs).appInputs).to.equal(
      appInputs
    );
  });

  it('returns false from fileExists when existence checks throw', () => {
    const context = createCapabilityFilterContext('/app');
    sinon.stub(fs, 'existsSync').throws(new Error('EINVAL'));

    expect(context.fileExists('src/server.ts')).to.equal(false);
  });

  it('merges boolean capabilities using OR', async () => {
    const merged = mergeCapabilityExports([
      { packageName: 'one', capabilities: { preview: { value: false } } },
      { packageName: 'two', capabilities: { preview: { value: true } } },
    ]);

    expect(await resolveCapabilities(merged, context)).to.deep.equal({ preview: true });
  });

  it('deeply merges named sub-capabilities', async () => {
    const merged = mergeCapabilityExports([
      {
        packageName: 'one',
        capabilities: {
          preview: {
            value: { item: { value: true } },
          },
        },
      },
      {
        packageName: 'two',
        capabilities: {
          preview: {
            value: { version: { value: true } },
          },
        },
      },
    ]);

    expect(await resolveCapabilities(merged, context)).to.deep.equal({
      preview: { item: true, version: true },
    });
  });

  it('merges Design Studio sub-capabilities from product and CLI packages', async () => {
    const parentFilter = sinon.stub().returns(true);
    const merged = mergeCapabilityExports([
      {
        packageName: '@sitecore-content-sdk/nextjs',
        capabilities: {
          designLibrary: {
            value: { variantGeneration: { value: true }, variantPreview: { value: true } },
            filter: parentFilter,
          },
        },
      },
      {
        packageName: '@sitecore-content-sdk/cli',
        capabilities: {
          designLibrary: { value: { aiComponentImport: { value: true } } },
        },
      },
    ]);

    expect(await resolveCapabilities(merged, context)).to.deep.equal({
      designLibrary: { variantGeneration: true, variantPreview: true, aiComponentImport: true },
    });
    expect(parentFilter.calledOnce).to.be.true;
  });

  it('drops CLI Design Studio sub-capabilities when the product filter fails', async () => {
    const merged = mergeCapabilityExports([
      {
        packageName: '@sitecore-content-sdk/nextjs',
        capabilities: {
          designLibrary: {
            value: { variantGeneration: { value: true } },
            filter: () => false,
          },
        },
      },
      {
        packageName: '@sitecore-content-sdk/cli',
        capabilities: {
          designLibrary: { value: { aiComponentImport: { value: true } } },
        },
      },
    ]);

    expect(await resolveCapabilities(merged, context)).to.deep.equal({});
  });

  describe('resolveCapabilities function metadata', () => {
    it('writes metadata returned by a synchronous resolver on a boolean capability', async () => {
      const metadataResolver = sinon.stub().returns({ catalogKey: 'atomsCatalog' });
      const tree: MergedCapabilityTree = {
        preview: {
          value: true,
          filters: [],
          metadata: metadataResolver,
        },
      };

      expect(await resolveCapabilities(tree, context)).to.deep.equal({
        preview: { metadata: { catalogKey: 'atomsCatalog' } },
      });
      expect(metadataResolver.calledOnceWith(context)).to.be.true;
    });

    it('writes metadata returned by an async resolver', async () => {
      const metadataResolver = sinon.stub().resolves({ version: 2 });
      const tree: MergedCapabilityTree = {
        editing: {
          value: true,
          filters: [],
          metadata: metadataResolver,
        },
      };

      expect(await resolveCapabilities(tree, context)).to.deep.equal({
        editing: { metadata: { version: 2 } },
      });
    });

    it('passes appInputs on the filter context to the metadata resolver', async () => {
      const contextWithInputs: CapabilityFilterContext = {
        ...context,
        appInputs: { atomsCatalog: { components: [] } },
      };
      const metadataResolver = sinon
        .stub()
        .callsFake((ctx: CapabilityFilterContext) => ({
          catalog: ctx.appInputs?.atomsCatalog,
        }));
      const tree: MergedCapabilityTree = {
        preview: {
          value: true,
          filters: [],
          metadata: metadataResolver,
        },
      };

      expect(await resolveCapabilities(tree, contextWithInputs)).to.deep.equal({
        preview: { metadata: { catalog: { components: [] } } },
      });
    });

    it('omits metadata when the resolver returns an empty object', async () => {
      const tree: MergedCapabilityTree = {
        preview: {
          value: true,
          filters: [],
          metadata: () => ({}),
        },
      };

      expect(await resolveCapabilities(tree, context)).to.deep.equal({ preview: true });
    });

    it('writes resolved metadata on a parent alongside sub-capabilities', async () => {
      const tree: MergedCapabilityTree = {
        designLibrary: {
          value: {
            atoms: {
              value: true,
              filters: [],
              metadata: {},
            },
          },
          filters: [],
          metadata: () => ({ catalogKey: 'atomsCatalog' }),
        },
      };

      expect(await resolveCapabilities(tree, context)).to.deep.equal({
        designLibrary: {
          atoms: true,
          metadata: { catalogKey: 'atomsCatalog' },
        },
      });
    });

    it('keeps a parent when only function metadata is present and sub-capabilities are disabled', async () => {
      const tree: MergedCapabilityTree = {
        designLibrary: {
          value: {
            atoms: {
              value: false,
              filters: [],
              metadata: {},
            },
          },
          filters: [],
          metadata: () => ({ catalogKey: 'atomsCatalog' }),
        },
      };

      expect(await resolveCapabilities(tree, context)).to.deep.equal({
        designLibrary: {
          metadata: { catalogKey: 'atomsCatalog' },
        },
      });
    });
  });

  describe('mergeCapabilityExports function metadata', () => {
    it('keeps a metadata resolver exported by a single package', async () => {
      const merged = mergeCapabilityExports([
        {
          packageName: 'one',
          capabilities: { preview: { value: true, metadata: () => ({ catalog: {} }) } },
        },
      ]);

      expect(await resolveCapabilities(merged, context)).to.deep.equal({
        preview: { metadata: { catalog: {} } },
      });
    });

    it('replaces earlier static metadata with a later metadata resolver', async () => {
      const merged = mergeCapabilityExports([
        {
          packageName: 'one',
          capabilities: { preview: { value: true, metadata: { owner: 'one' } } },
        },
        {
          packageName: 'two',
          capabilities: { preview: { value: true, metadata: async () => ({ catalog: {} }) } },
        },
      ]);

      expect(await resolveCapabilities(merged, context)).to.deep.equal({
        preview: { metadata: { catalog: {} } },
      });
    });

    it('keeps an earlier metadata resolver when a later package exports no metadata', async () => {
      const merged = mergeCapabilityExports([
        {
          packageName: 'one',
          capabilities: { preview: { value: true, metadata: () => ({ catalog: {} }) } },
        },
        {
          packageName: 'two',
          capabilities: { preview: { value: true } },
        },
      ]);

      expect(await resolveCapabilities(merged, context)).to.deep.equal({
        preview: { metadata: { catalog: {} } },
      });
    });

    it('does not run metadata resolvers when the capability filter fails', async () => {
      const metadataResolver = sinon.stub().returns({ catalog: {} });
      const merged = mergeCapabilityExports([
        {
          packageName: 'one',
          capabilities: {
            preview: { value: true, filter: () => false, metadata: metadataResolver },
          },
        },
      ]);

      expect(await resolveCapabilities(merged, context)).to.deep.equal({});
      expect(metadataResolver.called).to.be.false;
    });
  });

  it('merges and writes capability metadata', async () => {
    const merged = mergeCapabilityExports([
      {
        packageName: 'one',
        capabilities: {
          preview: {
            value: true,
            metadata: { owner: 'one', version: 1 },
          },
        },
      },
      {
        packageName: 'two',
        capabilities: {
          preview: {
            value: true,
            metadata: { owner: 'two' },
          },
        },
      },
    ]);

    expect(await resolveCapabilities(merged, context)).to.deep.equal({
      preview: {
        metadata: { owner: 'two', version: 1 },
      },
    });
  });

  it('omits a capability when one of its filters returns false', async () => {
    const passingFilter = sinon.stub().resolves(true);
    const failingFilter = sinon.stub().resolves(false);
    const merged = mergeCapabilityExports([
      {
        packageName: 'one',
        capabilities: { editing: { value: true, filter: passingFilter } },
      },
      {
        packageName: 'two',
        capabilities: { editing: { value: true, filter: failingFilter } },
      },
    ]);

    expect(await resolveCapabilities(merged, context)).to.deep.equal({});
    expect(passingFilter.calledOnceWith(context)).to.be.true;
    expect(failingFilter.calledOnceWith(context)).to.be.true;
  });

  it('omits a parent when its filter fails', async () => {
    const parentFilter = sinon.stub().returns(false);
    const merged = mergeCapabilityExports([
      {
        packageName: 'one',
        capabilities: {
          preview: {
            value: { item: { value: true } },
            filter: parentFilter,
          },
        },
      },
    ]);

    expect(await resolveCapabilities(merged, context)).to.deep.equal({});
  });

  it('omits a capability when its filter throws', async () => {
    const merged = mergeCapabilityExports([
      {
        packageName: 'one',
        capabilities: {
          abTesting: {
            value: true,
            filter: () => {
              throw new Error('failed');
            },
          },
        },
      },
    ]);

    expect(await resolveCapabilities(merged, context)).to.deep.equal({});
  });

  it('ignores a package export that throws during merge and keeps earlier packages', async () => {
    const merged = mergeCapabilityExports([
      { packageName: 'one', capabilities: { preview: { value: true } } },
      {
        packageName: 'two',
        capabilities: {
          editing: {
            get value(): boolean {
              throw new Error('broken export');
            },
          },
        },
      },
      { packageName: 'three', capabilities: { abTesting: { value: true } } },
    ]);

    expect(await resolveCapabilities(merged, context)).to.deep.equal({
      preview: true,
      abTesting: true,
    });
  });
});
