import { GraphQLRequestClient } from '@sitecore-content-sdk/nextjs/client';
import fs from 'fs';
import { getIntrospectionQuery } from 'graphql';

// This script load graphql introspection data in order to use graphql code generator and generate typescript types
// The `jss graphql:update` command should be executed when Sitecore templates related to the site are altered.

let jssConfig;

try {
  // eslint-disable-next-line
  jssConfig = require('../src/temp/config');
} catch (e) {
  console.error('Unable to require JSS config. Ensure the app has been started at least once.');
  console.error(e);
  process.exit(1);
}

console.log(`Fetch graphql introspection data from ${jssConfig.graphQLEndpoint}...`);

const client = new GraphQLRequestClient(jssConfig.graphQLEndpoint, {
  apiKey: jssConfig.sitecoreApiKey,
});

client
  .request(getIntrospectionQuery())
  .then((result) => {
    fs.writeFile(
      './src/temp/GraphQLIntrospectionResult.json',
      JSON.stringify(result, null, 2),
      (err) => {
        if (err) {
          console.error('Error writing GraphQLIntrospectionResult file', err);
          return;
        }

        console.log('GraphQL Introspection Data successfully fetched!');
      }
    );
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
