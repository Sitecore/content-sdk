export default {
  api: {
    edge: {
      contextId: 'custom-id',
      edgeUrl: 'customUrl',
    },
  },
  defaultSite: 'site-override',
  retries: {
    count: 5,
    retryStrategy: () => {
      return 1000;
    },
  },
  redirects: {
    enabled: false,
  },
  personalize: {
    enabled: false,
    scope: 'jss',
  },
};
