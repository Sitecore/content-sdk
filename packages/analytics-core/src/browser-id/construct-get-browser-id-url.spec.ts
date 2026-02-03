import { SITECORE_EDGE_URL } from '../consts';
import { constructGetBrowserIdUrl } from './construct-get-browser-id-url';
import { expect } from '@jest/globals';

describe('constructGetBrowserIdUrl', () => {
  it('should correctly create the URL for retrieving the browser Id from EDGE events proxy', () => {
    const result = constructGetBrowserIdUrl(SITECORE_EDGE_URL);
    expect(result).toBe(
      // eslint-disable-next-line max-len
      `${SITECORE_EDGE_URL}/v1/events/v1.2/browser/create.json?client_key=`
    );
  });
});
