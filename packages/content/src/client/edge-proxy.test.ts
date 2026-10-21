/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { constants } from '@sitecore-content-sdk/core';
import { getEdgeProxyContentUrl, getEdgeProxyFormsUrl } from './edge-proxy';

const { SITECORE_EDGE_PLATFORM_URL_DEFAULT } = constants;

describe('edge-proxy', () => {
  describe('getEdgeProxyContentUrl', () => {
    it('should return url', () => {
      const url = getEdgeProxyContentUrl();

      expect(url).to.equal(`${SITECORE_EDGE_PLATFORM_URL_DEFAULT}/v1/content/api/graphql/v1`);
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

      expect(url).to.equal(`${SITECORE_EDGE_PLATFORM_URL_DEFAULT}/v1/forms/publisher/${formId}`);
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

    it('should not include the context id in the query string', () => {
      const url = getEdgeProxyFormsUrl(formId, 'https://test.com', 'fr-FR');

      expect(url).to.not.contain('sitecoreContextId');
    });

    it('should append language when provided', () => {
      const sitecoreEdgeUrl = 'https://test.com';

      const url = getEdgeProxyFormsUrl(formId, sitecoreEdgeUrl, 'fr-FR');

      expect(url).to.equal(`https://test.com/v1/forms/publisher/${formId}?language=fr-FR`);
    });
  });
});
