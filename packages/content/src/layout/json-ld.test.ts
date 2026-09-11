/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { getJsonLdSchemas } from './json-ld';

describe('getJsonLdSchemas', () => {
  it('returns null when schemas is undefined', () => {
    expect(getJsonLdSchemas(undefined)).to.be.null;
  });

  it('returns null when schemas is null', () => {
    expect(getJsonLdSchemas(null)).to.be.null;
  });

  it('returns null when schemas is an empty array', () => {
    expect(getJsonLdSchemas([])).to.be.null;
  });

  it('returns null when schemas is not an array', () => {
    expect(getJsonLdSchemas({ '@type': 'Article' } as unknown as Record<string, unknown>[])).to.be
      .null;
  });

  it('filters out null/undefined/non-object entries, keeping only valid schema objects', () => {
    const validSchema = { '@type': 'Article', headline: 'Page1-title' };
    const schemas = [
      null,
      undefined,
      validSchema,
      'invalid',
      42,
      ['nested', 'array'],
    ] as unknown as Record<string, unknown>[];

    const script = getJsonLdSchemas(schemas);

    expect(script).to.deep.equal({
      type: 'application/ld+json',
      innerHTML: JSON.stringify([validSchema]),
    });
  });

  it('returns null when all schema entries are invalid', () => {
    const schemas = [null, undefined, 'invalid', 42] as unknown as Record<string, unknown>[];

    expect(getJsonLdSchemas(schemas)).to.be.null;
  });

  it('serializes all schema objects into a single script as a JSON array', () => {
    const schemas = [
      { '@type': 'Article', headline: 'Page1-title' },
      { '@type': 'FAQPage', mainEntity: 'RT DS - Text' },
    ];

    const script = getJsonLdSchemas(schemas);

    expect(script).to.deep.equal({
      type: 'application/ld+json',
      innerHTML: JSON.stringify(schemas),
    });
  });

  it('escapes "<" and "/" so `</script>` inside a schema value cannot break out of the tag', () => {
    const schemas = [{ '@type': 'Article', headline: '</script><script>alert(1)</script>' }];

    const script = getJsonLdSchemas(schemas);

    expect(script?.innerHTML).to.not.include('</script>');
    expect(script?.innerHTML).to.include('\\u003c\\u002fscript\\u003e');
    expect(JSON.parse(script?.innerHTML ?? '')).to.deep.equal(schemas);
  });

  it('escapes "&" and ">" for defense-in-depth against HTML entity/tag misinterpretation', () => {
    const schemas = [{ '@type': 'Article', headline: 'Tom & Jerry <b>bold</b> a>b' }];

    const script = getJsonLdSchemas(schemas);

    expect(script?.innerHTML).to.not.include('&');
    expect(script?.innerHTML).to.not.include('>');
    expect(script?.innerHTML).to.include('\\u0026');
    expect(script?.innerHTML).to.include('\\u003e');
    expect(JSON.parse(script?.innerHTML ?? '')).to.deep.equal(schemas);
  });

  it('escapes "/" (e.g. in URLs) for defense-in-depth, without breaking JSON parsing', () => {
    const schemas = [
      { '@context': 'https://schema.org', '@type': 'Article', url: 'https://a.b/c/d' },
    ];

    const script = getJsonLdSchemas(schemas);

    expect(script?.innerHTML).to.not.include('/');
    expect(script?.innerHTML).to.include('\\u002f');
    expect(JSON.parse(script?.innerHTML ?? '')).to.deep.equal(schemas);
  });

  it('escapes U+2028/U+2029 line separators', () => {
    const schemas = [{ '@type': 'Article', headline: 'line\u2028break\u2029here' }];

    const script = getJsonLdSchemas(schemas);

    expect(script?.innerHTML).to.equal(
      '[{"@type":"Article","headline":"line\\u2028break\\u2029here"}]'
    );
  });
});
