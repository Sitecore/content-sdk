/* eslint-disable no-unused-expressions */
import { expect, use } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import proxyquire from 'proxyquire';

use(sinonChai);

describe('compileCssForDocumentAction', () => {
  let getAtomsCssCompilerStub: sinon.SinonStub;
  let compileCssForDocumentAction: (classes: string[]) => Promise<string>;

  beforeEach(() => {
    getAtomsCssCompilerStub = sinon.stub();
    const module = proxyquire('./compile-document-css-action', {
      '@sitecore-content-sdk/core': {
        getAtomsCssCompiler: getAtomsCssCompilerStub,
      },
    });
    compileCssForDocumentAction = module.compileCssForDocumentAction;
  });

  afterEach(() => {
    sinon.restore();
  });

  it('returns empty string when classes array is empty', async () => {
    expect(await compileCssForDocumentAction([])).to.equal('');
    expect(getAtomsCssCompilerStub).not.to.have.been.called;
  });

  it('returns empty string when no compiler is registered', async () => {
    getAtomsCssCompilerStub.returns(null);
    expect(await compileCssForDocumentAction(['flex'])).to.equal('');
  });

  it('delegates to the registered compiler', async () => {
    getAtomsCssCompilerStub.returns(async (classes: string[]) => `.${classes.join('.')}{}`);
    expect(await compileCssForDocumentAction(['flex', 'gap-4'])).to.equal('.flex.gap-4{}');
  });
});
