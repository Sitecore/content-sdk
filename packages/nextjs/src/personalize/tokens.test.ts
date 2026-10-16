/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import {
  encodePersonalizeTokensHeader,
  PERSONALIZE_TOKENS_HEADER,
} from '@sitecore-content-sdk/content/personalize';
import { readPersonalizeTokens } from './tokens';

describe('readPersonalizeTokens', () => {
  it('returns undefined when the header is missing', () => {
    expect(readPersonalizeTokens(undefined)).to.equal(undefined);
    expect(readPersonalizeTokens(new Headers())).to.equal(undefined);
  });

  it('decodes a valid encoded map including empty maps', () => {
    const headers = new Headers();
    headers.set(PERSONALIZE_TOKENS_HEADER, encodePersonalizeTokensHeader({ name: 'Ada' }));
    expect(readPersonalizeTokens(headers)).to.deep.equal({ name: 'Ada' });

    const empty = new Headers();
    empty.set(PERSONALIZE_TOKENS_HEADER, encodePersonalizeTokensHeader({}));
    expect(readPersonalizeTokens(empty)).to.deep.equal({});
  });

  it('returns {} for invalid payloads and uses the first Node array value', () => {
    expect(
      readPersonalizeTokens({ [PERSONALIZE_TOKENS_HEADER]: '@@@@' })
    ).to.deep.equal({});
    expect(
      readPersonalizeTokens({
        [PERSONALIZE_TOKENS_HEADER]: [encodePersonalizeTokensHeader({ name: 'Ada' }), 'ignored'],
      })
    ).to.deep.equal({ name: 'Ada' });
  });

  it('looks up the header case-insensitively', () => {
    expect(
      readPersonalizeTokens({
        'X-SC-PERSONALIZE-TOKENS': encodePersonalizeTokensHeader({ city: 'Oslo' }),
      })
    ).to.deep.equal({ city: 'Oslo' });
  });
});
