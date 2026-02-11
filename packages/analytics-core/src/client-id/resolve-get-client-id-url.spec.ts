import { constants } from '@sitecore-content-sdk/core';
import { resolveGetClientIdUrl } from './resolve-get-client-id-url';
import { expect } from '@jest/globals';

const { SITECORE_EDGE_URL_DEFAULT } = constants;

describe('resolveGetClientIdUrl', () => {
  it('should correctly create the URL for retrieving the client Id from EDGE events proxy', () => {
    const result = resolveGetClientIdUrl(SITECORE_EDGE_URL_DEFAULT);
    expect(result).toBe(
      // eslint-disable-next-line max-len
      `${SITECORE_EDGE_URL_DEFAULT}/v1/events/v1.2/browser/create.json?client_key=`
    );
  });
});
