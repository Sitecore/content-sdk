/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import { CapabilityFilterContext } from '../../capabilities';
import {
  createCapabilityFilterContext,
  mergeCapabilityExports,
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
});
