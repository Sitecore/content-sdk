import { LayoutService, GraphQLLayoutService } from '@sitecore-content-sdk/nextjs';
import clientFactory from 'lib/graphql-client-factory';
import sitecoreConfig from 'sitecore.config';
/**
 * Factory responsible for creating a LayoutService instance
 */
export class LayoutServiceFactory {
  /**
   * @param {string} siteName site name
   * @returns {LayoutService} service instance
   */
  create(siteName: string): LayoutService {
    // providing config values directly as a stopgap, until factory is migrated to package
    return new GraphQLLayoutService({
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
      formatLayoutQuery: sitecoreConfig.layout.formatLayoutQuery,
    });
  }
}

/** LayoutServiceFactory singleton */
export const layoutServiceFactory = new LayoutServiceFactory();
