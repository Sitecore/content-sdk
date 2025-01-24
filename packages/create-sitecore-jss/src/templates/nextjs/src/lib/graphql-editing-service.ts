import { GraphQLEditingService } from '@xmcloud-jss/sitecore-jss-nextjs/editing';
import clientFactory from 'lib/graphql-client-factory';

/**
 * GraphQL Editing Service instance. Used to fetch editing data in Pages preview (editing) mode.
 */
export const graphQLEditingService = new GraphQLEditingService({
  clientFactory,
});
