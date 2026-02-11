import { SITECORE_EDGE_URL } from '../consts';
import { resolveGetClientIdUrl } from './resolve-get-client-id-url';
import { expect } from '@jest/globals';

describe('resolveGetClientIdUrl', () => {
  it('should correctly create the URL for retrieving the client Id from EDGE events proxy', () => {
    const result = resolveGetClientIdUrl(SITECORE_EDGE_URL);
    expect(result).toBe(
      // eslint-disable-next-line max-len
      `${SITECORE_EDGE_URL}/v1/events/v1.2/browser/create.json?client_key=`
    );
  });
});
