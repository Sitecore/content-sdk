/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { getJsonLdSchema } from './json-ld';

describe('getJsonLdSchema', () => {
  it('returns null when context is undefined', () => {
    expect(getJsonLdSchema(undefined)).to.be.null;
  });

  it('returns null when context is null', () => {
    expect(getJsonLdSchema(null)).to.be.null;
  });

  it('returns null when context has no schemas', () => {
    expect(getJsonLdSchema({})).to.be.null;
  });

  it('returns null when schemas is an empty array', () => {
    expect(getJsonLdSchema({ schemas: [] })).to.be.null;
  });

  it('returns null when schemas is not an array', () => {
    expect(getJsonLdSchema({ schemas: { '@type': 'Article' } as unknown as Record<string, unknown>[] }))
      .to.be.null;
  });

  it('serializes all schema objects into a single script as a JSON array', () => {
    const schemas = [
      { '@type': 'Article', headline: 'Page1-title' },
      { '@type': 'FAQPage', mainEntity: 'RT DS - Text' },
    ];

    const script = getJsonLdSchema({ schemas });

    expect(script).to.deep.equal({
      type: 'application/ld+json',
      innerHTML: JSON.stringify(schemas),
    });
  });

  it('escapes "<" and "/" so `</script>` inside a schema value cannot break out of the tag', () => {
    const schemas = [{ '@type': 'Article', headline: '</script><script>alert(1)</script>' }];

    const script = getJsonLdSchema({ schemas });

    expect(script?.innerHTML).to.not.include('</script>');
    expect(script?.innerHTML).to.include('\\u003c\\u002fscript\\u003e');
    expect(JSON.parse(script?.innerHTML ?? '')).to.deep.equal(schemas);
  });

  it('escapes "&" and ">" for defense-in-depth against HTML entity/tag misinterpretation', () => {
    const schemas = [{ '@type': 'Article', headline: 'Tom & Jerry <b>bold</b> a>b' }];

    const script = getJsonLdSchema({ schemas });

    expect(script?.innerHTML).to.not.include('&');
    expect(script?.innerHTML).to.not.include('>');
    expect(script?.innerHTML).to.include('\\u0026');
    expect(script?.innerHTML).to.include('\\u003e');
    expect(JSON.parse(script?.innerHTML ?? '')).to.deep.equal(schemas);
  });

  it('escapes "/" (e.g. in URLs) for defense-in-depth, without breaking JSON parsing', () => {
    const schemas = [{ '@context': 'https://schema.org', '@type': 'Article', url: 'https://a.b/c/d' }];

    const script = getJsonLdSchema({ schemas });

    expect(script?.innerHTML).to.not.include('/');
    expect(script?.innerHTML).to.include('\\u002f');
    expect(JSON.parse(script?.innerHTML ?? '')).to.deep.equal(schemas);
  });

  it('escapes U+2028/U+2029 line separators', () => {
    const schemas = [{ '@type': 'Article', headline: 'line\u2028break\u2029here' }];

    const script = getJsonLdSchema({ schemas });

    expect(script?.innerHTML).to.equal(
      '[{"@type":"Article","headline":"line\\u2028break\\u2029here"}]'
    );
  });
});
