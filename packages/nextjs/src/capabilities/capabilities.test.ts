import { expect } from 'chai';
import fs from 'fs';
import sinon from 'sinon';
import { CapabilityFilterContext } from '@sitecore-content-sdk/core';
import capabilities from './index';

const createContext = (
  files: Record<string, string> = {},
  sitecoreConfig?: CapabilityFilterContext['sitecoreConfig']
): CapabilityFilterContext => ({
  appRoot: '/app',
  sitecoreConfig,
  fileExists: (filePath) => filePath in files,
  readFile: (filePath) => files[filePath],
  fileContains: (filePaths, pattern) =>
    filePaths.some((filePath) => {
      const contents = files[filePath];
      return typeof pattern === 'string'
        ? contents?.includes(pattern) ?? false
        : pattern.test(contents ?? '');
    }),
});

describe('Next.js capabilities', () => {
  it('exports the product capabilities', () => {
    expect(Object.keys(capabilities)).to.deep.equal([
      'preview',
      'editing',
      'abTesting',
      'byocRender',
      'feaasRender',
      'designLibrary',
    ]);
    expect(
      Object.keys(capabilities.designLibrary?.value ?? {})
    ).to.deep.equal(['variantGeneration', 'variantPreview']);
  });

  it('filters capabilities based on application wiring', async () => {
    const context = createContext({
      'src/pages/api/editing/render.ts': 'export default handler;',
      'src/byoc/index.tsx': 'export default BYOCInit;',
      'src/pages/api/editing/feaas/render.ts': 'export default handler;',
    });

    expect(await capabilities.preview?.filter?.(context)).to.equal(true);
    expect(capabilities.abTesting?.filter).to.be.a('function');
    expect(await capabilities.byocRender?.filter?.(context)).to.equal(true);
    expect(await capabilities.feaasRender?.filter?.(context)).to.equal(true);
    expect(capabilities.designLibrary?.filter).to.be.a('function');
  });

  it('filters capabilities out when application wiring is absent', async () => {
    const context = createContext();

    expect(await capabilities.preview?.filter?.(context)).to.equal(false);
    expect(await capabilities.abTesting?.filter?.(context)).to.equal(false);
    expect(await capabilities.byocRender?.filter?.(context)).to.equal(false);
    expect(await capabilities.feaasRender?.filter?.(context)).to.equal(false);
    expect(capabilities.designLibrary?.filter).to.be.a('function');
  });

  describe('byocRender', () => {
    it('should pass when the BYOC bundle exists', async () => {
      const context = createContext({ 'src/byoc/index.tsx': 'export default BYOCInit;' });

      expect(await capabilities.byocRender?.filter?.(context)).to.equal(true);
    });

    it('should fail when the BYOC bundle is missing', async () => {
      const context = createContext({
        'src/pages/api/editing/feaas/render.ts': 'export default handler;',
      });

      expect(await capabilities.byocRender?.filter?.(context)).to.equal(false);
    });
  });

  describe('feaasRender', () => {
    it('should pass for a Pages Router app with the FEaaS render route', async () => {
      const context = createContext({
        'src/pages/api/editing/feaas/render.ts': 'export default handler;',
      });

      expect(await capabilities.feaasRender?.filter?.(context)).to.equal(true);
    });

    it('should pass for an App Router app', async () => {
      const existsSyncStub = sinon
        .stub(fs, 'existsSync')
        .callsFake((filePath) => filePath.toString() === '/app/src/app');

      try {
        expect(await capabilities.feaasRender?.filter?.(createContext())).to.equal(true);
      } finally {
        existsSyncStub.restore();
      }
    });

    it('should fail for a Pages Router app without the FEaaS render route', async () => {
      const context = createContext({ 'src/byoc/index.tsx': 'export default BYOCInit;' });

      expect(await capabilities.feaasRender?.filter?.(context)).to.equal(false);
    });
  });

  describe('variantGeneration', () => {
    const filter = capabilities.designLibrary?.value.variantGeneration?.filter;

    it('should pass when code generation is enabled', async () => {
      expect(await filter?.(createContext())).to.equal(true);
    });

    it('should fail when code generation is disabled', async () => {
      const context = createContext({}, { disableCodeGeneration: true });

      expect(await filter?.(context)).to.equal(false);
    });
  });
});
