/* eslint-disable no-unused-expressions */
import { runInNewContext } from 'node:vm';
import { expect } from 'chai';
import {
  createEmptyTokenMap,
  mergeExecutionTokenResults,
  mergePersonalizeTokens,
  TokenMap,
} from './token-map';
import { replaceTokens } from './token-replace';
import { replaceTokensInObject } from './token-walk';
import {
  decodePersonalizeTokensHeader,
  decodePersonalizeTokensHeaderDetailed,
  encodePersonalizeTokensHeader,
  PERSONALIZE_TOKENS_HEADER_MAX_BYTES,
} from './token-codec';
import { finalizeSitecoreTree } from './token-walk';
import { personalizeLayout } from './layout-personalizer';
import { validateTokenizedUrl, validateTokenizedSrcSet } from './token-url';
import { collectPersonalizeExecutionTokens } from './token-executions';

describe('dynamic content tokens', () => {
  describe('replaceTokens parser', () => {
    it('resolves valid syntax and fallbacks', () => {
      const tokens: TokenMap = { firstName: 'Ada' };
      expect(replaceTokens('{{firstName}}', tokens)).to.equal('Ada');
      expect(replaceTokens('{{firstName|Visitor}}', tokens)).to.equal('Ada');
      expect(replaceTokens('{{missing|Visitor}}', tokens)).to.equal('Visitor');
      expect(replaceTokens('{{missing}}', tokens)).to.equal('');
      expect(replaceTokens('{{key|}}', tokens)).to.equal('');
      expect(replaceTokens('{{ firstName }}', tokens)).to.equal('Ada');
      expect(replaceTokens('{{key|No results. }}', tokens)).to.equal('No results. ');
      expect(replaceTokens('{{missing|a|b}}', tokens)).to.equal('a|b');
    });

    it('treats empty map values as missing', () => {
      expect(replaceTokens('{{name|Visitor}}', { name: '' })).to.equal('Visitor');
    });

    it('removes balanced invalid expressions', () => {
      expect(replaceTokens('{{ }}', {})).to.equal('');
      expect(replaceTokens('{{{a}}', {})).to.equal('');
    });

    it('preserves unclosed tokens and later content', () => {
      expect(replaceTokens('Hello {{name and more', { name: 'Ada' })).to.equal(
        'Hello {{name and more'
      );
    });

    it('replaces multiple tokens', () => {
      expect(replaceTokens('{{a}} {{b|x}}', { a: '1' })).to.equal('1 x');
    });

    it('inserts $ and backslashes literally', () => {
      expect(replaceTokens('{{v}}', { v: '$1\\n' })).to.equal('$1\\n');
    });

    it('does not rescan inserted values', () => {
      expect(replaceTokens('{{name}}', { name: '{{otherKey}}', otherKey: 'Ada' })).to.equal(
        '{{otherKey}}'
      );
    });
  });

  describe('HTML insertion rules', () => {
    it('inserts markup-free benign values literally', () => {
      expect(replaceTokens('Hello {{name}}', { name: 'Ada' })).to.equal('Hello Ada');
    });

    it('rejects markup-free values containing <', () => {
      expect(replaceTokens('{{promoText|safe}}', { promoText: '<img src=x>' })).to.equal('safe');
      expect(replaceTokens('{{promoText}}', { promoText: '<img src=x>' })).to.equal('');
    });

    it('keeps 2 < 3 and a < b in text context', () => {
      expect(replaceTokens('2 < 3: {{name}}', { name: 'Ada' })).to.equal('2 < 3: Ada');
      expect(replaceTokens('a < b {{city}}', { city: 'Oslo' })).to.equal('a < b Oslo');
    });

    it('does not enter tag state for < followed by whitespace, digit, or <', () => {
      expect(replaceTokens('<  div {{name}}', { name: 'Ada' })).to.equal('<  div Ada');
      expect(replaceTokens('<<div {{name}}', { name: 'Ada' })).to.equal('<<div Ada');
      expect(replaceTokens('<3 {{name}}', { name: 'Ada' })).to.equal('<3 Ada');
    });

    it('HTML-escapes values in markup text context', () => {
      expect(
        replaceTokens('<p>Hello {{name}}</p>', {
          name: '</p><img src=x onerror=alert(1)>',
        })
      ).to.equal('<p>Hello &lt;/p&gt;&lt;img src=x onerror=alert(1)&gt;</p>');
    });

    it('does not enter script state for a self-closing script tag', () => {
      expect(replaceTokens('<script src="x" />{{name}}', { name: 'Ada' })).to.equal(
        '<script src="x" />Ada'
      );
    });

    it('uses fallback for tokens in tags, attributes, script, and style', () => {
      expect(replaceTokens('<a href="{{url|fallback}}">x</a>', { url: 'https://x' })).to.equal(
        '<a href="fallback">x</a>'
      );
      expect(replaceTokens('<div {{attr|x}}>', { attr: 'id=a' })).to.equal('<div x>');
      expect(
        replaceTokens('<script>var x="{{name|fb}}"</script>', { name: 'Ada' })
      ).to.equal('<script>var x="fb"</script>');
      expect(replaceTokens('<style>.x{content:"{{name|fb}}"}</style>', { name: 'Ada' })).to.equal(
        '<style>.x{content:"fb"}</style>'
      );
    });

    it('leaves non-tokenized rich text unchanged', () => {
      const html = '<p>Authored <em>HTML</em></p>';
      expect(replaceTokens(html, { name: 'Ada' })).to.equal(html);
    });

    it('ends tag state only at > outside quotes', () => {
      expect(replaceTokens('<div title="a>b">{{name}}</div>', { name: 'Ada' })).to.equal(
        '<div title="a>b">Ada</div>'
      );
    });
  });

  describe('URL validation', () => {
    it('allows http, https, mailto, tel, relative, query, fragment, and media paths', () => {
      expect(validateTokenizedUrl('https://example.com/a')).to.equal('https://example.com/a');
      expect(validateTokenizedUrl('http://example.com/a')).to.equal('http://example.com/a');
      expect(validateTokenizedUrl('mailto:a@b.com')).to.equal('mailto:a@b.com');
      expect(validateTokenizedUrl('tel:+1555')).to.equal('tel:+1555');
      expect(validateTokenizedUrl('/-/media/a.jpg')).to.equal('/-/media/a.jpg');
      expect(validateTokenizedUrl('?q=1')).to.equal('?q=1');
      expect(validateTokenizedUrl('#frag')).to.equal('#frag');
      expect(validateTokenizedUrl('../page')).to.equal('../page');
    });

    it('rejects unsafe and malformed URLs', () => {
      expect(validateTokenizedUrl('javascript:alert(1)')).to.equal('');
      expect(validateTokenizedUrl('data:text/html,hi')).to.equal('');
      expect(validateTokenizedUrl('vbscript:msg')).to.equal('');
      expect(validateTokenizedUrl('https://example.com/a\\b')).to.equal('');
      expect(validateTokenizedUrl('https://example.com/\u0000')).to.equal('');
    });

    it('validates every srcSet candidate', () => {
      expect(
        validateTokenizedSrcSet('https://a.com/1.jpg 1x, https://a.com/2.jpg 2x')
      ).to.equal('https://a.com/1.jpg 1x, https://a.com/2.jpg 2x');
      expect(
        validateTokenizedSrcSet('https://a.com/1.jpg 1x, javascript:alert(1) 2x')
      ).to.equal('');
    });

    it('validates URL keys only on object replacement when the string changed', () => {
      const input = {
        href: '{{url}}',
        title: '{{url}}',
        src: 'https://example.com/static.jpg',
      };
      const result = replaceTokensInObject(input, {
        url: 'javascript:alert(1)',
      });
      expect(result.href).to.equal('');
      expect(result.title).to.equal('javascript:alert(1)');
      expect(result.src).to.equal('https://example.com/static.jpg');
      expect(
        replaceTokensInObject({ srcset: '{{url}}' }, { url: 'javascript:alert(1)' }).srcset
      ).to.equal('');
    });
  });

  describe('mergePersonalizeTokens', () => {
    it('normalizes strings, finite numbers, 0, and scientific notation', () => {
      const into = createEmptyTokenMap();
      mergePersonalizeTokens(into, {
        name: 'Ada',
        count: 0,
        big: 1e21,
      });
      expect(into.name).to.equal('Ada');
      expect(into.count).to.equal('0');
      expect(into.big).to.equal(String(1e21));
    });

    it('ignores unsupported values and dangerous keys', () => {
      const into = createEmptyTokenMap();
      mergePersonalizeTokens(into, {
        ok: 'yes',
        flag: true,
        n: null,
        u: undefined,
        obj: { a: 1 },
        arr: [1],
        nan: Number.NaN,
        inf: Number.POSITIVE_INFINITY,
        __proto__: 'x',
        constructor: 'y',
        prototype: 'z',
      });
      expect(into).to.deep.equal({ ok: 'yes' });
      expect(Object.prototype.hasOwnProperty.call(into, '__proto__')).to.be.false;
    });

    it('lets later empty values overwrite and reports key-only collisions', () => {
      const into = createEmptyTokenMap();
      const collisions: string[] = [];
      mergePersonalizeTokens(into, { name: 'Ada' });
      mergePersonalizeTokens(into, { name: '' }, (key) => collisions.push(key));
      expect(into.name).to.equal('');
      expect(collisions).to.deep.equal(['name']);
    });

    it('merges execution results in array order and drops invalid variants', () => {
      const tokens = mergeExecutionTokenResults(
        [{ variantIds: ['page-a'] }, { variantIds: ['comp_a'] }],
        [
          { variantId: 'page-a', tokens: { name: 'Ada', city: 'Oslo' } },
          { variantId: 'comp_a', tokens: { name: '' } },
        ]
      );
      expect(tokens.name).to.equal('');
      expect(tokens.city).to.equal('Oslo');
    });

    it('drops tokens without a valid selected variant', () => {
      const tokens = mergeExecutionTokenResults(
        [{ variantIds: ['page-a'] }],
        [{ variantId: 'other', tokens: { name: 'Ada' } }]
      );
      expect(Object.keys(tokens)).to.deep.equal([]);
    });

    it('keeps a valid variant when tokens has an unsupported shape', async () => {
      const result = await collectPersonalizeExecutionTokens(
        [{ variantIds: ['page-a'] }],
        async () => ({ variantId: 'page-a', tokens: 'not-an-object' })
      );
      expect(result.identifiedVariantIds).to.deep.equal(['page-a']);
      expect(Object.keys(result.tokens)).to.deep.equal([]);
    });

    it('accepts JSON results created in another JavaScript realm', async () => {
      const result = await collectPersonalizeExecutionTokens(
        [{ variantIds: ['page-a'] }],
        async () =>
          runInNewContext(
            'JSON.parse(input)',
            { input: JSON.stringify({ variantId: 'page-a', tokens: { name: 'Ada' } }) }
          )
      );
      expect(result.identifiedVariantIds).to.deep.equal(['page-a']);
      expect(result.tokens.name).to.equal('Ada');
    });

    it('does not fail sibling executions when one personalize call rejects', async () => {
      const result = await collectPersonalizeExecutionTokens(
        [{ variantIds: ['page-a'] }, { variantIds: ['comp_a'] }],
        async (execution) => {
          if (execution.variantIds[0] === 'page-a') {
            throw new Error('cdp unavailable');
          }
          return { variantId: 'comp_a', tokens: { name: 'Ada' } };
        }
      );
      expect(result.identifiedVariantIds).to.deep.equal(['comp_a']);
      expect(result.tokens.name).to.equal('Ada');
    });

    it('merges tokens in execution order, not completion order', async () => {
      let releaseFirst: () => void = () => undefined;
      const firstGate = new Promise<void>((resolve) => {
        releaseFirst = resolve;
      });
      const result = await collectPersonalizeExecutionTokens(
        [{ variantIds: ['page-a'] }, { variantIds: ['comp_a'] }],
        async (execution) => {
          if (execution.variantIds[0] === 'page-a') {
            await firstGate;
            return { variantId: 'page-a', tokens: { name: 'first' } };
          }
          releaseFirst();
          return { variantId: 'comp_a', tokens: { name: 'second' } };
        }
      );
      expect(result.tokens.name).to.equal('second');
    });
  });

  describe('codec', () => {
    it('round-trips unicode and empty maps', () => {
      const encoded = encodePersonalizeTokensHeader({ name: 'Åda 😀' });
      expect(decodePersonalizeTokensHeader(encoded)).to.deep.equal({ name: 'Åda 😀' });
      expect(decodePersonalizeTokensHeader(encodePersonalizeTokensHeader({}))).to.deep.equal({});
    });

    it('decodes with atob/TextDecoder when Buffer is absent (Node/Edge parity)', () => {
      const unicode = encodePersonalizeTokensHeader({ name: 'Åda 😀' });
      const empty = encodePersonalizeTokensHeader({});
      const originalBuffer = globalThis.Buffer;
      // @ts-expect-error Edge runtimes do not provide Node Buffer
      delete globalThis.Buffer;
      try {
        expect(decodePersonalizeTokensHeader(unicode)).to.deep.equal({ name: 'Åda 😀' });
        expect(decodePersonalizeTokensHeader(empty)).to.deep.equal({});
        expect(decodePersonalizeTokensHeaderDetailed('____').reason).to.equal('invalid-base64');
        expect(decodePersonalizeTokensHeaderDetailed('A-A_').reason).to.equal('invalid-base64');
        // Non-canonical padding bits: decodes, but does not survive the re-encode check.
        expect(decodePersonalizeTokensHeaderDetailed('YR==').reason).to.equal('invalid-base64');
        // Canonical base64 that is not JSON fails after decoding, not during it.
        expect(decodePersonalizeTokensHeaderDetailed('YWJj').reason).to.equal('invalid-json');
      } finally {
        globalThis.Buffer = originalBuffer;
      }
    });

    it('rejects oversized, invalid base64, json, and shape', () => {
      expect(
        decodePersonalizeTokensHeaderDetailed('A'.repeat(PERSONALIZE_TOKENS_HEADER_MAX_BYTES + 1))
          .reason
      ).to.equal('oversized');
      expect(decodePersonalizeTokensHeaderDetailed('@@@@').reason).to.equal('invalid-base64');
      expect(decodePersonalizeTokensHeader(encodePersonalizeTokensHeader({}))).to.deep.equal({});
      const invalidJson = btoa('[');
      expect(decodePersonalizeTokensHeaderDetailed(invalidJson).ok).to.equal(false);
      const arrayJson = btoa('[]');
      expect(decodePersonalizeTokensHeaderDetailed(arrayJson).reason).to.equal('invalid-shape');
    });
  });

  describe('traversal', () => {
    it('shares unchanged subtrees and preserves sparse holes', () => {
      const unchanged = { value: 'static' };
      const input = {
        sitecore: {
          route: {
            fields: { title: { value: 'Hello {{name}}' } },
            extra: unchanged,
            list: (() => {
              const arr: unknown[] = [];
              arr.length = 3;
              arr[1] = { value: '{{name}}' };
              return arr;
            })(),
          },
        },
      };
      const result = replaceTokensInObject(input, { name: 'Ada' });
      expect(result.sitecore.route.fields.title.value).to.equal('Hello Ada');
      expect(result.sitecore.route.extra).to.equal(unchanged);
      expect(result.sitecore.route.list).to.not.equal(input.sitecore.route.list);
      expect(0 in result.sitecore.route.list).to.be.false;
      expect((result.sitecore.route.list[1] as { value: string }).value).to.equal('Ada');
    });

    it('leaves reserved component experience maps empty after personalizeLayout and still walks a content field named experiences', () => {
      const layout = {
        sitecore: {
          context: {},
          route: {
            name: 'home',
            placeholders: {
              main: [
                {
                  uid: 'c1',
                  componentName: 'ContentBlock',
                  fields: {
                    title: { value: 'Default {{name}}' },
                    experiences: { value: 'Field {{name}}' },
                  },
                  experiences: {
                    'page-a': {
                      uid: 'c1',
                      componentName: 'ContentBlock',
                      fields: {
                        title: { value: 'Variant {{name}}' },
                        experiences: { value: 'Field {{name}}' },
                      },
                      experiences: {
                        unused: {
                          uid: 'c1',
                          componentName: 'ContentBlock',
                          fields: { title: { value: 'Unused {{name}}' } },
                        },
                      },
                    },
                  },
                },
              ],
            },
          },
        },
      };
      personalizeLayout(layout as any, 'page-a');
      const component = layout.sitecore.route.placeholders.main[0] as {
        experiences: unknown;
        fields: { title: { value: string }; experiences: { value: string } };
      };
      expect(component.experiences).to.deep.equal({});
      const result = replaceTokensInObject(layout, { name: 'Ada' });
      const finalized = result.sitecore.route.placeholders.main[0];
      expect(finalized.experiences).to.deep.equal({});
      expect(finalized.fields.title.value).to.equal('Variant Ada');
      expect(finalized.fields.experiences.value).to.equal('Field Ada');
    });

    it('walks a normal field named experiences', () => {
      const result = replaceTokensInObject(
        { experiences: { value: '{{name}}' } },
        { name: 'Ada' }
      );
      expect(result.experiences.value).to.equal('Ada');
    });

    it('leaves unrelated and unchanged URL properties unvalidated', () => {
      const input = { href: 'javascript:alert(1)', title: 'plain' };
      const result = replaceTokensInObject(input, { name: 'Ada' });
      expect(result).to.equal(input);
      expect(result.href).to.equal('javascript:alert(1)');
    });

    it('visits a representative layout once under the preferred walker', () => {
      let transformCalls = 0;
      const layout = {
        context: { language: 'en' },
        route: {
          fields: { title: { value: 'Hello {{name}}' }, body: { value: 'static' } },
        },
      };
      const result = finalizeSitecoreTree(layout, {
        tokens: { name: 'Ada' },
        transform: (value) => {
          transformCalls += 1;
          return value;
        },
      });
      expect(transformCalls).to.equal(3);
      expect(result.route.fields.title.value).to.equal('Hello Ada');
      expect(result.route.fields.body.value).to.equal('static');
      expect(result.context.language).to.equal('en');
    });
  });
});
