/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable no-unused-expressions */
import { expect, use } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { ComponentUpdateModel } from './update-server-component-action';
import { COMPONENT_UPDATE_CACHE_KEY_PREFIX } from '@sitecore-content-sdk/content/editing';
import { ComponentRendering } from '@sitecore-content-sdk/content/layout';
import {
  ServerComponentPreviewEventArgs,
  GeneratedComponentData,
} from '@sitecore-content-sdk/content/codegen';
import proxyquire from 'proxyquire';

use(sinonChai);

describe('updateServerComponentAction', () => {
  let sandbox: sinon.SinonSandbox;
  let setCacheStub: sinon.SinonStub;
  let debugEditingStub: sinon.SinonStub;
  let fetchGeneratedComponentFromCacheStub: sinon.SinonStub;
  let updateServerComponentAction: any;
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    setCacheStub = sandbox.stub();
    debugEditingStub = sandbox.stub();
    fetchGeneratedComponentFromCacheStub = sandbox.stub();

    originalEnv = process.env;
    process.env = { ...originalEnv, SITECORE_EDGE_URL: 'https://edge.sitecorecloud.io' };

    const module = proxyquire('./update-server-component-action', {
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

    updateServerComponentAction = module.updateServerComponentAction;
  });

  afterEach(() => {
    sandbox.restore();
    process.env = originalEnv;
  });

  it('should set cache with updated component only', async () => {
    const componentUpdate: ComponentUpdateModel = {
      uid: 'test-uid-123',
      updatedComponent: {
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

    await updateServerComponentAction(componentUpdate);

    expect(setCacheStub).to.have.been.calledOnce;
    expect(setCacheStub).to.have.been.calledWith(
      `${COMPONENT_UPDATE_CACHE_KEY_PREFIX}test-uid-123`,
      componentUpdate
    );
    expect(debugEditingStub).to.have.been.calledWith(
      'Updating server component cache for Component: test-uid-123'
    );
    expect(fetchGeneratedComponentFromCacheStub).to.not.have.been.called;
  });

  it('should fetch generated component data when serverComponentPreviewEventArgs is provided', async () => {
    const serverComponentPreviewEventArgs: ServerComponentPreviewEventArgs = {
      name: 'component:generation:component-preview',
      message: {
        cache: {
          id: 'cache-id-123',
          token: 'cache-token-456',
        },
      },
    };

    const fetchedGeneratedComponentData: GeneratedComponentData = {
      code: {
        content: 'const Component = () => <div>Fetched</div>',
      },
      styles: {
        content: '.fetched { color: green; }',
      },
    } as GeneratedComponentData;

    fetchGeneratedComponentFromCacheStub.resolves(fetchedGeneratedComponentData);

    const componentUpdate: ComponentUpdateModel = {
      uid: 'test-uid-789',
      serverComponentPreviewEventArgs,
    };

    await updateServerComponentAction(componentUpdate);

    expect(fetchGeneratedComponentFromCacheStub).to.have.been.calledOnce;
    expect(fetchGeneratedComponentFromCacheStub).to.have.been.calledWith(
      'cache-id-123',
      'cache-token-456',
      'https://edge.sitecorecloud.io'
    );

    expect(setCacheStub).to.have.been.calledOnce;
    expect(setCacheStub).to.have.been.calledWith(
      `${COMPONENT_UPDATE_CACHE_KEY_PREFIX}test-uid-789`,
      {
        uid: 'test-uid-789',
        serverComponentPreviewEventArgs,
        generatedComponentData: fetchedGeneratedComponentData,
      }
    );

    expect(debugEditingStub).to.have.been.calledWith(
      'Updating server component cache for Component: test-uid-789'
    );
  });

  it('should merge generatedComponentData with existing component update when serverComponentPreviewEventArgs is provided', async () => {
    const serverComponentPreviewEventArgs: ServerComponentPreviewEventArgs = {
      name: 'component:generation:component-preview',
      message: {
        cache: {
          id: 'cache-id-999',
          token: 'cache-token-999',
        },
      },
    };

    const fetchedGeneratedComponentData: GeneratedComponentData = {
      code: {
        type: 'function',
        content: 'const Component = () => <div>Merged</div>',
      },
      styles: {
        type: 'style-element',
        content: '.merged { color: purple; }',
        styleImport: [],
      },
    };

    fetchGeneratedComponentFromCacheStub.resolves(fetchedGeneratedComponentData);

    const componentUpdate: ComponentUpdateModel = {
      uid: 'test-uid-999',
      updatedComponent: {
        uid: 'test-uid-999',
        componentName: 'MergedBlock',
        fields: {
          title: { value: 'Merged Title' },
        },
      },
      serverComponentPreviewEventArgs,
    };

    await updateServerComponentAction(componentUpdate);

    expect(fetchGeneratedComponentFromCacheStub).to.have.been.calledOnce;
    expect(setCacheStub).to.have.been.calledOnce;
    expect(setCacheStub).to.have.been.calledWith(
      `${COMPONENT_UPDATE_CACHE_KEY_PREFIX}test-uid-999`,
      {
        uid: 'test-uid-999',
        updatedComponent: componentUpdate.updatedComponent,
        serverComponentPreviewEventArgs,
        generatedComponentData: fetchedGeneratedComponentData,
      }
    );
  });

  it('should use SITECORE_EDGE_URL from environment', async () => {
    process.env.SITECORE_EDGE_URL = 'https://custom-edge.example.com';

    const serverComponentPreviewEventArgs: ServerComponentPreviewEventArgs = {
      name: 'component:generation:component-preview',
      message: {
        cache: {
          id: 'cache-id-env',
          token: 'cache-token-env',
        },
      },
    };

    const fetchedGeneratedComponentData: GeneratedComponentData = {
      code: {
        content: 'const Component = () => <div>Env Test</div>',
      },
    } as GeneratedComponentData;

    fetchGeneratedComponentFromCacheStub.resolves(fetchedGeneratedComponentData);

    const componentUpdate: ComponentUpdateModel = {
      uid: 'test-uid-env',
      serverComponentPreviewEventArgs,
    };

    await updateServerComponentAction(componentUpdate);

    expect(fetchGeneratedComponentFromCacheStub).to.have.been.calledWith(
      'cache-id-env',
      'cache-token-env',
      'https://custom-edge.example.com'
    );
  });

  it('should handle undefined SITECORE_EDGE_URL', async () => {
    delete process.env.SITECORE_EDGE_URL;

    const serverComponentPreviewEventArgs: ServerComponentPreviewEventArgs = {
      name: 'component:generation:component-preview',
      message: {
        cache: {
          id: 'cache-id-no-env',
          token: 'cache-token-no-env',
        },
      },
    };

    const fetchedGeneratedComponentData: GeneratedComponentData = {
      code: {
        content: 'const Component = () => <div>No Env</div>',
      },
    };

    fetchGeneratedComponentFromCacheStub.resolves(fetchedGeneratedComponentData);

    const componentUpdate: ComponentUpdateModel = {
      uid: 'test-uid-no-env',
      serverComponentPreviewEventArgs,
    };

    await updateServerComponentAction(componentUpdate);

    expect(fetchGeneratedComponentFromCacheStub).to.have.been.calledWith(
      'cache-id-no-env',
      'cache-token-no-env',
      undefined
    );
  });
});
