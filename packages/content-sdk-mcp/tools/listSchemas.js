export default async function listSchemasTool() {
  return {
    edge: {
      contextId: process.env.SITECORE_EDGE_CONTEXT_ID || null,
      clientContextId: process.env.SITECORE_EDGE_CLIENT_CONTEXT_ID || null,
      edgeUrl: process.env.SITECORE_EDGE_URL || null,
    },
    local: {
      apiHost: process.env.SITECORE_API_HOST || null,
      apiKey: process.env.SITECORE_API_KEY ? '***' : null,
      path: process.env.SITECORE_GRAPHQL_PATH || '/sitecore/api/graph/edge',
    },
  };
}
