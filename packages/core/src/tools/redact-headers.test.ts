import { expect } from 'chai';
import { redactSensitiveHeaders, REDACTED_HEADER_VALUE } from './redact-headers';

describe('redactSensitiveHeaders', () => {
  it('should redact the editing secret header', () => {
    const result = redactSensitiveHeaders({
      host: 'localhost:3000',
      'x-sitecore-editing-secret': 'top-secret',
    });

    expect(result).to.deep.equal({
      host: 'localhost:3000',
      'x-sitecore-editing-secret': REDACTED_HEADER_VALUE,
    });
  });

  it('should match header names case-insensitively', () => {
    const result = redactSensitiveHeaders({ 'X-Sitecore-Editing-Secret': 'top-secret' });

    expect(result).to.deep.equal({ 'X-Sitecore-Editing-Secret': REDACTED_HEADER_VALUE });
  });

  it('should redact a header with multiple values', () => {
    const result = redactSensitiveHeaders({ 'x-sitecore-editing-secret': ['one', 'two'] });

    expect(result['x-sitecore-editing-secret']).to.equal(REDACTED_HEADER_VALUE);
  });

  it('should leave other headers untouched', () => {
    const headers = { accept: '*/*', cookie: 'a=b', 'set-cookie': ['a=b', 'c=d'] };

    expect(redactSensitiveHeaders(headers)).to.deep.equal(headers);
  });

  it('should return an empty object for empty headers', () => {
    expect(redactSensitiveHeaders({})).to.deep.equal({});
  });

  it('should not modify the original headers', () => {
    const headers = { 'x-sitecore-editing-secret': 'top-secret' };

    redactSensitiveHeaders(headers);

    expect(headers['x-sitecore-editing-secret']).to.equal('top-secret');
  });
});
