import { DictionaryService, GraphQLDictionaryService } from '@sitecore-content-sdk/nextjs';
import clientFactory from 'lib/graphql-client-factory';
import sitecoreConfig from 'sitecore.config';

/**
 * Factory responsible for creating a DictionaryService instance
 */
export class DictionaryServiceFactory {
  /**
   * @param {string} siteName site name
   * @returns {DictionaryService} service instance
   */
  create(siteName: string): DictionaryService {
    return new GraphQLDictionaryService({
      siteName,
      clientFactory,
      /*
        GraphQL endpoint may reach its rate limit with the amount of requests it receives and throw a rate limit error.
        GraphQL Dictionary and Layout Services can handle rate limit errors from server and attempt a retry on requests.
        For this, specify the number of 'retries' the GraphQL client will attempt.
        By default it is set to 3. You can disable it by configuring it to 0 for this service.

        Additionally, you have the flexibility to customize the retry strategy by passing a 'retryStrategy'.
        By default it uses the `DefaultRetryStrategy` with exponential back-off factor of 2 and handles error codes 429,
        502, 503, 504, 520, 521, 522, 523, 524, 'ECONNRESET', 'ETIMEDOUT' and 'EPROTO' . You can use this class or your own implementation of `RetryStrategy`.
      */
      retries: sitecoreConfig.retries.count,
      retryStrategy: sitecoreConfig.retries.retryStrategy,
    });
  }
}

/** DictionaryServiceFactory singleton */
export const dictionaryServiceFactory = new DictionaryServiceFactory();
