import { runtimeConfig as config } from '@sitecore-content-sdk/nextjs/config';
import { createGraphQLClientFactory } from './create';

// The GraphQLRequestClientFactory serves as the central hub for executing GraphQL requests within the application

// Create a new instance on each import call
export default createGraphQLClientFactory(config);
