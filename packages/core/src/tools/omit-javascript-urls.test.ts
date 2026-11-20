import { expect } from 'chai';
import { getOmittedJavascriptUrlMessage, omitJavascriptUrls } from './omit-javascript-urls';

describe('omitJavascriptUrls', () => {
  it('removes javascript: hrefs and keeps the link text', () => {
    const result = omitJavascriptUrls(
      '<p>Read <a class="x" href="javascript:alert(1)">this</a></p>'
    );

    expect(result.html).to.equal('<p>Read <a class="x">this</a></p>');
    expect(result.omittedUrls).to.deep.equal(['javascript:alert(1)']);
  });

  it('removes case, whitespace, and tab or newline variants', () => {
    const result = omitJavascriptUrls(
      [
        '<a href="JAVASCRIPT:void(0)">a</a>',
        '<a href="  javascript:void(0)">b</a>',
        '<a href="\t\njavascript:alert(1)">c</a>',
        '<a href="java\nscript:alert(1)">d</a>',
      ].join('')
    );

    expect(result.html).to.equal('<a>a</a><a>b</a><a>c</a><a>d</a>');
    expect(result.omittedUrls.length).to.equal(4);
  });

  it('removes entity-encoded javascript: hrefs', () => {
    const result = omitJavascriptUrls(
      '<a href="&#106;avascript:alert(1)">a</a><a href="java&#115;cript&#58;alert(2)">b</a><a href="&#x6A;avascript&colon;alert(3)">c</a>'
    );

    expect(result.html).to.equal('<a>a</a><a>b</a><a>c</a>');
    expect(result.omittedUrls).to.deep.equal([
      'javascript:alert(1)',
      'javascript:alert(2)',
      'javascript:alert(3)',
    ]);
  });

  it('removes javascript: URLs from other URL attributes and quote styles', () => {
    const result = omitJavascriptUrls(
      [
        '<iframe src="javascript:alert(1)"></iframe>',
        "<form action='javascript:void(0)'></form>",
        '<button formaction=javascript:alert(1)>b</button>',
        '<A HREF="javascript:alert(1)">u</A>',
        '<svg><a xlink:href="javascript:alert(1)">s</a></svg>',
      ].join('')
    );

    expect(result.html).to.equal(
      '<iframe></iframe><form></form><button>b</button><A>u</A><svg><a>s</a></svg>'
    );
    expect(result.omittedUrls.length).to.equal(5);
  });

  it('keeps ordinary URLs and text that mentions javascript:', () => {
    const html =
      '<a href="https://example.com">https</a><a href="mailto:editor@example.com">mail</a><a href="/lorem">path</a><a href="https://example.com/javascript:alert(1)">path</a><p>javascript:alert(1)</p>';

    const result = omitJavascriptUrls(html);
    expect(result.html).to.equal(html);
    expect(result.omittedUrls).to.deep.equal([]);
  });

  it('returns empty input unchanged', () => {
    expect(omitJavascriptUrls('')).to.deep.equal({ html: '', omittedUrls: [] });
  });

  it('builds a message that includes the URL', () => {
    expect(getOmittedJavascriptUrlMessage('javascript:alert(1)')).to.contain(
      '"javascript:alert(1)"'
    );
  });
});
