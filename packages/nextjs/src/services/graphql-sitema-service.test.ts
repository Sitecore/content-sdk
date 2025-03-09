import { expect } from 'chai';
import nock from 'nock';
import { GraphQLSitemapService, GraphQLSitemapServiceConfig } from './graphql-sitemap-service';
import { getSiteEmptyError, languageError } from './graphql-sitemap-service';
import sitemapDefaultQueryResult from '../test-data/sitemapDefaultQueryResult.json';
import sitemapPersonalizeQueryResult from '../test-data/sitemapPersonalizeQueryResult.json';
import sitemapServiceMultisiteResult from '../test-data/sitemapServiceMultisiteResult';
import { GraphQLClient, GraphQLRequestClient } from '@sitecore-content-sdk/core/client';

class TestService extends GraphQLSitemapService {
  public client: GraphQLClient;
  constructor(options: GraphQLSitemapServiceConfig) {
    super(options);
    this.client = this.getGraphQLClient();
  }
}

describe('GraphQLSitemapService', () => {
  const endpoint = 'http://site';
  const apiKey = 'some-api-key';
  const defaultSiteDeets = { hostName: 'tes.com', language: 'en' };
  const sites = [{ name: 'site-name', ...defaultSiteDeets }];
  const clientFactory = GraphQLRequestClient.createClientFactory({
    endpoint,
    apiKey,
  });

  afterEach(() => {
    nock.cleanAll();
  });

  const mockPathsRequest = (results?: { url: { path: string } }[]) => {
    nock(endpoint)
      .post('/', /DefaultSitemapQuery/gi)
      .reply(
        200,
        results === undefined
          ? sitemapDefaultQueryResult
          : {
              data: {
                site: {
                  siteInfo: {
                    routes: {
                      total: results.length,
                      pageInfo: {
                        hasNext: false,
                      },
                      results,
                    },
                  },
                },
              },
            }
      );
  };

  describe('Fetch sitemap in SSG mode', () => {
    it('should work when 1 language is requested', async () => {
      mockPathsRequest();

      const service = new GraphQLSitemapService({ clientFactory, sites });
      const sitemap = await service.fetchSitemap(['ua']);
      expect(sitemap).to.deep.equal(sitemapServiceMultisiteResult);

      return expect(nock.isDone()).to.be.true;
    });

    it('should work when includePaths and excludePaths are provided', async () => {
      const includedPaths = ['/y1/'];
      const excludedPaths = ['/y1/y2/y3/y4'];

      nock(endpoint)
        .post('/', (body) => {
          return body.variables.includedPaths && body.variables.excludedPaths;
        })
        .reply(200, {
          data: {
            site: {
              siteInfo: {
                routes: {
                  total: 1,
                  pageInfo: {
                    hasNext: false,
                  },
                  results: [
                    {
                      path: '/y1/y2/',
                    },
                  ],
                },
              },
            },
          },
        });

      nock(endpoint)
        .post('/')
        .reply(200, {
          data: {
            site: {
              siteInfo: {
                routes: {
                  total: 4,
                  pageInfo: {
                    hasNext: false,
                  },
                  results: [
                    {
                      path: '/',
                    },
                    {
                      path: '/x1',
                    },
                    {
                      path: '/y1/y2/y3/y4',
                    },
                    {
                      path: '/y1/y2',
                    },
                  ],
                },
              },
            },
          },
        });

      const service = new GraphQLSitemapService({
        clientFactory,
        sites,
        includedPaths,
        excludedPaths,
      });
      const sitemap = await service.fetchSitemap(['en']);

      return expect(sitemap).to.deep.equal([
        {
          params: {
            path: ['_site_site-name', 'y1', 'y2'],
          },
          locale: 'en',
        },
      ]);
    });

    describe('Fetch sitemap in SSG mode', () => {
      it('should work when 1 language is requested', async () => {
        mockPathsRequest();

        const service = new GraphQLSitemapService({ clientFactory, sites });
        const sitemap = await service.fetchSitemap(['ua']);
        expect(sitemap).to.deep.equal(sitemapServiceMultisiteResult);

        return expect(nock.isDone()).to.be.true;
      });

      it('should work when includePaths and excludePaths are provided', async () => {
        const includedPaths = ['/y1/'];
        const excludedPaths = ['/y1/y2/y3/y4'];

        nock(endpoint)
          .post('/', (body) => {
            return body.variables.includedPaths && body.variables.excludedPaths;
          })
          .reply(200, {
            data: {
              site: {
                siteInfo: {
                  routes: {
                    total: 1,
                    pageInfo: {
                      hasNext: false,
                    },
                    results: [
                      {
                        path: '/y1/y2/',
                      },
                    ],
                  },
                },
              },
            },
          });

        nock(endpoint)
          .post('/')
          .reply(200, {
            data: {
              site: {
                siteInfo: {
                  routes: {
                    total: 4,
                    pageInfo: {
                      hasNext: false,
                    },
                    results: [
                      {
                        path: '/',
                      },
                      {
                        path: '/x1',
                      },
                      {
                        path: '/y1/y2/y3/y4',
                      },
                      {
                        path: '/y1/y2',
                      },
                    ],
                  },
                },
              },
            },
          });

        const service = new GraphQLSitemapService({
          clientFactory,
          sites,
          includedPaths,
          excludedPaths,
        });
        const sitemap = await service.fetchSitemap(['en']);

        return expect(sitemap).to.deep.equal([
          {
            params: {
              path: ['_site_site-name', 'y1', 'y2'],
            },
            locale: 'en',
          },
        ]);
      });

      it('should return aggregated paths for multiple sites with no personalization', async () => {
        const multipleSites = [
          { name: 'site1', ...defaultSiteDeets },
          { name: 'site2', ...defaultSiteDeets },
        ];
        const lang = 'ua';

        nock(endpoint)
          .persist()
          .post('/', (body) => {
            return body.variables.siteName === multipleSites[0].name;
          })
          .reply(200, {
            data: {
              site: {
                siteInfo: {
                  routes: {
                    total: 4,
                    pageInfo: {
                      hasNext: false,
                    },
                    results: [
                      {
                        path: '/',
                      },
                      {
                        path: '/x1',
                      },
                      {
                        path: '/y1/y2/y3/y4',
                      },
                      {
                        path: '/y1/y2',
                      },
                    ],
                  },
                },
              },
            },
          });

        nock(endpoint)
          .persist()
          .post('/', (body) => {
            return body.variables.siteName === multipleSites[1].name;
          })
          .reply(200, {
            data: {
              site: {
                siteInfo: {
                  routes: {
                    total: 2,
                    pageInfo: {
                      hasNext: false,
                    },
                    results: [
                      {
                        path: '/y1',
                      },
                      {
                        path: '/x1/x2',
                      },
                    ],
                  },
                },
              },
            },
          });

        const service = new GraphQLSitemapService({
          clientFactory,
          sites: multipleSites,
        });
        const sitemap = await service.fetchSitemap([lang]);

        expect(sitemap).to.deep.equal([
          {
            params: {
              path: ['_site_site1'],
            },
            locale: lang,
          },
          {
            params: {
              path: ['_site_site1', 'x1'],
            },
            locale: lang,
          },
          {
            params: {
              path: ['_site_site1', 'y1', 'y2', 'y3', 'y4'],
            },
            locale: lang,
          },
          {
            params: {
              path: ['_site_site1', 'y1', 'y2'],
            },
            locale: lang,
          },
          {
            params: {
              path: ['_site_site2', 'y1'],
            },
            locale: lang,
          },
          {
            params: {
              path: ['_site_site2', 'x1', 'x2'],
            },
            locale: lang,
          },
        ]);
        return expect(nock.isDone()).to.be.true;
      });

      it('should return aggregated paths for multiple sites and personalized sites', async () => {
        const multipleSites = [
          { name: 'site1', ...defaultSiteDeets },
          { name: 'site2', ...defaultSiteDeets },
        ];
        const lang = 'ua';

        nock(endpoint)
          .post('/', /PersonalizeSitemapQuery/gi)
          .reply(200, sitemapPersonalizeQueryResult);

        nock(endpoint)
          .persist()
          .post('/', (body) => {
            return body.variables.siteName === multipleSites[1].name;
          })
          .reply(200, {
            data: {
              site: {
                siteInfo: {
                  routes: {
                    total: 4,
                    pageInfo: {
                      hasNext: false,
                    },
                    results: [
                      {
                        path: '/',
                      },
                      {
                        path: '/x1',
                      },
                      {
                        path: '/y1/y2/y3/y4',
                      },
                      {
                        path: '/y1/y2',
                      },
                    ],
                  },
                },
              },
            },
          });

        const service = new GraphQLSitemapService({
          clientFactory,
          sites: multipleSites,
          includePersonalizedRoutes: true,
        });
        const sitemap = await service.fetchSitemap([lang]);

        expect(sitemap).to.deep.equal([
          {
            params: {
              path: ['_site_site1'],
            },
            locale: lang,
          },
          {
            params: {
              path: ['_variantId_green', '_site_site1'],
            },
            locale: lang,
          },
          {
            params: {
              path: ['_site_site1', 'y1', 'y2', 'y3', 'y4'],
            },
            locale: lang,
          },
          {
            params: {
              path: ['_variantId_green', '_site_site1', 'y1', 'y2', 'y3', 'y4'],
            },
            locale: lang,
          },
          {
            params: {
              path: ['_variantId_red', '_site_site1', 'y1', 'y2', 'y3', 'y4'],
            },
            locale: lang,
          },
          {
            params: {
              path: ['_variantId_purple', '_site_site1', 'y1', 'y2', 'y3', 'y4'],
            },
            locale: lang,
          },
          {
            params: {
              path: ['_site_site2'],
            },
            locale: lang,
          },
          {
            params: {
              path: ['_site_site2', 'x1'],
            },
            locale: lang,
          },
          {
            params: {
              path: ['_site_site2', 'y1', 'y2', 'y3', 'y4'],
            },
            locale: lang,
          },
          {
            params: {
              path: ['_site_site2', 'y1', 'y2'],
            },
            locale: lang,
          },
        ]);
        return expect(nock.isDone()).to.be.true;
      });

      it('should work when multiple languages are requested', async () => {
        const lang1 = 'ua';
        const lang2 = 'da-DK';

        nock(endpoint)
          .post('/', (body) => {
            return body.variables.language === lang1;
          })
          .reply(200, {
            data: {
              site: {
                siteInfo: {
                  routes: {
                    total: 4,
                    pageInfo: {
                      hasNext: false,
                    },
                    results: [
                      {
                        path: '/',
                      },
                      {
                        path: '/x1',
                      },
                      {
                        path: '/y1/y2/y3/y4',
                      },
                      {
                        path: '/y1/y2',
                      },
                    ],
                  },
                },
              },
            },
          });

        nock(endpoint)
          .post('/', (body) => {
            return body.variables.language === lang2;
          })
          .reply(200, {
            data: {
              site: {
                siteInfo: {
                  routes: {
                    total: 4,
                    pageInfo: {
                      hasNext: false,
                    },
                    results: [
                      {
                        path: '/',
                      },
                      {
                        path: '/x1-da-DK',
                      },
                      {
                        path: '/y1/y2/y3/y4-da-DK',
                      },
                      {
                        path: '/y1/y2-da-DK',
                      },
                    ],
                  },
                },
              },
            },
          });

        const service = new GraphQLSitemapService({ clientFactory, sites });
        const sitemap = await service.fetchSitemap([lang1, lang2]);

        expect(sitemap).to.deep.equal([
          {
            params: {
              path: ['_site_site-name'],
            },
            locale: 'ua',
          },
          {
            params: {
              path: ['_site_site-name', 'x1'],
            },
            locale: 'ua',
          },
          {
            params: {
              path: ['_site_site-name', 'y1', 'y2', 'y3', 'y4'],
            },
            locale: 'ua',
          },
          {
            params: {
              path: ['_site_site-name', 'y1', 'y2'],
            },
            locale: 'ua',
          },
          {
            params: {
              path: ['_site_site-name'],
            },
            locale: 'da-DK',
          },
          {
            params: {
              path: ['_site_site-name', 'x1-da-DK'],
            },
            locale: 'da-DK',
          },
          {
            params: {
              path: ['_site_site-name', 'y1', 'y2', 'y3', 'y4-da-DK'],
            },
            locale: 'da-DK',
          },
          {
            params: {
              path: ['_site_site-name', 'y1', 'y2-da-DK'],
            },
            locale: 'da-DK',
          },
        ]);

        return expect(nock.isDone()).to.be.true;
      });

      it('should work when null results are present', async () => {
        const lang = 'en';

        nock(endpoint)
          .post('/', (body) => {
            return body.variables.language === lang;
          })
          .reply(200, {
            data: {
              site: {
                siteInfo: {
                  routes: {
                    total: 4,
                    pageInfo: {
                      hasNext: false,
                    },
                    results: [
                      {
                        path: '/',
                      },
                      {
                        path: '/x1',
                      },
                      null,
                      null,
                    ],
                  },
                },
              },
            },
          });

        const service = new GraphQLSitemapService({ clientFactory, sites });
        const sitemap = await service.fetchSitemap([lang]);

        expect(sitemap).to.deep.equal([
          {
            params: {
              path: ['_site_site-name'],
            },
            locale: 'en',
          },
          {
            params: {
              path: ['_site_site-name', 'x1'],
            },
            locale: 'en',
          },
        ]);

        return expect(nock.isDone()).to.be.true;
      });

      it('should throw error if valid language is not provided', async () => {
        const service = new GraphQLSitemapService({ clientFactory, sites });
        await service.fetchSitemap([]).catch((error: RangeError) => {
          expect(error.message).to.equal(languageError);
        });
      });

      it('should throw error if query returns nothing for a provided site name', async () => {
        const service = new GraphQLSitemapService({ clientFactory, sites });
        nock(endpoint)
          .post('/', (body) => {
            return body.variables.siteName === sites[0].name;
          })
          .reply(200, {
            data: {
              site: {
                siteInfo: null,
              },
            },
          });
        await service.fetchSitemap(['en']).catch((error: RangeError) => {
          expect(error.message).to.equal(getSiteEmptyError(sites[0].name));
        });
      });

      it('should use a custom pageSize, if provided', async () => {
        const customPageSize = 20;

        nock(endpoint)
          .post('/', (body) => body.variables.pageSize === customPageSize)
          .reply(200, sitemapDefaultQueryResult);

        const service = new GraphQLSitemapService({
          clientFactory,
          sites,
          pageSize: customPageSize,
        });
        const sitemap = await service.fetchSitemap(['ua']);

        expect(sitemap).to.deep.equal(sitemapServiceMultisiteResult);
        return expect(nock.isDone()).to.be.true;
      });

      it('should use default value if pageSize is not specified', async () => {
        nock(endpoint)
          .post(
            '/',
            (body) =>
              body.query.indexOf('$pageSize: Int = 10') > 0 && body.variables.pageSize === undefined
          )
          .reply(200, sitemapDefaultQueryResult);

        const service = new GraphQLSitemapService({
          clientFactory,
          sites,
          pageSize: undefined,
        });
        const sitemap = await service.fetchSitemap(['ua']);

        expect(sitemap).to.deep.equal(sitemapServiceMultisiteResult);
        return expect(nock.isDone()).to.be.true;
      });

      it('should work if sitemap has 0 pages', async () => {
        mockPathsRequest([]);

        const service = new GraphQLSitemapService({ clientFactory, sites });
        const sitemap = await service.fetchSitemap(['ua']);
        expect(sitemap).to.deep.equal([]);
        return expect(nock.isDone()).to.be.true;
      });

      it('should throw error if SitemapQuery fails', async () => {
        nock(endpoint)
          .post('/', /DefaultSitemapQuery/gi)
          .reply(500, 'Error 😥');

        const service = new GraphQLSitemapService({ clientFactory, sites });
        await service.fetchSitemap(['ua']).catch((error: RangeError) => {
          expect(error.message).to.contain('SitemapQuery');
          expect(error.message).to.contain('Error 😥');
        });
        return expect(nock.isDone()).to.be.true;
      });
    });
  });

  it('should provide a default GraphQL client', () => {
    const service = new TestService({
      clientFactory: clientFactory,
      sites,
    });
    const graphQLClient = service.client as GraphQLClient;
    const graphQLRequestClient = service.client as GraphQLRequestClient;
    // eslint-disable-next-line no-unused-expressions
    expect(graphQLClient).to.exist;
    // eslint-disable-next-line no-unused-expressions
    expect(graphQLRequestClient).to.exist;
  });
});
