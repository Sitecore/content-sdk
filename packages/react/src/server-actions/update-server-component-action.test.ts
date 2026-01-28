/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable no-unused-expressions */
import { expect, use } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { ComponentUpdateModel } from './update-server-component-action';
import { COMPONENT_UPDATE_CACHE_KEY_PREFIX } from '@sitecore-content-sdk/content/editing';
import { ComponentRendering } from '@sitecore-content-sdk/content/layout';
import { ComponentPreviewEventArgs } from '@sitecore-content-sdk/content/codegen';
import proxyquire from 'proxyquire';

use(sinonChai);

describe('updateServerComponentAction', () => {
  let sandbox: sinon.SinonSandbox;
  let setCacheStub: sinon.SinonStub;
  let debugEditingStub: sinon.SinonStub;
  let updateServerComponentAction: any;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    setCacheStub = sandbox.stub();
    debugEditingStub = sandbox.stub();

    const module = proxyquire('./update-server-component-action', {
      '@sitecore-content-sdk/core/tools': {
        setCache: setCacheStub,
      },
      '@sitecore-content-sdk/content': {
        debug: {
          editing: debugEditingStub,
        },
      },
    });

    updateServerComponentAction = module.updateServerComponentAction;
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should set cache with updated component', async () => {
    const previewComponent: ComponentPreviewEventArgs = {
      message: {
        uid: 'test-uid-456',
        code: {
          content: 'const Component = () => <div>Preview</div>',
        },
        styles: {
          content: '.test { color: red; }',
        },
      },
    } as ComponentPreviewEventArgs;

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
      previewComponent: previewComponent,
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
  });
});
