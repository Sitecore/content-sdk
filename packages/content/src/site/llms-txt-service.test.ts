import { expect } from 'chai';
import nock from 'nock';
import { GraphQLRequestClient, constants } from '@sitecore-content-sdk/core';
import { LlmsTxtService } from './llms-txt-service';
import { FetchOptions } from '../../client';

const { ERROR_MESSAGES } = constants;

const llmsTxtQueryResultNull = {
  site: {
    siteInfo: null,
  },
};

describe('LlmsTxtService', () => {
  const endpoint = 'http://site';
  const apiKey = 'some-api-key';
  const siteName = 'site-name';
  const clientFactory = GraphQLRequestClient.createClientFactory({
    endpoint,
    apiKey,
  });

  afterEach(() => {
    nock.cleanAll();
  });

  const mockLlmsTxtRequest = (siteName?: string, fetchOptions?: FetchOptions) => {
    nock(endpoint, {
      reqheaders: fetchOptions?.headers,
    })
      .post('/')
      .reply(
        200,
        siteName
          ? {
              data: {
                site: {
                  siteInfo: {
                    llmsTxt: siteName,
                  },
                },
              },
            }
          : {
              data: llmsTxtQueryResultNull,
            }
      );
  };

  describe('Fetch llms.txt', () => {
    it('should get error if llms.txt has empty sitename', async () => {
      mockLlmsTxtRequest();

      const service = new LlmsTxtService({ clientFactory, siteName: '' });
      await service.fetchLlmsTxt().catch((error: Error) => {
        expect(error.message).to.equal(ERROR_MESSAGES.MV_002);
      });

      return expect(nock.isDone()).to.be.false;
    });

    it('should get llms.txt', async () => {
      mockLlmsTxtRequest(siteName);

      const service = new LlmsTxtService({ clientFactory, siteName });
      const llmsTxt = await service.fetchLlmsTxt();
      expect(llmsTxt).to.equal(siteName);

      return expect(nock.isDone()).to.be.true;
    });

    it('should pass fetchOptions to the GraphQL client request', async () => {
      const fetchOptions = {
        headers: { 'X-Test-Header': 'true' },
        cache: 'no-store' as RequestCache,
      };

      mockLlmsTxtRequest('# llms.txt\n\n> Example site.', fetchOptions);

      const service = new LlmsTxtService({
        siteName: 'test-site',
        clientFactory: () => new GraphQLRequestClient(endpoint),
      });

      const result = await service.fetchLlmsTxt(fetchOptions);

      expect(result).to.equal('# llms.txt\n\n> Example site.');
      return expect(nock.isDone()).to.be.true;
    });
  });
});
