/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable no-unused-expressions */
import { expect, use } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { ComponentUpdateModel, PreviewEventModel } from './update-server-component-action';
import { COMPONENT_UPDATE_CACHE_KEY_PREFIX } from '@sitecore-content-sdk/content/editing';
import { ComponentRendering } from '@sitecore-content-sdk/content/layout';
import {
  ServerComponentPreviewEventArgs,
  GeneratedComponentData,
} from '@sitecore-content-sdk/content/codegen';
import proxyquire from 'proxyquire';

use(sinonChai);

describe('Server Component Actions', () => {
  let sandbox: sinon.SinonSandbox;
  let refreshStub: sinon.SinonStub;
  let setCacheStub: sinon.SinonStub;
  let debugEditingStub: sinon.SinonStub;
  let fetchGeneratedComponentFromCacheStub: sinon.SinonStub;
  let updateComponentAction: any;
  let previewComponentAction: any;
  let isDesignLibraryAuthorizedFromHeadersStub: sinon.SinonStub;
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    setCacheStub = sandbox.stub();
    refreshStub = sandbox.stub();
    debugEditingStub = sandbox.stub();
    fetchGeneratedComponentFromCacheStub = sandbox.stub();
    isDesignLibraryAuthorizedFromHeadersStub = sandbox.stub().resolves(true);

    originalEnv = process.env;
    process.env = { ...originalEnv };
    // edge url is resolved on the server from env variables only
    delete process.env.NEXT_PUBLIC_SITECORE_EDGE_PLATFORM_HOSTNAME;
    delete process.env.SITECORE_EDGE_PLATFORM_HOSTNAME;

    const module = proxyquire('./update-server-component-action', {
      'next/cache': {
        refresh: refreshStub,
      },
      '@sitecore-content-sdk/core/tools': {
        setCache: setCacheStub,
      },
      '@sitecore-content-sdk/content': {
        debug: {
          editing: debugEditingStub,
        },
      },
      '@sitecore-content-sdk/content/codegen': {
        fetchGeneratedComponentFromCache: fetchGeneratedComponentFromCacheStub,
      },
      '../utils/utils': {
        isDesignLibraryAuthorizedFromHeaders: isDesignLibraryAuthorizedFromHeadersStub,
      },
    });

    updateComponentAction = module.updateComponentAction;
    previewComponentAction = module.previewComponentAction;
  });

  afterEach(() => {
    sandbox.restore();
    process.env = originalEnv;
  });

  describe('updateComponentAction', () => {
    const generatedComponentData: GeneratedComponentData = {
      uid: 'test-uid-456',
      code: {
        type: 'function',
        content: 'const Component = () => <div>Generated</div>',
      },
      styles: {
        type: 'style-element',
        content: '.generated { color: blue; }',
        styleImport: {
          name: 'styles',
          content: {},
        },
      },
      imports: [],
    };

    it('should set cache with updated fields and params only', async () => {
      const componentUpdate: ComponentUpdateModel = {
        uid: 'test-uid-123',
        rendering: {
          uid: 'test-uid-123',
          componentName: 'ContentBlock',
          fields: {
            heading: { value: 'Updated Heading' },
            content: { value: 'Updated Content' },
          },
          params: {
            variant: 'primary',
          },
        } as ComponentRendering,
      };

      await updateComponentAction(componentUpdate);

      expect(setCacheStub).to.have.been.calledOnce;
      expect(refreshStub).to.have.been.calledOnce;
      expect(setCacheStub).to.have.been.calledWith(
        `${COMPONENT_UPDATE_CACHE_KEY_PREFIX}test-uid-123`,
        {
          uid: 'test-uid-123',
          rendering: {
            fields: componentUpdate.rendering!.fields,
            params: componentUpdate.rendering!.params,
          },
        }
      );
      expect(debugEditingStub).to.have.been.calledWith(
        'Updating server component cache for Update Component: test-uid-123'
      );
      expect(fetchGeneratedComponentFromCacheStub).to.not.have.been.called;
    });

    it('should ignore generated component data sent by the client', async () => {
      const maliciousUpdate = {
        uid: 'test-uid-456',
        generatedComponentData,
        rendering: {
          uid: 'test-uid-456',
          componentName: 'ContentBlock',
          params: { variant: 'primary' },
          generatedComponentData,
        },
      };

      await updateComponentAction(maliciousUpdate as unknown as ComponentUpdateModel);

      expect(setCacheStub).to.have.been.calledOnce;
      const cached = setCacheStub.getCall(0).args[1];
      expect(cached).to.deep.equal({
        uid: 'test-uid-456',
        rendering: { fields: undefined, params: { variant: 'primary' } },
      });
      expect(fetchGeneratedComponentFromCacheStub).to.not.have.been.called;
      expect(refreshStub).to.have.been.calledOnce;
    });

    it('should fetch generated component data from the production Edge url when no env variable is set', async () => {
      fetchGeneratedComponentFromCacheStub.resolves(generatedComponentData);

      await updateComponentAction({
        uid: 'test-uid-456',
        cache: { id: 'cache-id-1', token: 'token-1' },
      });

      expect(fetchGeneratedComponentFromCacheStub).to.have.been.calledOnceWith(
        'cache-id-1',
        'token-1',
        'https://edge-platform.sitecorecloud.io'
      );
      expect(setCacheStub).to.have.been.calledOnceWith(
        `${COMPONENT_UPDATE_CACHE_KEY_PREFIX}test-uid-456`,
        {
          uid: 'test-uid-456',
          rendering: undefined,
          generatedComponentData,
        }
      );
      expect(refreshStub).to.have.been.calledOnce;
    });

    it('should ignore an edge url provided by the client', async () => {
      fetchGeneratedComponentFromCacheStub.resolves(generatedComponentData);

      // a malicious caller may pass extra arguments to the server action
      await (updateComponentAction as any)(
        { uid: 'test-uid-456', cache: { id: 'cache-id-1', token: 'token-1' } },
        'https://attacker.example.com'
      );

      expect(fetchGeneratedComponentFromCacheStub).to.have.been.calledOnceWith(
        'cache-id-1',
        'token-1',
        'https://edge-platform.sitecorecloud.io'
      );
    });

    it('should set error in cache when fetching generated component data fails', async () => {
      const fetchError = new Error('Response Status: 401');
      fetchGeneratedComponentFromCacheStub.rejects(fetchError);

      await updateComponentAction({
        uid: 'test-uid-456',
        cache: { id: 'cache-id-1', token: 'expired-token' },
      });

      expect(setCacheStub).to.have.been.calledOnce;
      expect(setCacheStub).to.have.been.calledWith(
        `${COMPONENT_UPDATE_CACHE_KEY_PREFIX}test-uid-456`,
        {
          uid: 'test-uid-456',
          rendering: undefined,
          error: fetchError.message,
        }
      );
      expect(debugEditingStub).to.have.been.calledWith(
        'Error fetching generated component data from cache for Component: test-uid-456',
        fetchError
      );
      expect(refreshStub).to.have.been.calledOnce;
    });

    it('should not update cache when editing secret is invalid', async () => {
      isDesignLibraryAuthorizedFromHeadersStub.resolves(false);

      const componentUpdate: ComponentUpdateModel = {
        uid: 'test-uid-unauthorized',
        rendering: {
          uid: 'test-uid-unauthorized',
          componentName: 'ContentBlock',
        } as ComponentRendering,
      };

      try {
        await updateComponentAction(componentUpdate);
        expect.fail('expected updateComponentAction to reject');
      } catch (error) {
        expect((error as Error).message).to.equal('Unauthorized');
      }

      expect(setCacheStub).to.not.have.been.called;
      expect(refreshStub).to.not.have.been.called;
      expect(debugEditingStub).to.have.been.calledWith('empty / invalid editing secret');
    });
  });

  describe('previewComponentAction', () => {
    const fetchedGeneratedComponentData: GeneratedComponentData = {
      uid: 'test-uid-789',
      code: {
        type: 'function',
        content: 'const Component = () => <div>Fetched</div>',
      },
      styles: {
        type: 'style-element',
        content: '.fetched { color: green; }',
        styleImport: {
          name: 'styles',
          content: {},
        },
      },
      imports: [],
    };

    const getArgs = (id: string, token: string): ServerComponentPreviewEventArgs => ({
      name: 'component:generation:component-preview',
      message: { cache: { id, token } },
    });

    it('should not update cache when editing secret is invalid', async () => {
      isDesignLibraryAuthorizedFromHeadersStub.resolves(false);

      try {
        await previewComponentAction(
          { uid: 'test-uid-unauthorized', args: undefined as any },
          null
        );
        expect.fail('expected previewComponentAction to reject');
      } catch (error) {
        expect((error as Error).message).to.equal('Unauthorized');
      }

      expect(setCacheStub).to.not.have.been.called;
      expect(refreshStub).to.not.have.been.called;
      expect(fetchGeneratedComponentFromCacheStub).to.not.have.been.called;
    });

    it('should fetch generated component data and store the component state', async () => {
      fetchGeneratedComponentFromCacheStub.resolves(fetchedGeneratedComponentData);
      const rendering: ComponentRendering = {
        uid: 'test-uid-789',
        componentName: 'TestComponent',
        fields: { heading: { value: 'Heading' } },
        params: { theme: 'dark' },
      };
      const previewEvent: PreviewEventModel = {
        uid: 'test-uid-789',
        args: getArgs('cache-id-123', 'cache-token-456'),
      };

      process.env.NEXT_PUBLIC_SITECORE_EDGE_PLATFORM_HOSTNAME = 'https://custom-edge.example.com';
      // a malicious caller may pass an extra edge url argument - it must be ignored
      await (previewComponentAction as any)(
        previewEvent,
        rendering,
        'https://attacker.example.com'
      );

      expect(fetchGeneratedComponentFromCacheStub).to.have.been.calledOnceWith(
        'cache-id-123',
        'cache-token-456',
        'https://custom-edge.example.com'
      );
      expect(setCacheStub).to.have.been.calledOnceWith(
        `${COMPONENT_UPDATE_CACHE_KEY_PREFIX}test-uid-789`,
        {
          uid: 'test-uid-789',
          rendering: { fields: rendering.fields, params: rendering.params },
          generatedComponentData: fetchedGeneratedComponentData,
        }
      );
      expect(debugEditingStub).to.have.been.calledWith(
        'Updating server component cache for Preview Component: test-uid-789'
      );
      expect(refreshStub).to.have.been.calledOnce;
    });

    it('should store an error when no preview event arguments provided', async () => {
      await previewComponentAction({ uid: 'test-uid-no-preview', args: undefined as any }, null);

      expect(fetchGeneratedComponentFromCacheStub).to.not.have.been.called;
      expect(setCacheStub).to.have.been.calledOnceWith(
        `${COMPONENT_UPDATE_CACHE_KEY_PREFIX}test-uid-no-preview`,
        {
          uid: 'test-uid-no-preview',
          error: 'No preview event arguments provided',
        }
      );
      expect(debugEditingStub).to.have.been.calledWith(
        'No preview event arguments provided for Component: test-uid-no-preview'
      );
      expect(refreshStub).to.have.been.calledOnce;
    });

    it('should store an error when fetching generated component data fails', async () => {
      const fetchError = new Error(
        'Failed to fetch generated component data from cache for id: cache-id-error. Response Status: 404, Response Status Text: Not Found'
      );
      fetchGeneratedComponentFromCacheStub.rejects(fetchError);

      await previewComponentAction(
        { uid: 'test-uid-error', args: getArgs('cache-id-error', 'cache-token-error') },
        null
      );

      expect(setCacheStub).to.have.been.calledOnceWith(
        `${COMPONENT_UPDATE_CACHE_KEY_PREFIX}test-uid-error`,
        {
          uid: 'test-uid-error',
          rendering: undefined,
          error: fetchError.message,
        }
      );
      expect(debugEditingStub).to.have.been.calledWith(
        'Error fetching generated component data from cache for Component: test-uid-error',
        fetchError
      );
      expect(refreshStub).to.have.been.calledOnce;
    });
  });
});
