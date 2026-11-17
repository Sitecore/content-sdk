import { expect } from 'chai';
import { createSandbox, SinonSandbox, SinonStub } from 'sinon';
import {
  isJavascriptUrl,
  reportBlockedJavascriptUrl,
  resetBlockedJavascriptUrlLog,
} from './javascript-url';

describe('isJavascriptUrl', () => {
  const blocked = [
    'javascript:alert(1)',
    'JAVASCRIPT:void(0)',
    'JaVaScRiPt:alert(1)',
    ' javascript:alert(1)',
    '\tjavascript:alert(1)',
    '\njavascript:alert(1)',
    '\r\n javascript:void(0)',
    'java\nscript:alert(1)',
    'java\tscript:alert(1)',
    'java\rscript:void(0)',
    'j\na\tv\ra\ns\tc\nr\ni\tp\nt:alert(1)',
  ];

  const allowed = [
    'https://example.com',
    'http://example.com',
    'mailto:editor@example.com',
    'tel:+15551212',
    '/lorem',
    '/javascript:alert(1)',
    'notjavascript:alert(1)',
    'java script:alert(1)',
    '',
  ];

  blocked.forEach((url) => {
    it(`blocks ${JSON.stringify(url)}`, () => {
      expect(isJavascriptUrl(url)).to.equal(true);
    });
  });

  allowed.forEach((url) => {
    it(`allows ${JSON.stringify(url)}`, () => {
      expect(isJavascriptUrl(url)).to.equal(false);
    });
  });
});

describe('reportBlockedJavascriptUrl', () => {
  let sandbox: SinonSandbox;
  let errorStub: SinonStub;

  beforeEach(() => {
    resetBlockedJavascriptUrlLog();
    sandbox = createSandbox();
    errorStub = sandbox.stub(console, 'error');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('logs once for the same href and again for a different href', () => {
    reportBlockedJavascriptUrl('javascript:void(0)');
    reportBlockedJavascriptUrl('javascript:void(0)');
    reportBlockedJavascriptUrl('javascript:alert(1)');

    expect(errorStub.callCount).to.equal(2);
    expect(errorStub.firstCall.args[0]).to.contain('javascript:void(0)');
    expect(errorStub.secondCall.args[0]).to.contain('javascript:alert(1)');
  });
});
