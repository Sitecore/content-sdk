/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable no-unused-expressions */
import { expect, use } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import proxyquire from 'proxyquire';

use(sinonChai);

describe('nextjs DesignLibraryApp', () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  it('should pass authorized server actions into the React Design Library', async () => {
    const updateComponentAction = sandbox.stub();
    const previewComponentAction = sandbox.stub();
    const reactDesignLibraryApp = sandbox.stub().resolves(null);
    const { DesignLibraryApp } = proxyquire('./DesignLibraryApp', {
      '@sitecore-content-sdk/react': {
        DesignLibraryApp: reactDesignLibraryApp,
      },
      '../../server-actions/update-server-component-action': {
        updateComponentAction,
        previewComponentAction,
      },
    });

    const props = {
      page: { layout: { sitecore: { route: { name: 'page' } } } },
      componentMap: new Map(),
      loadServerImportMap: sandbox.stub(),
      rendering: { name: 'page' },
    };

    const element = await DesignLibraryApp(props);

    expect(element.type).to.equal(reactDesignLibraryApp);
    expect(element.props).to.deep.equal({
      ...props,
      updateComponentAction,
      previewComponentAction,
    });
  });
});
