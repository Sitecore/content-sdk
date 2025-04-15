/* eslint-disable dot-notation */
import { expect } from 'chai';
import sinon from 'sinon';
// import debug from '../debug';
import { ContentClient } from './content-client';
import { GraphQLRequestClient } from '../graphql-request-client';
import 'mocha';

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
      // expect(client.graphqlClient['debug']).to.deep.equal(debug.content);
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
});
