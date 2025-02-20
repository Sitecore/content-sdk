export default {
  api: {
    edge: {
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
