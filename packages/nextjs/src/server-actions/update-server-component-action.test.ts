/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable no-unused-expressions */
import { expect, use } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { ComponentUpdateModel, PreviewEventModel } from './update-server-component-action';
import {
  COMPONENT_UPDATE_CACHE_KEY_PREFIX,
  COMPONENT_PREVIEW_CACHE_KEY_PREFIX,
} from '@sitecore-content-sdk/content/editing';
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
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    setCacheStub = sandbox.stub();
    refreshStub = sandbox.stub();
    debugEditingStub = sandbox.stub();
    fetchGeneratedComponentFromCacheStub = sandbox.stub();

    originalEnv = process.env;
    process.env = { ...originalEnv, SITECORE_EDGE_URL: 'https://edge.sitecorecloud.io' };

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
    });

    updateComponentAction = module.updateComponentAction;
    previewComponentAction = module.previewComponentAction;
  });

  afterEach(() => {
    sandbox.restore();
    process.env = originalEnv;
  });

  describe('updateComponentAction', () => {
    it('should set cache with updated component rendering', async () => {
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
        componentUpdate
      );
      expect(debugEditingStub).to.have.been.calledWith(
        'Updating server component cache for Update Component: test-uid-123'
      );
      expect(fetchGeneratedComponentFromCacheStub).to.not.have.been.called;
    });

    it('should set cache with generated component data', async () => {
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

      const componentUpdate: ComponentUpdateModel = {
        uid: 'test-uid-456',
        generatedComponentData,
      };

      await updateComponentAction(componentUpdate);

      expect(setCacheStub).to.have.been.calledOnce;
      expect(refreshStub).to.have.been.calledOnce;
      expect(setCacheStub).to.have.been.calledWith(
        `${COMPONENT_UPDATE_CACHE_KEY_PREFIX}test-uid-456`,
        componentUpdate
      );
      expect(debugEditingStub).to.have.been.calledWith(
        'Updating server component cache for Update Component: test-uid-456'
      );
      expect(fetchGeneratedComponentFromCacheStub).to.not.have.been.called;
    });
  });

  describe('previewComponentAction', () => {
    it('should fetch generated component data when args is provided', async () => {
      const args: ServerComponentPreviewEventArgs = {
        name: 'component:generation:component-preview',
        message: {
          cache: {
            id: 'cache-id-123',
            token: 'cache-token-456',
          },
        },
      };

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

      fetchGeneratedComponentFromCacheStub.resolves(fetchedGeneratedComponentData);

      const previewEvent: PreviewEventModel = {
        uid: 'test-uid-789',
        args,
      };

      await previewComponentAction(previewEvent);

      expect(fetchGeneratedComponentFromCacheStub).to.have.been.calledOnce;
      expect(fetchGeneratedComponentFromCacheStub).to.have.been.calledWith(
        'cache-id-123',
        'cache-token-456',
        undefined
      );

      expect(setCacheStub).to.have.been.calledOnce;
      expect(setCacheStub).to.have.been.calledWith(
        `${COMPONENT_PREVIEW_CACHE_KEY_PREFIX}test-uid-789`,
        {
          uid: 'test-uid-789',
          generatedComponentData: fetchedGeneratedComponentData,
          error: undefined,
        }
      );

      expect(debugEditingStub).to.have.been.calledWith(
        'Updating server component cache for Preview Component: test-uid-789'
      );
      expect(refreshStub).to.have.been.calledOnce;
    });

    it('should set cache with undefined generatedComponentData when no args provided', async () => {
      const previewEvent: PreviewEventModel = {
        uid: 'test-uid-no-preview',
        args: undefined as any, // simulating no preview event arguments provided
      };

      await previewComponentAction(previewEvent);

      expect(fetchGeneratedComponentFromCacheStub).to.not.have.been.called;
      expect(setCacheStub).to.have.been.calledOnce;
      expect(setCacheStub).to.have.been.calledWith(
        `${COMPONENT_PREVIEW_CACHE_KEY_PREFIX}test-uid-no-preview`,
        {
          uid: 'test-uid-no-preview',
          generatedComponentData: undefined,
          error: 'No preview event arguments provided',
        }
      );
      expect(debugEditingStub).to.have.been.calledTwice;
      expect(debugEditingStub.firstCall).to.have.been.calledWith(
        'Updating server component cache for Preview Component: test-uid-no-preview'
      );
      expect(debugEditingStub.secondCall).to.have.been.calledWith(
        'No preview event arguments provided for Component: test-uid-no-preview'
      );
      expect(refreshStub).to.have.been.calledOnce;
    });

    it('should use custom edgeUrl when provided', async () => {
      const customEdgeUrl = 'https://custom-edge.example.com';

      const args: ServerComponentPreviewEventArgs = {
        name: 'component:generation:component-preview',
        message: {
          cache: {
            id: 'cache-id-env',
            token: 'cache-token-env',
          },
        },
      };

      const fetchedGeneratedComponentData: GeneratedComponentData = {
        uid: 'test-uid-env',
        code: {
          type: 'function',
          content: 'const Component = () => <div>Env Test</div>',
        },
        styles: {
          type: 'style-element',
          content: '.env { color: red; }',
          styleImport: {
            name: 'styles',
            content: {},
          },
        },
        imports: [],
      };

      fetchGeneratedComponentFromCacheStub.resolves(fetchedGeneratedComponentData);

      const previewEvent: PreviewEventModel = {
        uid: 'test-uid-env',
        args,
      };

      await previewComponentAction(previewEvent, customEdgeUrl);

      expect(fetchGeneratedComponentFromCacheStub).to.have.been.calledWith(
        'cache-id-env',
        'cache-token-env',
        customEdgeUrl
      );
    });

    it('should handle undefined edgeUrl when not provided', async () => {
      const args: ServerComponentPreviewEventArgs = {
        name: 'component:generation:component-preview',
        message: {
          cache: {
            id: 'cache-id-no-env',
            token: 'cache-token-no-env',
          },
        },
      };

      const fetchedGeneratedComponentData: GeneratedComponentData = {
        uid: 'test-uid-no-env',
        code: {
          type: 'function',
          content: 'const Component = () => <div>No Env</div>',
        },
        styles: {
          type: 'style-element',
          content: '.no-env { color: yellow; }',
          styleImport: {
            name: 'styles',
            content: {},
          },
        },
        imports: [],
      };

      fetchGeneratedComponentFromCacheStub.resolves(fetchedGeneratedComponentData);

      const previewEvent: PreviewEventModel = {
        uid: 'test-uid-no-env',
        args,
      };

      await previewComponentAction(previewEvent);

      expect(fetchGeneratedComponentFromCacheStub).to.have.been.calledWith(
        'cache-id-no-env',
        'cache-token-no-env',
        undefined
      );
    });

    it('should handle fetch errors and set error in cache', async () => {
      const args: ServerComponentPreviewEventArgs = {
        name: 'component:generation:component-preview',
        message: {
          cache: {
            id: 'cache-id-error',
            token: 'cache-token-error',
          },
        },
      };

      const fetchError = new Error(
        'Failed to fetch generated component data from cache for id: cache-id-error. Response Status: 404, Response Status Text: Not Found'
      );
      fetchGeneratedComponentFromCacheStub.rejects(fetchError);

      const previewEvent: PreviewEventModel = {
        uid: 'test-uid-error',
        args,
      };

      await previewComponentAction(previewEvent);

      expect(fetchGeneratedComponentFromCacheStub).to.have.been.calledOnce;
      expect(setCacheStub).to.have.been.calledOnce;
      expect(setCacheStub).to.have.been.calledWith(
        `${COMPONENT_PREVIEW_CACHE_KEY_PREFIX}test-uid-error`,
        {
          uid: 'test-uid-error',
          generatedComponentData: undefined,
          error: fetchError.message,
        }
      );
      expect(debugEditingStub).to.have.been.calledTwice;
      expect(debugEditingStub.firstCall).to.have.been.calledWith(
        'Updating server component cache for Preview Component: test-uid-error'
      );
      expect(debugEditingStub.secondCall).to.have.been.calledWith(
        'Error fetching generated component data from cache for Component: test-uid-error',
        fetchError
      );
      expect(refreshStub).to.have.been.calledOnce;
    });

    it('should handle non-Error fetch failures', async () => {
      const args: ServerComponentPreviewEventArgs = {
        name: 'component:generation:component-preview',
        message: {
          cache: {
            id: 'cache-id-string-error',
            token: 'cache-token-string-error',
          },
        },
      };

      const errorMessage = 'String error message';
      fetchGeneratedComponentFromCacheStub.rejects(new Error(errorMessage));

      const previewEvent: PreviewEventModel = {
        uid: 'test-uid-string-error',
        args,
      };

      await previewComponentAction(previewEvent);

      expect(setCacheStub).to.have.been.calledOnce;
      expect(setCacheStub).to.have.been.calledWith(
        `${COMPONENT_PREVIEW_CACHE_KEY_PREFIX}test-uid-string-error`,
        {
          uid: 'test-uid-string-error',
          generatedComponentData: undefined,
          error: errorMessage,
        }
      );
      expect(debugEditingStub).to.have.been.calledTwice;
      expect(debugEditingStub.firstCall).to.have.been.calledWith(
        'Updating server component cache for Preview Component: test-uid-string-error'
      );
      expect(refreshStub).to.have.been.calledOnce;
    });
  });
});
