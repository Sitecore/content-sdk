import { expect } from 'chai';
import { getContentUrl } from './utils';

describe('utils', () => {
  describe('getContentUrl', () => {
    const tenant = 'my-tenant';
    const environment = 'my-environment';

    it('should return the correct endpoint url with default url', () => {
      const url = getContentUrl({
        tenant,
        environment,
        preview: true,
      });

      expect(url).to.equal(
        `https://cs-graphqlapi-staging.sitecore-staging.cloud/api/graphql/v1/${tenant}/${environment}?preview=true`
      );
    });

    it('should return the correct endpoint url with custom url', () => {
      const url = getContentUrl({
        url: 'https://my-custom-url.com',
        tenant,
        environment,
        preview: false,
      });

      expect(url).to.equal(
        `https://my-custom-url.com/api/graphql/v1/${tenant}/${environment}?preview=false`
      );
    });

    it('should return the correct endpoint url with custom url and trailing slash', () => {
      const url = getContentUrl({
        url: 'https://my-custom-url.com/',
        tenant,
        environment,
        preview: false,
      });

      expect(url).to.equal(
        `https://my-custom-url.com/api/graphql/v1/${tenant}/${environment}?preview=false`
      );
    });
  });
});
