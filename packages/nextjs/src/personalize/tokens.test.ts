/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import {
  encodePersonalizeTokens,
  PERSONALIZE_TOKENS_HEADER,
} from '@sitecore-content-sdk/content/personalize';
import { getPersonalizeTokens } from './tokens';

describe('getPersonalizeTokens', () => {
  const encoded = encodePersonalizeTokens({ name: 'Łukasz' }) as string;

  it('does not read headers when the path has no tokens marker', async () => {
    const getHeaders = sinon.stub().returns(new Headers());

    expect(await getPersonalizeTokens(['about', '_variantId_c1_a'], getHeaders)).to.be.undefined;
    expect(await getPersonalizeTokens('/about', getHeaders)).to.be.undefined;
    expect(await getPersonalizeTokens(undefined, getHeaders)).to.be.undefined;
    expect(getHeaders.called).to.be.false;
  });

  it('decodes tokens from web headers on marked paths', async () => {
    const headers = new Headers({ [PERSONALIZE_TOKENS_HEADER]: encoded });

    const tokens = await getPersonalizeTokens(['about', '_variantId_c1_a', '_sctokens'], () =>
      Promise.resolve(headers)
    );

    expect({ ...tokens }).to.deep.equal({ name: 'Łukasz' });
  });

  it('decodes tokens from Node headers on marked paths', async () => {
    const tokens = await getPersonalizeTokens('/about/_sctokens', () => ({
      [PERSONALIZE_TOKENS_HEADER]: [encoded, 'ignored'],
    }));

    expect({ ...tokens }).to.deep.equal({ name: 'Łukasz' });
  });

  it('returns undefined when the header is missing or invalid', async () => {
    expect(await getPersonalizeTokens('/_sctokens', () => new Headers())).to.be.undefined;
    expect(
      await getPersonalizeTokens('/_sctokens', () => ({ [PERSONALIZE_TOKENS_HEADER]: '%%%' }))
    ).to.be.undefined;
  });
});
