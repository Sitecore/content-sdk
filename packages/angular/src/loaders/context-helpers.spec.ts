import { describe, it, expect } from 'vitest';
import {
  encodePersonalizeTokens,
  PERSONALIZE_TOKENS_HEADER,
} from '@sitecore-content-sdk/content/personalize';
import { getPersonalizeTokens } from './context-helpers';
import type { LoaderContext } from './models';

const context = (headers?: Record<string, string | string[] | undefined>): LoaderContext => ({
  url: '/about',
  routeParams: {},
  query: {},
  scParams: { siteName: 'website' },
  csdkRequestData: headers ? { headers } : undefined,
});

describe('getPersonalizeTokens', () => {
  it('returns the tokens forwarded by the personalize middleware', () => {
    const encoded = encodePersonalizeTokens({ name: 'Ada' }) as string;

    expect({ ...getPersonalizeTokens(context({ [PERSONALIZE_TOKENS_HEADER]: encoded })) }).toEqual({
      name: 'Ada',
    });
    expect({ ...getPersonalizeTokens(context({ [PERSONALIZE_TOKENS_HEADER]: [encoded] })) }).toEqual(
      { name: 'Ada' }
    );
  });

  it('returns undefined when there are no valid tokens', () => {
    expect(getPersonalizeTokens(context())).toBeUndefined();
    expect(getPersonalizeTokens(context({}))).toBeUndefined();
    expect(getPersonalizeTokens(context({ [PERSONALIZE_TOKENS_HEADER]: '%%' }))).toBeUndefined();
  });
});
