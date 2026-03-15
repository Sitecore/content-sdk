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
    const sitecoreEdgeContextId = '0730fc5a-3333-5555-5555-08db6d7ddb49';

    it('should return url', () => {
      const url = getEdgeProxyFormsUrl(sitecoreEdgeContextId, formId);

      expect(url).to.equal(
        `${SITECORE_EDGE_PLATFORM_URL_DEFAULT}/v1/forms/publisher/${formId}?sitecoreContextId=${sitecoreEdgeContextId}`
      );
    });

    it('should return url when custom sitecoreEdgeUrl is provided', () => {
      const sitecoreEdgeUrl = 'https://test.com';

      const url = getEdgeProxyFormsUrl(sitecoreEdgeContextId, formId, sitecoreEdgeUrl);

      expect(url).to.equal(
        `https://test.com/v1/forms/publisher/${formId}?sitecoreContextId=${sitecoreEdgeContextId}`
      );
    });

    it('should return url when sitecoreEdgeUrl ends with /', () => {
      const sitecoreEdgeUrl = 'https://test.com/';

      const url = getEdgeProxyFormsUrl(sitecoreEdgeContextId, formId, sitecoreEdgeUrl);

      expect(url).to.equal(
        `https://test.com/v1/forms/publisher/${formId}?sitecoreContextId=${sitecoreEdgeContextId}`
      );
    });
  });
});
