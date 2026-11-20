/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { collectPersonalizeExecutionTokens, normalizeTokens, TokenMap } from './token-map';
import { replaceTokens } from './token-replace';
import {
  encodePersonalizeTokens,
  getPersonalizeTokens,
  PERSONALIZE_TOKENS_HEADER,
  PERSONALIZE_TOKENS_MAX_LENGTH,
} from './token-codec';
import { getPersonalizedRewriteData, normalizePersonalizedRewrite } from './utils';

const tokens = (map: Record<string, string>): TokenMap => normalizeTokens(map);

describe('dynamic content tokens', () => {
  describe('replaceTokens', () => {
    const t = tokens({ name: 'Ada', city: 'Rome', 'user.first-name': 'Grace' });

    it('resolves values and fallbacks', () => {
      expect(replaceTokens('Hi {{name}}!', t)).to.equal('Hi Ada!');
      expect(replaceTokens('Hi {{ name }}!', t)).to.equal('Hi Ada!');
      expect(replaceTokens('Hi {{user.first-name}}', t)).to.equal('Hi Grace');
      expect(replaceTokens('Hi {{missing|friend}}!', t)).to.equal('Hi friend!');
      expect(replaceTokens('Hi {{ missing | dear friend }}!', t)).to.equal('Hi dear friend!');
      expect(replaceTokens('Hi {{name|friend}}!', t)).to.equal('Hi Ada!');
      expect(replaceTokens('{{name}} from {{city}}', t)).to.equal('Ada from Rome');
    });

    it('removes tokens without a value or fallback', () => {
      expect(replaceTokens('Hi {{missing}}!', t)).to.equal('Hi !');
      expect(replaceTokens('Hi {{missing|}}!', t)).to.equal('Hi !');
    });

    it('leaves text that is not a token as authored', () => {
      expect(replaceTokens('{{#each items}}', t)).to.equal('{{#each items}}');
      expect(replaceTokens('{{ a + b }}', t)).to.equal('{{ a + b }}');
      expect(replaceTokens('{{}}', t)).to.equal('{{}}');
      expect(replaceTokens('{{{name}}}', t)).to.equal('{{{name}}}');
      expect(replaceTokens('Hi {{name', t)).to.equal('Hi {{name');
      expect(replaceTokens('no tokens', t)).to.equal('no tokens');
      expect(replaceTokens('\uE000{{name}}', t)).to.equal('\uE000{{name}}');
    });

    it('inserts values literally and does not rescan them', () => {
      const v = tokens({ a: '$& \\1 $1', b: '{{c}}', c: 'nope' });
      expect(replaceTokens('{{a}}', v)).to.equal('$& \\1 $1');
      expect(replaceTokens('{{b}}', v)).to.equal('{{c}}');
    });

    it('ignores inherited properties of a plain token object', () => {
      expect(replaceTokens('{{constructor|x}}', {})).to.equal('x');
      expect(replaceTokens('{{toString|x}}', {})).to.equal('x');
    });
  });

  describe('plain strings', () => {
    it('uses fallbacks when values would add markup', () => {
      const v = tokens({ x: '<img src=x onerror=alert(1)>', tag: 'img src=x onerror=alert(1)' });
      expect(replaceTokens('Hi {{x|friend}}', v)).to.equal('Hi friend');
      expect(replaceTokens('Save <{{tag|10%}}', v)).to.equal('Save <10%');
      expect(replaceTokens('{{y}}', tokens({ y: 'a > b < c' }))).to.equal('a > b < c');
    });

    it('uses fallbacks when the result starts with a script-capable scheme', () => {
      for (const value of [
        'javascript:alert(1)',
        ' JAVA\tSCRIPT:alert(1)',
        'vbscript:x',
        'data:text/html,x',
      ]) {
        expect(replaceTokens('{{x|safe}}', tokens({ x: value })), value).to.equal('safe');
      }
      const split = tokens({ a: 'java', b: 'script:alert(1)' });
      expect(replaceTokens('{{a|x}}{{b|y}}', split)).to.equal('xy');
      expect(replaceTokens('{{x}}', tokens({ x: 'Visit javascript: the language' }))).to.equal(
        'Visit javascript: the language'
      );
    });
  });

  describe('markup', () => {
    it('HTML-escapes values in text', () => {
      const v = tokens({ x: `<script>"&'` });
      expect(replaceTokens('<p>Hi {{x}}</p>', v)).to.equal(
        '<p>Hi &lt;script&gt;&quot;&amp;&#39;</p>'
      );
      expect(replaceTokens('<p>2 < 3 {{x}}</p>', tokens({ x: 'Ada' }))).to.equal(
        '<p>2 < 3 Ada</p>'
      );
    });

    it('uses only fallbacks directly after <', () => {
      const v = tokens({ x: 'img src=x onerror=alert(1)//', y: 'onmouseover=alert(1)' });
      expect(replaceTokens('<p>Save <{{x|10%}}</p>', v)).to.equal('<p>Save <10%</p>');
      expect(replaceTokens('<p>a <{{none}}{{x}}</p>', v)).to.equal('<p>a <</p>');
      expect(replaceTokens('<p><{{none|b}} {{y}}</p>', v)).to.equal('<p><b </p>');
    });

    it('uses only the fallback inside tags', () => {
      const v = tokens({ name: 'Ada', url: 'javascript:alert(1)' });
      expect(replaceTokens('<img alt="Hi {{name|there}}"><p>{{name}}</p>', v)).to.equal(
        '<img alt="Hi there"><p>Ada</p>'
      );
      expect(replaceTokens('<a href="{{url|/home}}">x</a>', v)).to.equal('<a href="/home">x</a>');
      expect(replaceTokens('<a href={{url}}>x</a>', v)).to.equal('<a href=>x</a>');
      expect(replaceTokens('<a title="a>b" href="{{url}}">{{name}}</a>', v)).to.equal(
        '<a title="a>b" href="">Ada</a>'
      );
    });

    it('opens quoted attribute values only after =, as browsers do', () => {
      const v = tokens({ v: '0||alert(1)', name: 'Ada' });
      expect(replaceTokens('<a title=a"b onclick="x=1>{{v}}">t</a>', v)).to.equal(
        '<a title=a"b onclick="x=1>">t</a>'
      );
      expect(replaceTokens("<a title='x>{{v}}'>{{name}}</a>", v)).to.equal("<a title='x>'>Ada</a>");
    });

    it('treats unterminated tags and quotes as tags', () => {
      const v = tokens({ name: 'Ada' });
      expect(replaceTokens('<p>x</p><a title="{{name|y}}', v)).to.equal('<p>x</p><a title="y');
      expect(replaceTokens('<p>x</p><a title="z {{name|y}}>', v)).to.equal(
        '<p>x</p><a title="z y>'
      );
    });

    it('keeps comments and raw blocks as authored', () => {
      const v = tokens({ name: 'Ada' });
      const raw =
        '<script>var t = "{{name}}";</script><style>/* {{name}} */</style>' +
        '<pre>{{name}}</pre><code>{{name|x}}</code><!-- {{name}} --><textarea>{{name}}</textarea>';
      expect(replaceTokens(`${raw}<p>{{name}}</p>`, v)).to.equal(`${raw}<p>Ada</p>`);
      expect(replaceTokens('<SCRIPT>{{name}}</SCRIPT>{{name}}', v)).to.equal(
        '<SCRIPT>{{name}}</SCRIPT>Ada'
      );
      expect(replaceTokens('<p>a</p><script>{{name}}', v)).to.equal('<p>a</p><script>{{name}}');
    });

    it('does not treat custom elements as raw blocks', () => {
      const v = tokens({ name: 'Ada' });
      expect(replaceTokens('<p><code-block>{{name}}</code-block> {{name}}</p>', v)).to.equal(
        '<p><code-block>Ada</code-block> Ada</p>'
      );
    });

    it('uses only fallbacks where browsers would not parse the token as text', () => {
      const v = tokens({ v: 'alert(1)' });
      for (const authored of [
        '<!x a="> <a onclick="> {{v}} <">',
        '<a ="x onclick="> {{v}} <">',
        '<a b=x=" onclick="> {{v}} <">',
        '</ a="> <a onclick="> {{v}} <">',
        '<xmp><a title="</xmp><a onclick=">{{v}}"></xmp>',
        '<noscript><p title="</noscript><img onerror=">{{v}}">',
        '<script></script x><a onclick="</script>{{v}}">',
        '<script><!--<script></script>{{v}}</script>',
        '<svg><style><a onclick="</style>{{v}}"></svg>',
        '<select><style><input><a onclick="</style>{{v}}">',
        '<svg><![CDATA[ > <b c="]]> <a onclick="> {{v}} <">',
        '<!--><a onclick="-->{{v}}">',
        '<script{{none}}>{{v}}</script>',
      ]) {
        expect(replaceTokens(authored, v), authored).to.not.contain('alert(1)');
      }
    });

    it('checks the markup with fallbacks in place', () => {
      const v = tokens({ v: 'alert(1)' });
      expect(replaceTokens('<p>{{a|<b onclick="}}{{v}}"></p>', v)).to.equal(
        '<p><b onclick=""></p>'
      );
      expect(replaceTokens('<a title="{{a|"><i onclick="}}">{{v}}</i>', v)).to.equal(
        '<a title=""><i onclick="">alert(1)</i>'
      );
      expect(replaceTokens('<p>{{a|<}}{{v}}</p>', v)).to.equal('<p><</p>');
      expect(
        replaceTokens('<p>{{a|<b>friend</b>}} {{v}}</p>', tokens({ a: 'Ada', v: 'x' }))
      ).to.equal('<p>Ada x</p>');
    });

    it('recognizes doctypes, unquoted values and legacy script comments', () => {
      const v = tokens({ name: 'Ada' });
      expect(replaceTokens('<!DOCTYPE html><p>{{name}}</p>', v)).to.equal(
        '<!DOCTYPE html><p>Ada</p>'
      );
      expect(replaceTokens('<a href=/x?a=1&b=2>{{name}}</a>', v)).to.equal(
        '<a href=/x?a=1&b=2>Ada</a>'
      );
      expect(replaceTokens('<input value={{name}}><p>{{name}}</p>', v)).to.equal(
        '<input value=><p>Ada</p>'
      );
      expect(replaceTokens('<script><!-- x() //--></script><p>{{name}}</p>', v)).to.equal(
        '<script><!-- x() //--></script><p>Ada</p>'
      );
    });
  });

  describe('URLs', () => {
    const v = tokens({
      city: 'Rome',
      path: '../../admin?x=1#y',
      host: 'evil.com',
      q: 'x&admin=1',
      image: 'https://cdn.example.com/offers/rome.jpg',
      js: 'javascript:alert(1)',
    });

    it('encodes values in the path, query and fragment', () => {
      expect(replaceTokens('/media/promo-{{city|london}}.jpg', v, 'src')).to.equal(
        '/media/promo-Rome.jpg'
      );
      expect(replaceTokens('/offers/{{path}}', v, 'href')).to.equal(
        '/offers/..%2F..%2Fadmin%3Fx%3D1%23y'
      );
      expect(replaceTokens('https://cdn.example.com/{{city}}/i.jpg', v, 'src')).to.equal(
        'https://cdn.example.com/Rome/i.jpg'
      );
      expect(replaceTokens('/a?q={{q}}#{{city}}', v, 'url')).to.equal('/a?q=x%26admin%3D1#Rome');
      expect(replaceTokens('mailto:a@b.c?subject={{city}}', v, 'href')).to.equal(
        'mailto:a@b.c?subject=Rome'
      );
      expect(replaceTokens('/p-{{none|london}}.jpg', v, 'src')).to.equal('/p-london.jpg');
    });

    it('uses only the fallback in the scheme and host', () => {
      expect(replaceTokens('https://{{host|a.com}}/x', v, 'href')).to.equal('https://a.com/x');
      expect(replaceTokens('//{{host|a.com}}/x', v, 'src')).to.equal('//a.com/x');
      expect(replaceTokens('{{host|/shop}}/x', v, 'href')).to.equal('/shop/x');
      expect(replaceTokens('{{js|https}}:alert(1)', v, 'href')).to.equal('https:alert(1)');
      expect(replaceTokens('mailto:{{city|a@b.c}}', v, 'href')).to.equal('mailto:a@b.c');
    });

    it('uses only fallbacks in URLs with other schemes', () => {
      const code = tokens({ code: "')(alert(document.domain))('" });
      expect(replaceTokens("javascript:openWin('/promo?code={{code|x}}')", code, 'href')).to.equal(
        "javascript:openWin('/promo?code=x')"
      );
      expect(replaceTokens('java\tscript:go(/{{code}})', code, 'href')).to.equal(
        'java\tscript:go(/)'
      );
      expect(replaceTokens('data:text/html,/{{code}}', code, 'src')).to.equal('data:text/html,/');
    });

    it('does not turn a root-relative path into a protocol-relative URL', () => {
      expect(replaceTokens('/{{region}}/{{host}}/stores', v, 'href')).to.equal('/evil.com/stores');
      expect(replaceTokens('/{{region}}/offers', v, 'src')).to.equal('/offers');
      expect(replaceTokens('\\{{region}}/{{host}}/x', v, 'href')).to.equal('/evil.com/x');
      expect(replaceTokens('//cdn.example.com/{{city}}', v, 'src')).to.equal(
        '//cdn.example.com/Rome'
      );
    });

    it('takes a whole URL value when the string is a single token', () => {
      expect(replaceTokens('{{image|/default.jpg}}', v, 'src')).to.equal(
        'https://cdn.example.com/offers/rome.jpg'
      );
      expect(replaceTokens('{{image|/default.jpg}}', v, 'value')).to.equal(
        'https://cdn.example.com/offers/rome.jpg'
      );
      expect(replaceTokens('{{js|/home}}', v, 'href')).to.equal('/home');
      expect(replaceTokens('{{none|/home}}', v, 'href')).to.equal('/home');
      for (const value of [
        'data:image/png,x',
        'vbscript:x',
        '/a\\b',
        'a\nb',
        '/a b',
        '/<svg/onload=alert(1)>',
        'https://x.com/<img/src/onerror=alert(1)>',
        '/"onmouseover="x',
      ]) {
        expect(replaceTokens('{{u|/x}}', tokens({ u: value }), 'src'), value).to.equal('/x');
        expect(replaceTokens('{{u|/x}}', tokens({ u: value }), 'value'), value).to.equal('/x');
      }
    });

    it('encodes link query string and anchor values', () => {
      expect(replaceTokens('b={{q}}', v, 'querystring')).to.equal('b=x%26admin%3D1');
      expect(replaceTokens('{{q}}', v, 'anchor')).to.equal('x%26admin%3D1');
    });

    it('treats a whole-URL string in any field as a URL', () => {
      expect(replaceTokens('https://cdn.example.com/p-{{city}}.jpg', v, 'value')).to.equal(
        'https://cdn.example.com/p-Rome.jpg'
      );
      expect(replaceTokens('/p/{{city|new york}}', v, 'value')).to.equal('/p/Rome');
      expect(replaceTokens('Visit {{city}} today', v, 'value')).to.equal('Visit Rome today');
      expect(replaceTokens('/{{a|<script>}}{{js}}', v, 'value')).to.equal('/<script>');
    });
  });

  describe('normalizeTokens', () => {
    it('keeps non-empty strings and finite numbers with valid keys', () => {
      const result = normalizeTokens({
        a: 'x',
        n: 0,
        f: 1.5e3,
        empty: '',
        nan: NaN,
        inf: Infinity,
        obj: { a: 1 },
        arr: ['x'],
        bool: true,
        'bad key': 'x',
        '': 'x',
      });
      expect({ ...result }).to.deep.equal({ a: 'x', n: '0', f: '1500' });
      expect(Object.getPrototypeOf(result)).to.equal(null);
      expect(Object.keys(normalizeTokens(null))).to.deep.equal([]);
      expect(Object.keys(normalizeTokens(['x']))).to.deep.equal([]);
    });

    it('makes values well-formed so URLs can always be encoded', () => {
      const result = normalizeTokens({ bad: 'a\uD800b' });
      expect(result.bad).to.equal('a\uFFFDb');
      expect(replaceTokens('/p/{{bad}}', result, 'href')).to.equal('/p/a%EF%BF%BDb');
    });
  });

  describe('collectPersonalizeExecutionTokens', () => {
    it('collects variants and tokens in execution order, not completion order', async () => {
      const result = await collectPersonalizeExecutionTokens(
        [{ variantIds: ['c1_a'] }, { variantIds: ['c2_a'] }],
        async (execution) => {
          if (execution.variantIds[0] === 'c1_a') {
            await new Promise((resolve) => setTimeout(resolve, 5));
            return { variantId: 'c1_a', tokens: { offer: 'first', a: 'x' } };
          }
          return { variantId: 'c2_a', tokens: { offer: 'second' } };
        }
      );
      expect(result.identifiedVariantIds).to.deep.equal(['c1_a', 'c2_a']);
      expect({ ...result.tokens }).to.deep.equal({ offer: 'second', a: 'x' });
    });

    it('keeps tokens from the default branch (no variant)', async () => {
      const result = await collectPersonalizeExecutionTokens(
        [{ variantIds: ['page-a'] }, { variantIds: ['c1_default', 'c1_a'] }],
        async (execution) =>
          execution.variantIds[0] === 'page-a'
            ? { tokens: { name: 'Ada' } }
            : { variantId: 'c1_default', tokens: { city: 'Rome' } }
      );
      expect(result.identifiedVariantIds).to.deep.equal(['c1_default']);
      expect({ ...result.tokens }).to.deep.equal({ name: 'Ada', city: 'Rome' });
    });

    it('drops variant and tokens of an execution that returned an unknown variant', async () => {
      const result = await collectPersonalizeExecutionTokens(
        [{ variantIds: ['page-a'] }],
        async () => ({ variantId: 'other', tokens: { name: 'Ada' } })
      );
      expect(result.identifiedVariantIds).to.deep.equal([]);
      expect(Object.keys(result.tokens)).to.deep.equal([]);
    });
  });

  describe('codec', () => {
    it('round-trips unicode values through web and Node.js headers', () => {
      const encoded = encodePersonalizeTokens(tokens({ name: 'Łukasz 李 🎉', city: 'Zürich' }));
      expect(encoded).to.match(/^[\x21-\x7e]+$/);
      const expected = { name: 'Łukasz 李 🎉', city: 'Zürich' };
      const web = new Headers({ [PERSONALIZE_TOKENS_HEADER]: encoded as string });
      expect({ ...getPersonalizeTokens(web) }).to.deep.equal(expected);
      expect({ ...getPersonalizeTokens({ [PERSONALIZE_TOKENS_HEADER]: encoded }) }).to.deep.equal(
        expected
      );
      expect({
        ...getPersonalizeTokens({ [PERSONALIZE_TOKENS_HEADER]: [encoded as string] }),
      }).to.deep.equal(expected);
    });

    it('encodes empty or oversized maps as undefined', () => {
      expect(encodePersonalizeTokens({})).to.be.undefined;
      expect(encodePersonalizeTokens({ a: 'x'.repeat(PERSONALIZE_TOKENS_MAX_LENGTH) })).to.be
        .undefined;
    });

    it('reads missing and invalid values as undefined', () => {
      const read = (value: string) => getPersonalizeTokens({ [PERSONALIZE_TOKENS_HEADER]: value });
      expect(getPersonalizeTokens(undefined)).to.be.undefined;
      expect(getPersonalizeTokens(new Headers())).to.be.undefined;
      expect(read('')).to.be.undefined;
      expect(read('%E0%A4%A')).to.be.undefined;
      expect(read('not json')).to.be.undefined;
      expect(read(encodeURIComponent('["x"]'))).to.be.undefined;
      expect(read(encodeURIComponent('{}'))).to.be.undefined;
    });
  });

  describe('rewrite path marker', () => {
    it('is removed by normalization and ignored by variant parsing', () => {
      expect(normalizePersonalizedRewrite('/_sctokens/_site_s/about/_variantId_c1_a')).to.equal(
        '/_site_s/about'
      );
      expect(normalizePersonalizedRewrite('/s/en/_sctokens/about')).to.equal('/s/en/about');
      expect(normalizePersonalizedRewrite('/_sctokens')).to.equal('/');
      expect(getPersonalizedRewriteData('/_sctokens/about/_variantId_c1_a')).to.deep.equal({
        variantId: '_default',
        componentVariantIds: ['c1_a'],
      });
    });
  });
});
