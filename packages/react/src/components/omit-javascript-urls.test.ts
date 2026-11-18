import { expect } from 'chai';
import { createSandbox, SinonSandbox, SinonStub } from 'sinon';
import { omitJavascriptUrls, resetOmittedJavascriptUrlLog } from './omit-javascript-urls';

describe('omitJavascriptUrls', () => {
  let sandbox: SinonSandbox;
  let errorStub: SinonStub;

  beforeEach(() => {
    resetOmittedJavascriptUrlLog();
    sandbox = createSandbox();
    errorStub = sandbox.stub(console, 'error');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('removes javascript: hrefs and keeps the link text', () => {
    const html = omitJavascriptUrls('<p>Read <a class="x" href="javascript:alert(1)">this</a></p>');

    expect(html).to.equal('<p>Read <a class="x">this</a></p>');
    expect(errorStub.callCount).to.equal(1);
    expect(errorStub.firstCall.args[0]).to.contain('javascript:alert(1)');
  });

  it('removes case, whitespace, and tab or newline variants', () => {
    const html = omitJavascriptUrls(
      [
        '<a href="JAVASCRIPT:void(0)">a</a>',
        '<a href="  javascript:void(0)">b</a>',
        '<a href="\t\njavascript:alert(1)">c</a>',
        '<a href="java\nscript:alert(1)">d</a>',
      ].join('')
    );

    expect(html).to.equal('<a>a</a><a>b</a><a>c</a><a>d</a>');
    expect(errorStub.callCount).to.equal(4);
  });

  it('removes entity-encoded javascript: hrefs', () => {
    const html = omitJavascriptUrls(
      '<a href="&#106;avascript:alert(1)">a</a><a href="java&#115;cript&#58;alert(2)">b</a>'
    );

    expect(html).to.equal('<a>a</a><a>b</a>');
    expect(errorStub.callCount).to.equal(2);
  });

  it('removes javascript: src and action attributes', () => {
    const html = omitJavascriptUrls(
      '<iframe src="javascript:alert(1)"></iframe><form action=\'javascript:void(0)\'></form>'
    );

    expect(html).to.equal('<iframe></iframe><form></form>');
  });

  it('keeps ordinary URLs and text that mentions javascript:', () => {
    const html =
      '<a href="https://example.com">https</a><a href="mailto:editor@example.com">mail</a><a href="/lorem">path</a><p>javascript:alert(1)</p>';

    expect(omitJavascriptUrls(html)).to.equal(html);
    expect(errorStub.callCount).to.equal(0);
  });

  it('logs once for the same URL', () => {
    omitJavascriptUrls('<a href="javascript:void(0)">a</a>');
    omitJavascriptUrls('<a href="javascript:void(0)">b</a>');

    expect(errorStub.callCount).to.equal(1);
  });
});
