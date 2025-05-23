/* eslint-disable dot-notation */
import { expect } from 'chai';
import sinon from 'sinon';
import { ContentClient } from './content-client';
import { GraphQLRequestClient } from '../graphql-request-client';
import { GET_LOCALE_QUERY, GET_LOCALES_QUERY } from './locales';
import { GET_TAXONOMIES_QUERY, GET_TAXONOMY_QUERY } from './taxonomies';

describe('content-client', () => {
  describe('constructor', () => {
    it('should initialize endpoint and graphqlClient', () => {
      const options = {
        url: 'https://example.com',
        tenant: 'test-tenant',
        environment: 'test-env',
        preview: true,
        token: 'test-token',
      };

      const client = new ContentClient(options);

      expect(client.endpoint).to.equal(
        'https://example.com/api/graphql/v1/test-tenant/test-env?preview=true'
      );
      expect(client.graphqlClient).to.be.instanceOf(GraphQLRequestClient);
      expect(client.graphqlClient['headers']).to.deep.equal({
        Authorization: 'Bearer test-token',
      });
    });
  });

  describe('createClient', () => {
    it('should throw an error if tenant is not provided', () => {
      expect(() =>
        ContentClient.createClient({
          token: 'test-token',
        })
      ).to.throw(
        'Tenant is required to be provided as an argument or as a SITECORE_CS_TENANT environment variable'
      );
    });

    it('should throw an error if token is not provided', () => {
      expect(() =>
        ContentClient.createClient({
          tenant: 'test-tenant',
        })
      ).to.throw(
        'Token is required to be provided as an argument or as a SITECORE_CS_TOKEN environment variable'
      );
    });

    it('should create a ContentClient instance with default values', () => {
      const client = ContentClient.createClient({
        tenant: 'test-tenant',
        token: 'test-token',
      });

      expect(client).to.be.instanceOf(ContentClient);
      expect(client.endpoint).to.equal(
        'https://cs-graphqlapi-staging.sitecore-staging.cloud/api/graphql/v1/test-tenant/main?preview=false'
      );
    });

    it('should create a ContentClient instance with custom values', () => {
      const client = ContentClient.createClient({
        url: 'https://custom-url.com',
        tenant: 'test-tenant',
        environment: 'test-env',
        preview: true,
        token: 'test-token',
      });

      expect(client.endpoint).to.equal(
        'https://custom-url.com/api/graphql/v1/test-tenant/test-env?preview=true'
      );
    });

    it('should create a ContentClient instance with environment variables', () => {
      process.env.SITECORE_CS_URL = 'https://example.com';
      process.env.SITECORE_CS_TENANT = 'test-tenant';
      process.env.SITECORE_CS_ENVIRONMENT = 'test-env';
      process.env.SITECORE_CS_PREVIEW = 'false';
      process.env.SITECORE_CS_TOKEN = 'test-token';

      expect(ContentClient.createClient().endpoint).to.equal(
        'https://example.com/api/graphql/v1/test-tenant/test-env?preview=false'
      );

      process.env.SITECORE_CS_PREVIEW = 'true';

      expect(ContentClient.createClient().endpoint).to.equal(
        'https://example.com/api/graphql/v1/test-tenant/test-env?preview=true'
      );
    });
  });

  describe('get', () => {
    let client: ContentClient;
    let requestStub: sinon.SinonStub;

    beforeEach(() => {
      client = new ContentClient({
        url: 'https://example.com',
        tenant: 'test-tenant',
        environment: 'test-env',
        preview: true,
        token: 'test-token',
      });

      requestStub = sinon.stub(client.graphqlClient, 'request');
    });

    it('should call graphqlClient with correct arguments', async () => {
      const query = '{ testQuery }';
      const variables = { key: 'value' };
      const options = { headers: { 'Custom-Header': 'value' } };

      requestStub.resolves({ data: 'test-data' });

      const result = await client.get<{ data: string }>(query, variables, options);

      expect(requestStub.calledOnce).to.be.true;
      expect(requestStub.calledWith(query, variables, options)).to.be.true;
      expect(result).to.deep.equal({ data: 'test-data' });
    });

    it('should handle errors thrown by graphqlClient', async () => {
      const query = '{ testQuery }';
      const error = new Error('Test error');

      requestStub.rejects(error);

      try {
        await client.get(query);
      } catch (err) {
        expect(err).to.equal(error);
      }
    });
  });

  describe('getLocale', () => {
    let client: ContentClient;
    let requestStub: sinon.SinonStub;

    beforeEach(() => {
      client = new ContentClient({
        url: 'https://example.com',
        tenant: 'test-tenant',
        environment: 'test-env',
        preview: true,
        token: 'test-token',
      });

      requestStub = sinon.stub(client.graphqlClient, 'request');
    });

    it('should retrieve a locale by ID', async () => {
      const localeId = 'en-us';
      const mockResponse = { locale: { id: localeId, label: 'English (US)' } };

      requestStub.resolves(mockResponse);

      const result = await client.getLocale(localeId);

      expect(requestStub.calledOnce).to.be.true;
      expect(requestStub.calledWith(GET_LOCALE_QUERY, { id: localeId })).to.be.true;
      expect(result).to.deep.equal(mockResponse.locale);
    });

    it('should handle errors when retrieving a locale by ID', async () => {
      const localeId = 'en-us';
      const error = new Error('Failed to fetch locale');

      requestStub.rejects(error);

      try {
        await client.getLocale(localeId);
      } catch (err) {
        expect(err).to.equal(error);
      }
    });
  });

  describe('getLocales', () => {
    let client: ContentClient;
    let requestStub: sinon.SinonStub;

    beforeEach(() => {
      client = new ContentClient({
        url: 'https://example.com',
        tenant: 'test-tenant',
        environment: 'test-env',
        preview: true,
        token: 'test-token',
      });

      requestStub = sinon.stub(client.graphqlClient, 'request');
    });

    it('should retrieve all available locales', async () => {
      const mockResponse = {
        manyLocale: [
          { id: 'en-us', label: 'English (US)' },
          { id: 'fr-fr', label: 'French (France)' },
        ],
      };

      requestStub.resolves(mockResponse);

      const result = await client.getLocales();

      expect(requestStub.calledOnce).to.be.true;
      expect(requestStub.calledWith(GET_LOCALES_QUERY)).to.be.true;
      expect(result).to.deep.equal(mockResponse.manyLocale);
    });

    it('should handle errors when retrieving all locales', async () => {
      const error = new Error('Failed to fetch locales');

      requestStub.rejects(error);

      try {
        await client.getLocales();
      } catch (err) {
        expect(err).to.equal(error);
      }
    });
  });

  describe('getTaxonomies', () => {
    let client: ContentClient;
    let requestStub: sinon.SinonStub;

    beforeEach(() => {
      client = new ContentClient({
        url: 'https://example.com',
        tenant: 'test-tenant',
        environment: 'test-env',
        preview: true,
        token: 'test-token',
      });

      requestStub = sinon.stub(client.graphqlClient, 'request');
    });

    it('should retrieve all available taxonomies', async () => {
      const mockResponse = {
        manyTaxonomy: {
          results: [
            {
              terms: {
                results: [
                  { id: 'term1', name: 'Term 1', label: 'First Term' },
                  { id: 'term2', name: 'Term 2', label: 'Second Term' },
                ],
              },
              system: {
                id: 'tax1',
                name: 'Taxonomy 1',
                version: 1,
                label: 'First Taxonomy',
                createdAt: '2024-01-01',
                createdBy: 'user1',
                updatedAt: '2024-01-02',
                updatedBy: 'user2',
                publishStatus: 'published',
              },
            },
          ],
        },
      };

      requestStub.resolves(mockResponse);

      const result = await client.getTaxonomies();

      expect(requestStub.calledOnce).to.be.true;
      expect(requestStub.calledWith(GET_TAXONOMIES_QUERY)).to.be.true;
      expect(result).to.deep.equal(mockResponse.manyTaxonomy);
    });

    it('should handle null response', async () => {
      requestStub.resolves({ manyTaxonomy: null });

      const result = await client.getTaxonomies();
      expect(result).to.be.null;
    });

    it('should handle errors when retrieving taxonomies', async () => {
      const error = new Error('Failed to fetch taxonomies');
      requestStub.rejects(error);

      try {
        await client.getTaxonomies();
      } catch (err) {
        expect(err).to.equal(error);
      }
    });
  });

  describe('getTaxonomy', () => {
    let client: ContentClient;
    let requestStub: sinon.SinonStub;

    beforeEach(() => {
      client = new ContentClient({
        url: 'https://example.com',
        tenant: 'test-tenant',
        environment: 'test-env',
        preview: true,
        token: 'test-token',
      });

      requestStub = sinon.stub(client.graphqlClient, 'request');
    });

    it('should retrieve a taxonomy by ID', async () => {
      const taxonomyId = 'tax1';
      const mockResponse = {
        taxonomy: {
          terms: {
            results: [
              { id: 'term1', name: 'Term 1', label: 'First Term' },
              { id: 'term2', name: 'Term 2', label: 'Second Term' },
            ],
          },
          system: {
            id: taxonomyId,
            name: 'Taxonomy 1',
            version: 1,
            label: 'First Taxonomy',
            createdAt: '2024-01-01',
            createdBy: 'user1',
            updatedAt: '2024-01-02',
            updatedBy: 'user2',
            publishStatus: 'published',
          },
        },
      };

      requestStub.resolves(mockResponse);

      const result = await client.getTaxonomy(taxonomyId);

      expect(requestStub.calledOnce).to.be.true;
      expect(requestStub.calledWith(GET_TAXONOMY_QUERY, { id: taxonomyId })).to.be.true;
      expect(result).to.deep.equal(mockResponse.taxonomy);
    });

    it('should handle null response', async () => {
      const taxonomyId = 'nonexistent';
      requestStub.resolves({ taxonomy: null });

      const result = await client.getTaxonomy(taxonomyId);
      expect(result).to.be.null;
    });

    it('should handle errors when retrieving a taxonomy', async () => {
      const taxonomyId = 'tax1';
      const error = new Error('Failed to fetch taxonomy');
      requestStub.rejects(error);

      try {
        await client.getTaxonomy(taxonomyId);
      } catch (err) {
        expect(err).to.equal(error);
      }
    });
  });
});
