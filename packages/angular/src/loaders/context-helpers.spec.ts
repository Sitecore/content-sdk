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
  it('reads the tokens forwarded by the personalize middleware from the request data', () => {
    const encoded = encodePersonalizeTokens({ name: 'Ada' }) as string;

    expect({ ...getPersonalizeTokens(context({ [PERSONALIZE_TOKENS_HEADER]: encoded })) }).toEqual({
      name: 'Ada',
    });
    expect(getPersonalizeTokens(context())).toBeUndefined();
  });
});
