/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { getEdgeProxyContentUrl, getEdgeProxyFormsUrl } from './edge-proxy';
import { SITECORE_EDGE_URL_DEFAULT } from '../constants';

describe('edge-proxy', () => {
  describe('getEdgeProxyContentUrl', () => {
    it('should return url', () => {
      const url = getEdgeProxyContentUrl();

      expect(url).to.equal(`${SITECORE_EDGE_URL_DEFAULT}/v1/content/api/graphql/v1`);
    });

    it('should return url when custom sitecoreEdgeUrl is provided', () => {
      const sitecoreEdgeUrl = 'https://test.com';

      const url = getEdgeProxyContentUrl(sitecoreEdgeUrl);

      expect(url).to.equal('https://test.com/v1/content/api/graphql/v1');
    });

    it('should return url when sitecoreEdgeUrl ends with /', () => {
      const sitecoreEdgeUrl = 'https://test.com/';

      const url = getEdgeProxyContentUrl(sitecoreEdgeUrl);

      expect(url).to.equal('https://test.com/v1/content/api/graphql/v1');
    });
  });

  describe('getEdgeProxyFormsUrl', () => {
    const formId = 'test-form-id';

    it('should return url', () => {
      const url = getEdgeProxyFormsUrl(formId);

      expect(url).to.equal(`${SITECORE_EDGE_URL_DEFAULT}/v1/forms/publisher/${formId}`);
    });

    it('should return url when custom sitecoreEdgeUrl is provided', () => {
      const sitecoreEdgeUrl = 'https://test.com';

      const url = getEdgeProxyFormsUrl(formId, sitecoreEdgeUrl);

      expect(url).to.equal(`https://test.com/v1/forms/publisher/${formId}`);
    });

    it('should return url when sitecoreEdgeUrl ends with /', () => {
      const sitecoreEdgeUrl = 'https://test.com/';

      const url = getEdgeProxyFormsUrl(formId, sitecoreEdgeUrl);

      expect(url).to.equal(`https://test.com/v1/forms/publisher/${formId}`);
    });
  });
});
