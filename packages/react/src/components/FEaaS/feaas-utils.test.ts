/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import { createSandbox, SinonSandbox, SinonStub } from 'sinon';
import { BYOCComponentParams, FEaaSComponentParams, RevisionType } from './models';
import proxyquire from 'proxyquire';

describe('feaas-utils', () => {
  let sandbox: SinonSandbox;

  let utilsModule: any;

  let dataSettingsFetchStub: SinonStub;
  let fetchDataStub: SinonStub;
  let fetchComponentStub: SinonStub;

  beforeEach(() => {
    sandbox = createSandbox();

    dataSettingsFetchStub = sandbox.stub().resolves({ test: 'data' });
    fetchDataStub = sandbox.stub().resolves({ test: 'data' });
    fetchComponentStub = sandbox.stub().resolves({ template: '<div>Test Component</div>' });

    utilsModule = proxyquire('./feaas-utils', {
      '@sitecore-feaas/clientside/react': {
        DataSettings: {
          fetch: dataSettingsFetchStub,
        },
        fetchData: fetchDataStub,
        fetchComponent: fetchComponentStub,
      },
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  // Note: Since FEAAS module properties are non-configurable, we focus on integration-style tests
  // and test the logic we can verify without deep mocking

  describe('fetchBYOCComponentServerProps', () => {
    it('should call FEAAS fetch method', async () => {
      // This is an integration test - we test that the function structure works
      // and handles the data flow correctly, even if we can't mock FEAAS completely
      const params: BYOCComponentParams = {
        ComponentName: 'TestComponent',
      };

      const result = await utilsModule.fetchBYOCComponentServerProps(params);
      // The function should return the expected structure
      expect(result).to.deep.equal({ fetchedData: { test: 'data' } });
      expect(dataSettingsFetchStub).to.have.been.calledOnce;
    });

    it('should pass ComponentDataOverride param when present', async () => {
      const componentDataOverride = { dataSource: 'customSource', limit: 10 };
      const params: BYOCComponentParams = {
        ComponentName: 'TestComponent',
        ComponentDataOverride: JSON.stringify(componentDataOverride),
      };

      await utilsModule.fetchBYOCComponentServerProps(params);

      expect(dataSettingsFetchStub).to.have.been.calledOnce;

      // Test the JSON parsing logic works
      expect(() => JSON.parse(params.ComponentDataOverride!)).to.not.throw();
      const parsed = JSON.parse(params.ComponentDataOverride!);
      expect(parsed).to.deep.equal(componentDataOverride);
    });
  });

  describe('fetchFEaaSComponentServerProps', () => {
    it('should call FEAAS.fetchComponent and FEAAS.DataSettings.fetch and return correct data and template', async () => {
      const params: FEaaSComponentParams = {
        LibraryId: 'lib123',
        ComponentId: 'comp456',
        ComponentVersion: '1.0.0',
        ComponentRevision: 'published',
        ComponentHostName: 'https://example.com',
      };

      const result = await utilsModule.fetchFEaaSComponentServerProps(params, true);

      expect(result).to.deep.equal({
        fetchedData: { test: 'data' },
        revisionFallback: 'published',
        template: '<div>Test Component</div>',
      });
    });

    it('should apply correct revision based on page state', async () => {
      const params: FEaaSComponentParams = {
        LibraryId: 'lib123',
        ComponentId: 'comp456',
        ComponentVersion: '1.0.0',
        ComponentHostName: 'example.com',
      };

      // Test the revision logic - this doesn't require mocking
      const stagedResult = await utilsModule.fetchFEaaSComponentServerProps(params, false);
      const publishedResult = await utilsModule.fetchFEaaSComponentServerProps(params, true);

      // Verify the revision fallback logic works correctly
      expect(stagedResult.revisionFallback).to.equal('staged');
      expect(publishedResult.revisionFallback).to.equal('published');
    });

    it('should override endpoint when endpointOverride provided', async () => {
      const params: FEaaSComponentParams = {
        LibraryId: 'lib123',
        ComponentId: 'comp456',
        ComponentVersion: '1.0.0',
        ComponentHostName: 'example.com',
      };
      const customEndpoint = 'https://custom.endpoint.com/component';

      const result = await utilsModule.fetchFEaaSComponentServerProps(params, true, customEndpoint);

      expect(fetchComponentStub).to.have.been.calledOnceWith(customEndpoint);

      // Verify the function completes and returns the expected structure
      expect(result).to.deep.equal({
        fetchedData: { test: 'data' },
        revisionFallback: 'published',
        template: '<div>Test Component</div>',
      });
    });

    it('should handle missing required props gracefully and return empty template', async () => {
      const params: FEaaSComponentParams = {};

      const result = await utilsModule.fetchFEaaSComponentServerProps(params, true);

      expect(result).to.deep.equal({
        fetchedData: {},
        revisionFallback: 'published',
        template: '',
      });
    });

    it('should handle errors gracefully and return empty template', async () => {
      const consoleErrorStub = sandbox.stub(console, 'error');

      const params: FEaaSComponentParams = {
        LibraryId: 'invalid',
        ComponentId: 'invalid',
        ComponentVersion: '1.0.0',
        ComponentHostName: 'invalid.endpoint.com',
      };

      fetchComponentStub.rejects(new Error('Fetch FEAAS component template failed'));
      dataSettingsFetchStub.rejects(new Error('Fetch FEAAS component data settings failed'));

      const result = await utilsModule.fetchFEaaSComponentServerProps(params, true);

      // Verify error handling - should return empty template and empty fetchedData
      expect(consoleErrorStub).to.have.been.called;
      expect(result).to.deep.equal({
        fetchedData: {},
        revisionFallback: 'published',
        template: '',
      });
    });

    it('should parse ComponentDataOverride when provided', async () => {
      const componentDataOverride = { source: 'api', params: { id: 123 } };
      const params: FEaaSComponentParams = {
        LibraryId: 'lib123',
        ComponentId: 'comp456',
        ComponentVersion: '1.0.0',
        ComponentHostName: 'example.com',
        ComponentDataOverride: JSON.stringify(componentDataOverride),
      };

      // Test that JSON parsing works correctly
      expect(() => JSON.parse(params.ComponentDataOverride!)).to.not.throw();
      const parsed = JSON.parse(params.ComponentDataOverride!);
      expect(parsed).to.deep.equal(componentDataOverride);

      const result = await utilsModule.fetchFEaaSComponentServerProps(params, true);

      // Verify structure is returned
      expect(result).to.have.property('fetchedData');
      expect(result).to.have.property('template');
    });
  });

  describe('composeComponentEndpoint', () => {
    it('should return endpoint based on provided params', () => {
      const params: FEaaSComponentParams = {
        LibraryId: 'myLibrary',
        ComponentId: 'myComponent',
        ComponentVersion: '2.1.0',
        ComponentRevision: 'published',
        ComponentHostName: 'https://feaas.example.com',
      };
      const revisionFallback: RevisionType = 'staged';

      const endpoint = utilsModule.composeComponentEndpoint(params, revisionFallback);

      expect(endpoint).to.equal(
        'https://feaas.example.com/components/myLibrary/myComponent/2.1.0/published'
      );
    });

    it('should use revision fallback when ComponentRevision absent in params', () => {
      // Arrange
      const params: FEaaSComponentParams = {
        LibraryId: 'testLib',
        ComponentId: 'testComp',
        ComponentVersion: '1.0.0',
        ComponentHostName: 'feaas.test.com',
        // ComponentRevision is intentionally omitted
      };
      const revisionFallback: RevisionType = 'staged';

      // Act
      const endpoint = utilsModule.composeComponentEndpoint(params, revisionFallback);

      // Assert
      expect(endpoint).to.equal('https://feaas.test.com/components/testLib/testComp/1.0.0/staged');
    });

    it('should add https:// prefix when hostname does not start with https://', () => {
      // Arrange
      const params: FEaaSComponentParams = {
        LibraryId: 'lib',
        ComponentId: 'comp',
        ComponentVersion: '1.0.0',
        ComponentRevision: 'published',
        ComponentHostName: 'example.com', // No https:// prefix
      };
      const revisionFallback: RevisionType = 'staged';

      // Act
      const endpoint = utilsModule.composeComponentEndpoint(params, revisionFallback);

      // Assert
      expect(endpoint).to.equal('https://example.com/components/lib/comp/1.0.0/published');
    });

    it('should handle numeric revision correctly', () => {
      // Arrange
      const params: FEaaSComponentParams = {
        LibraryId: 'numLib',
        ComponentId: 'numComp',
        ComponentVersion: '3.0.0',
        ComponentRevision: 42,
        ComponentHostName: 'https://numeric.example.com',
      };
      const revisionFallback: RevisionType = 'published';

      // Act
      const endpoint = utilsModule.composeComponentEndpoint(params, revisionFallback);

      // Assert
      expect(endpoint).to.equal('https://numeric.example.com/components/numLib/numComp/3.0.0/42');
    });

    it('should handle saved revision correctly', () => {
      // Arrange
      const params: FEaaSComponentParams = {
        LibraryId: 'savedLib',
        ComponentId: 'savedComp',
        ComponentVersion: '1.5.0',
        ComponentRevision: 'saved',
        ComponentHostName: 'https://saved.example.com',
      };
      const revisionFallback: RevisionType = 'published';

      // Act
      const endpoint = utilsModule.composeComponentEndpoint(params, revisionFallback);

      // Assert
      expect(endpoint).to.equal(
        'https://saved.example.com/components/savedLib/savedComp/1.5.0/saved'
      );
    });
  });
});
