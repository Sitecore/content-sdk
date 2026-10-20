/* eslint-disable no-unused-expressions */
import { runInNewContext } from 'node:vm';
import { expect } from 'chai';
import { collectPersonalizeExecutionTokens, normalizeTokens, TokenMap } from './token-map';
import { createTokenTransform, replaceTokens } from './token-replace';
import {
  decodePersonalizeTokens,
  encodePersonalizeTokens,
  PERSONALIZE_TOKENS_MAX_LENGTH,
} from './token-codec';
import { isSafeUrlValue } from './token-url';
import { transformLayoutStrings } from '../layout/layout-walker';
import {
  getPersonalizedRewrite,
  getPersonalizedRewriteData,
  hasPersonalizeTokensRewrite,
  normalizePersonalizedRewrite,
} from './utils';

const tokens = (map: Record<string, string>): TokenMap => normalizeTokens(map);

describe('dynamic content tokens', () => {
  describe('replaceTokens', () => {
    const t = tokens({ name: 'Ada', city: 'Rome', 'user.first-name': 'Grace' });

    it('resolves values and fallbacks', () => {
      expect(replaceTokens('Hi {{name}}!', t)).to.equal('Hi Ada!');
      expect(replaceTokens('Hi {{ name }}!', t)).to.equal('Hi Ada!');
      expect(replaceTokens('Hi {{user.first-name}}', t)).to.equal('Hi Grace');
      expect(replaceTokens('Hi {{missing|friend}}!', t)).to.equal('Hi friend!');
      expect(replaceTokens('Hi {{name|friend}}!', t)).to.equal('Hi Ada!');
      expect(replaceTokens('{{name}} from {{city}}', t)).to.equal('Ada from Rome');
    });

    it('removes unmatched tokens without a fallback and reports them', () => {
      const unmatched: string[] = [];
      expect(replaceTokens('Hi {{missing}}!', t, undefined, (k) => unmatched.push(k))).to.equal(
        'Hi !'
      );
      expect(replaceTokens('Hi {{missing|}}!', t)).to.equal('Hi !');
      expect(unmatched).to.deep.equal(['missing']);
    });

    it('leaves text that is not a token as authored', () => {
      expect(replaceTokens('{{#each items}}', t)).to.equal('{{#each items}}');
      expect(replaceTokens('{{ a + b }}', t)).to.equal('{{ a + b }}');
      expect(replaceTokens('{{}}', t)).to.equal('{{}}');
      expect(replaceTokens('{{{name}}}', t)).to.equal('{{{name}}}');
      expect(replaceTokens('Hi {{name', t)).to.equal('Hi {{name');
      expect(replaceTokens('no tokens', t)).to.equal('no tokens');
    });

    it('inserts values literally and does not rescan them', () => {
      const v = tokens({ a: '$& \\1 $1', b: '{{c}}', c: 'nope' });
      expect(replaceTokens('{{a}}', v)).to.equal('$& \\1 $1');
      expect(replaceTokens('{{b}}', v)).to.equal('{{c}}');
    });

    it('does not insert values containing < into plain strings', () => {
      const v = tokens({ x: '<img src=x onerror=alert(1)>', y: 'a > b' });
      expect(replaceTokens('Hi {{x|friend}}', v)).to.equal('Hi friend');
      expect(replaceTokens('Hi {{x}}', v)).to.equal('Hi ');
      expect(replaceTokens('{{y}}', v)).to.equal('a > b');
    });

    it('does not insert script-capable URLs into plain strings', () => {
      for (const value of ['javascript:alert(1)', ' JAVA\tSCRIPT:alert(1)', 'vbscript:x', 'data:text/html,x']) {
        expect(replaceTokens('{{x|safe}}', tokens({ x: value })), value).to.equal('safe');
      }
      expect(replaceTokens('{{x}}', tokens({ x: 'Visit javascript: the language' }))).to.equal(
        'Visit javascript: the language'
      );
    });

    it('HTML-escapes values in strings that contain markup', () => {
      const v = tokens({ x: `<script>"&'` });
      expect(replaceTokens('<p>Hi {{x}}</p>', v)).to.equal(
        '<p>Hi &lt;script&gt;&quot;&amp;&#39;</p>'
      );
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

    it('keeps a < that does not start a tag in text', () => {
      const v = tokens({ name: 'Ada' });
      expect(replaceTokens('<p>2 < 3 {{name}}</p>', v)).to.equal('<p>2 < 3 Ada</p>');
    });

    it('leaves strings containing the internal marker characters untouched', () => {
      expect(replaceTokens('\uE000{{name}}', t)).to.equal('\uE000{{name}}');
    });

    it('ignores inherited properties of a plain token object', () => {
      expect(replaceTokens('{{constructor|x}}', {})).to.equal('x');
      expect(replaceTokens('{{toString|x}}', {})).to.equal('x');
    });
  });

  describe('URLs', () => {
    const v = tokens({ city: 'Rome', path: '../../admin?x=1#y', proto: 'javascript' });

    it('encodes values in URL properties', () => {
      expect(replaceTokens('/media/promo-{{city|london}}.jpg', v, 'src')).to.equal(
        '/media/promo-Rome.jpg'
      );
      expect(replaceTokens('/offers/{{path}}', v, 'href')).to.equal(
        '/offers/..%2F..%2Fadmin%3Fx%3D1%23y'
      );
      expect(replaceTokens('/a?q={{city}}', v, 'url')).to.equal('/a?q=Rome');
      expect(replaceTokens('/p-{{none|london}}.jpg', v, 'src')).to.equal('/p-london.jpg');
    });

    it('treats a whole-URL string in any field as a URL', () => {
      expect(replaceTokens('https://cdn.example.com/p-{{city}}.jpg', v, 'value')).to.equal(
        'https://cdn.example.com/p-Rome.jpg'
      );
      expect(replaceTokens('//cdn.example.com/{{path}}', v, 'value')).to.equal(
        '//cdn.example.com/..%2F..%2Fadmin%3Fx%3D1%23y'
      );
      expect(replaceTokens('/p/{{city|new york}}', v, 'value')).to.equal('/p/Rome');
      expect(replaceTokens('Visit {{city}} today', v, 'value')).to.equal('Visit Rome today');
    });

    it('treats a string whose fallback is a URL as a URL', () => {
      const js = tokens({ url: 'javascript:alert(1)', city: 'São Paulo' });
      expect(replaceTokens('{{url|/home}}', js, 'value')).to.equal('javascript%3Aalert(1)');
      expect(replaceTokens('/p/{{city|new york}}', js, 'value')).to.equal('/p/S%C3%A3o%20Paulo');
    });

    it('renders fallbacks only when the result is not a safe URL', () => {
      expect(replaceTokens('{{proto|https}}:alert(1)', v, 'href')).to.equal('https:alert(1)');
    });

    it('validates srcSet values', () => {
      expect(replaceTokens('/a-{{city}}.jpg 1x, /b-{{city}}.jpg 2x', v, 'srcSet')).to.equal(
        '/a-Rome.jpg 1x, /b-Rome.jpg 2x'
      );
      expect(isSafeUrlValue('srcSet', '/a.jpg 1x, javascript:x 2x')).to.be.false;
      expect(isSafeUrlValue('srcSet', '/a.jpg 0x')).to.be.false;
      expect(isSafeUrlValue('srcSet', '/a.jpg 1x extra')).to.be.false;
    });

    it('allows only safe schemes', () => {
      for (const url of ['https://a.com', 'http://a', 'mailto:a@b.c', 'tel:+1', '/a', '?q', '#x', '']) {
        expect(isSafeUrlValue('href', url), url).to.be.true;
      }
      for (const url of ['javascript:alert(1)', 'data:text/html,x', 'vbscript:x', '/a\\b', 'a\nb']) {
        expect(isSafeUrlValue('href', url), url).to.be.false;
      }
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
    });

    it('skips dangerous keys and non-objects', () => {
      const raw = JSON.parse('{"__proto__": {"x": "1"}, "constructor": "c", "prototype": "p"}');
      expect(Object.keys(normalizeTokens(raw))).to.deep.equal([]);
      expect(Object.keys(normalizeTokens(null))).to.deep.equal([]);
      expect(Object.keys(normalizeTokens('x'))).to.deep.equal([]);
      expect(Object.keys(normalizeTokens(['x']))).to.deep.equal([]);
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
      expect(result.identifiedVariantIds).to.have.members(['c1_a', 'c2_a']);
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

    it('keeps a valid variant when tokens has an unsupported shape', async () => {
      const result = await collectPersonalizeExecutionTokens(
        [{ variantIds: ['page-a'] }],
        async () => ({ variantId: 'page-a', tokens: ['x'] })
      );
      expect(result.identifiedVariantIds).to.deep.equal(['page-a']);
      expect(Object.keys(result.tokens)).to.deep.equal([]);
    });

    it('accepts results created in another JavaScript realm', async () => {
      const result = await collectPersonalizeExecutionTokens([{ variantIds: ['page-a'] }], async () =>
        runInNewContext('JSON.parse(input)', {
          input: JSON.stringify({ variantId: 'page-a', tokens: { name: 'Ada' } }),
        })
      );
      expect(result.identifiedVariantIds).to.deep.equal(['page-a']);
      expect(result.tokens.name).to.equal('Ada');
    });

    it('does not fail sibling executions when one rejects or throws synchronously', async () => {
      const result = await collectPersonalizeExecutionTokens(
        [{ variantIds: ['a'] }, { variantIds: ['b'] }, { variantIds: ['c'] }],
        (execution) => {
          if (execution.variantIds[0] === 'a') {
            throw new Error('sync');
          }
          if (execution.variantIds[0] === 'b') {
            return Promise.reject(new Error('async'));
          }
          return Promise.resolve({ variantId: 'c', tokens: { x: '1' } });
        }
      );
      expect(result.identifiedVariantIds).to.deep.equal(['c']);
      expect(result.tokens.x).to.equal('1');
    });
  });

  describe('codec', () => {
    it('round-trips unicode values', () => {
      const encoded = encodePersonalizeTokens(tokens({ name: 'Łukasz 李 🎉', city: 'Zürich' }));
      expect(encoded).to.match(/^[A-Za-z0-9_-]+$/);
      expect({ ...decodePersonalizeTokens(encoded) }).to.deep.equal({
        name: 'Łukasz 李 🎉',
        city: 'Zürich',
      });
    });

    it('encodes empty or oversized maps as undefined', () => {
      expect(encodePersonalizeTokens({})).to.be.undefined;
      expect(encodePersonalizeTokens({ a: 'x'.repeat(PERSONALIZE_TOKENS_MAX_LENGTH) })).to.be
        .undefined;
    });

    it('decodes missing, oversized and invalid values as undefined', () => {
      expect(decodePersonalizeTokens(undefined)).to.be.undefined;
      expect(decodePersonalizeTokens(null)).to.be.undefined;
      expect(decodePersonalizeTokens('')).to.be.undefined;
      expect(decodePersonalizeTokens('a'.repeat(PERSONALIZE_TOKENS_MAX_LENGTH + 1))).to.be
        .undefined;
      expect(decodePersonalizeTokens('!!!')).to.be.undefined;
      expect(decodePersonalizeTokens(btoa('not json'))).to.be.undefined;
      expect(decodePersonalizeTokens(btoa('["x"]'))).to.be.undefined;
      expect(decodePersonalizeTokens(btoa('{}'))).to.be.undefined;
      expect(decodePersonalizeTokens(btoa('\xff\xfe'))).to.be.undefined;
    });

    it('normalizes decoded values', () => {
      const encoded = btoa('{"a":"x","n":1,"bad key":"y","o":{}}');
      expect({ ...decodePersonalizeTokens(encoded) }).to.deep.equal({ a: 'x', n: '1' });
    });
  });

  describe('createTokenTransform', () => {
    it('resolves tokens across a tree, collects unmatched keys and shares unchanged subtrees', () => {
      const untouched = { fields: { title: { value: 'Static' } } };
      const tree = {
        a: untouched,
        b: { fields: { title: { value: 'Hi {{name|there}} {{x}}' } } },
        c: [1, 'plain', { link: { value: { href: '/p/{{name}}' } } }],
      };
      const { transform, unmatched } = createTokenTransform(tokens({ name: 'Ada Lovelace' }));
      const result = transformLayoutStrings(tree, transform);
      expect(result.a).to.equal(untouched);
      expect(result.b.fields.title.value).to.equal('Hi Ada Lovelace ');
      expect((result.c[2] as { link: { value: { href: string } } }).link.value.href).to.equal(
        '/p/Ada%20Lovelace'
      );
      expect(tree.b.fields.title.value).to.equal('Hi {{name|there}} {{x}}');
      expect(Array.from(unmatched)).to.deep.equal(['x']);
    });
  });

  describe('rewrite path marker', () => {
    it('adds and detects the tokens segment', () => {
      expect(getPersonalizedRewrite('/about', ['c1_a'], true)).to.equal(
        '/about/_variantId_c1_a/_sctokens'
      );
      expect(getPersonalizedRewrite('/', [], true)).to.equal('/_sctokens');
      expect(getPersonalizedRewrite('/about', ['c1_a'])).to.equal('/about/_variantId_c1_a');
      expect(hasPersonalizeTokensRewrite('/about/_variantId_c1_a/_sctokens')).to.be.true;
      expect(hasPersonalizeTokensRewrite(['about', '_variantId_c1_a', '_sctokens'])).to.be.true;
      expect(hasPersonalizeTokensRewrite('/about/_variantId_c1_a')).to.be.false;
    });

    it('is removed by normalization and ignored by variant parsing', () => {
      expect(normalizePersonalizedRewrite('/about/_variantId_c1_a/_sctokens')).to.equal('/about');
      expect(normalizePersonalizedRewrite('/_sctokens')).to.equal('/');
      expect(getPersonalizedRewriteData('/about/_variantId_c1_a/_sctokens')).to.deep.equal({
        variantId: '_default',
        componentVariantIds: ['c1_a'],
      });
    });
  });
});
