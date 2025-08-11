import { expect } from 'chai';
import nock from 'nock';
import {
  SitePathService,
  SitePathServiceConfig,
  getSiteEmptyError,
  languageError,
} from './sitepath-service';
import sitemapDefaultQueryResult from '../test-data/sitemapDefaultQueryResult.json';
import sitemapPersonalizeQueryResult from '../test-data/sitemapPersonalizeQueryResult.json';
import sitemapServiceMultisiteResult from '../test-data/sitemapServiceMultisiteResult';
import { GraphQLClient, GraphQLRequestClient } from '../client';

class TestService extends SitePathService {
  public client: GraphQLClient;
  constructor(options: SitePathServiceConfig) {
    super(options);
    this.client = this.getGraphQLClient();
  }
}

describe('SitePathService', () => {
  const endpoint = 'http://site';
  const apiKey = 'some-api-key';
  const sites = ['site-name'];
  const clientFactory = GraphQLRequestClient.createClientFactory({
    endpoint,
    apiKey,
  });

  afterEach(() => {
    nock.cleanAll();
  });

  const mockPathsRequest = (
    results?: { path: string; route?: { displayName?: string | null } }[]
  ) => {
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
                      results: results.map((item) => ({
                        path: item.path,
                        route: item.route || { displayName: null },
                      })),
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

      const service = new SitePathService({ clientFactory });
      const sitemap = await service.fetchSiteRoutes(sites, ['ua']);
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

      const service = new SitePathService({
        clientFactory,
        includedPaths,
        excludedPaths,
      });
      const sitemap = await service.fetchSiteRoutes(sites, ['en']);

      return expect(sitemap).to.deep.equal([
        {
          params: {
            path: ['_site_site-name', 'y1', 'y2'],
          },
          locale: 'en',
        },
      ]);
    });

    it('should return both itemName and encoded displayName paths for routes with displayName (no personalization)', async () => {
      const multipleSites = ['site1', 'site2'];
      const lang = 'en';

      nock(endpoint)
        .persist()
        .post('/', (body) => body.variables.siteName === multipleSites[0])
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
                      path: '/About',
                      route: { displayName: 'New-about' },
                    },
                    {
                      path: '/',
                      route: { displayName: 'Home' },
                    },
                  ],
                },
              },
            },
          },
        });

      nock(endpoint)
        .persist()
        .post('/', (body) => body.variables.siteName === multipleSites[1])
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
                      path: 'Test',
                      route: { displayName: 'New-Test' },
                    },
                    {
                      path: '/',
                      route: { displayName: 'Home' },
                    },
                  ],
                },
              },
            },
          },
        });

      const service = new SitePathService({
        clientFactory,
        enableDisplayNameRouting: true,
      });

      const sitemap = await service.fetchSiteRoutes(multipleSites, [lang]);

      expect(sitemap).to.have.deep.members([
        {
          params: { path: ['_site_site1', 'About'] },
          locale: 'en',
        },
        {
          params: { path: ['_site_site1', 'New-about'] },
          locale: 'en',
        },
        {
          params: { path: ['Home', 'About'] },
          locale: 'en',
        },
        {
          params: { path: ['Home', 'New-about'] },
          locale: 'en',
        },
        {
          params: { path: ['_site_site1'] },
          locale: 'en',
        },
        {
          params: { path: ['Home'] },
          locale: 'en',
        },
        {
          params: { path: ['_site_site2', 'Test'] },
          locale: 'en',
        },
        {
          params: { path: ['_site_site2', 'New-Test'] },
          locale: 'en',
        },
        {
          params: { path: ['Home', 'Test'] },
          locale: 'en',
        },
        {
          params: { path: ['Home', 'New-Test'] },
          locale: 'en',
        },
        {
          params: { path: ['_site_site2'] },
          locale: 'en',
        },
        {
          params: { path: ['Home'] },
          locale: 'en',
        },
      ]);

      return expect(nock.isDone()).to.be.true;
    });

    it('should return encoded displayName paths when special characters are used', async () => {
      const lang = 'en';

      // Å → %C3%85, ü → %C3%BC, ç → %C3%A7
      const results = [
        {
          path: '/about',
          route: { displayName: 'Åbout' },
        },
        {
          path: '/team',
          route: { displayName: 'Tëâm' },
        },
        {
          path: '/',
          route: { displayName: 'Hôme' },
        },
      ];

      mockPathsRequest(results);

      const service = new SitePathService({
        clientFactory,
        enableDisplayNameRouting: true,
      });

      const sitemap = await service.fetchSiteRoutes(sites, [lang]);

      expect(sitemap).to.have.deep.members([
        {
          params: { path: ['_site_site-name', 'about'] },
          locale: 'en',
        },
        {
          params: { path: ['_site_site-name', '%C3%85bout'] },
          locale: 'en',
        },
        {
          params: { path: ['H%C3%B4me', 'about'] },
          locale: 'en',
        },
        {
          params: { path: ['H%C3%B4me', '%C3%85bout'] },
          locale: 'en',
        },
        {
          params: { path: ['_site_site-name', 'team'] },
          locale: 'en',
        },
        {
          params: { path: ['_site_site-name', 'T%C3%AB%C3%A2m'] },
          locale: 'en',
        },
        {
          params: { path: ['H%C3%B4me', 'team'] },
          locale: 'en',
        },
        {
          params: { path: ['H%C3%B4me', 'T%C3%AB%C3%A2m'] },
          locale: 'en',
        },
        {
          params: { path: ['_site_site-name'] },
          locale: 'en',
        },
        {
          params: { path: ['H%C3%B4me'] },
          locale: 'en',
        },
      ]);

      return expect(nock.isDone()).to.be.true;
    });

    it('should return aggregated paths for multiple sites with no personalization', async () => {
      const multipleSites = ['site1', 'site2'];
      const lang = 'ua';

      nock(endpoint)
        .persist()
        .post('/', (body) => {
          return body.variables.siteName === multipleSites[0];
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
          return body.variables.siteName === multipleSites[1];
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

      const service = new SitePathService({
        clientFactory,
      });
      const sitemap = await service.fetchSiteRoutes(multipleSites, [lang]);

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
      const multipleSites = ['site1', 'site2'];
      const lang = 'ua';

      nock(endpoint)
        .post('/', /PersonalizeSitemapQuery/gi)
        .reply(200, sitemapPersonalizeQueryResult);

      nock(endpoint)
        .persist()
        .post('/', (body) => {
          return body.variables.siteName === multipleSites[1];
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

      const service = new SitePathService({
        clientFactory,
        includePersonalizedRoutes: true,
      });
      const sitemap = await service.fetchSiteRoutes(multipleSites, [lang]);

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

    it('should return aggregated display name and item name paths for multiple sites and personalized sites', async () => {
      const multipleSites = ['site1', 'site2'];
      const lang = 'en';

      nock(endpoint)
        .post('/', (body) => {
          return body.variables.siteName === multipleSites[0];
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
                      path: '/x1',
                      route: {
                        displayName: 'X-One',
                        personalization: {
                          variantIds: ['green'],
                        },
                      },
                    },
                    {
                      path: '/y1/y2',
                      route: {
                        displayName: 'Y-Two',
                        personalization: {
                          variantIds: ['red', 'blue'],
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        });

      nock(endpoint)
        .post('/', (body) => {
          return body.variables.siteName === multipleSites[1];
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
                      route: {
                        displayName: 'Y-One',
                        personalization: {
                          variantIds: ['green'],
                        },
                      },
                    },
                    {
                      path: '/y1/y2',
                      route: {
                        displayName: 'Y-Two',
                        personalization: {
                          variantIds: ['red', 'blue'],
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        });

      const service = new SitePathService({
        clientFactory,
        includePersonalizedRoutes: true,
        enableDisplayNameRouting: true,
      });

      const sitemap = await service.fetchSiteRoutes(multipleSites, [lang]);

      expect(sitemap).to.have.deep.members([
        // Site1 paths
        {
          params: { path: ['_site_site1', 'x1'] },
          locale: 'en',
        },
        {
          params: { path: ['_site_site1', 'X-One'] },
          locale: 'en',
        },
        {
          params: { path: ['_variantId_green', '_site_site1', 'x1'] },
          locale: 'en',
        },
        {
          params: { path: ['_variantId_green', '_site_site1', 'X-One'] },
          locale: 'en',
        },
        {
          params: { path: ['_site_site1', 'y1', 'y2'] },
          locale: 'en',
        },
        {
          params: { path: ['_site_site1', 'y1', 'Y-Two'] },
          locale: 'en',
        },
        {
          params: { path: ['_variantId_red', '_site_site1', 'y1', 'y2'] },
          locale: 'en',
        },
        {
          params: { path: ['_variantId_red', '_site_site1', 'y1', 'Y-Two'] },
          locale: 'en',
        },
        {
          params: { path: ['_variantId_blue', '_site_site1', 'y1', 'y2'] },
          locale: 'en',
        },
        {
          params: { path: ['_variantId_blue', '_site_site1', 'y1', 'Y-Two'] },
          locale: 'en',
        },

        // Site2 paths
        {
          params: { path: ['_site_site2', 'y1'] },
          locale: 'en',
        },
        {
          params: { path: ['_site_site2', 'Y-One'] },
          locale: 'en',
        },
        {
          params: { path: ['_variantId_green', '_site_site2', 'y1'] },
          locale: 'en',
        },
        {
          params: { path: ['_variantId_green', '_site_site2', 'Y-One'] },
          locale: 'en',
        },
        {
          params: { path: ['_site_site2', 'y1', 'y2'] },
          locale: 'en',
        },
        {
          params: { path: ['_site_site2', 'y1', 'Y-Two'] },
          locale: 'en',
        },
        {
          params: { path: ['_site_site2', 'Y-One', 'y2'] },
          locale: 'en',
        },
        {
          params: { path: ['_site_site2', 'Y-One', 'Y-Two'] },
          locale: 'en',
        },
        {
          params: { path: ['_variantId_red', '_site_site2', 'y1', 'y2'] },
          locale: 'en',
        },
        {
          params: { path: ['_variantId_red', '_site_site2', 'y1', 'Y-Two'] },
          locale: 'en',
        },
        {
          params: { path: ['_variantId_red', '_site_site2', 'Y-One', 'y2'] },
          locale: 'en',
        },
        {
          params: { path: ['_variantId_red', '_site_site2', 'Y-One', 'Y-Two'] },
          locale: 'en',
        },
        {
          params: { path: ['_variantId_blue', '_site_site2', 'y1', 'y2'] },
          locale: 'en',
        },
        {
          params: { path: ['_variantId_blue', '_site_site2', 'y1', 'Y-Two'] },
          locale: 'en',
        },
        {
          params: { path: ['_variantId_blue', '_site_site2', 'Y-One', 'y2'] },
          locale: 'en',
        },
        {
          params: { path: ['_variantId_blue', '_site_site2', 'Y-One', 'Y-Two'] },
          locale: 'en',
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

      const service = new SitePathService({ clientFactory });
      const sitemap = await service.fetchSiteRoutes(sites, [lang1, lang2]);

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

      const service = new SitePathService({ clientFactory });
      const sitemap = await service.fetchSiteRoutes(sites, [lang]);

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
      const service = new SitePathService({ clientFactory });
      await service.fetchSiteRoutes(sites, []).catch((error: RangeError) => {
        expect(error.message).to.equal(languageError);
      });
    });

    it('should throw error if query returns nothing for a provided site name', async () => {
      const service = new SitePathService({ clientFactory });
      nock(endpoint)
        .post('/', (body) => {
          return body.variables.siteName === sites[0];
        })
        .reply(200, {
          data: {
            site: {
              siteInfo: null,
            },
          },
        });
      await service.fetchSiteRoutes(sites, ['en']).catch((error: RangeError) => {
        expect(error.message).to.equal(getSiteEmptyError(sites[0]));
      });
    });

    it('should use a custom pageSize, if provided', async () => {
      const customPageSize = 20;

      nock(endpoint)
        .post('/', (body) => body.variables.pageSize === customPageSize)
        .reply(200, sitemapDefaultQueryResult);

      const service = new SitePathService({
        clientFactory,
        pageSize: customPageSize,
      });
      const sitemap = await service.fetchSiteRoutes(sites, ['ua']);

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

      const service = new SitePathService({
        clientFactory,
        pageSize: undefined,
      });
      const sitemap = await service.fetchSiteRoutes(sites, ['ua']);

      expect(sitemap).to.deep.equal(sitemapServiceMultisiteResult);
      return expect(nock.isDone()).to.be.true;
    });

    it('should work if sitemap has 0 pages', async () => {
      mockPathsRequest([]);

      const service = new SitePathService({ clientFactory });
      const sitemap = await service.fetchSiteRoutes(sites, ['ua']);
      expect(sitemap).to.deep.equal([]);
      return expect(nock.isDone()).to.be.true;
    });

    it('should throw error if SitemapQuery fails', async () => {
      nock(endpoint)
        .post('/', /DefaultSitemapQuery/gi)
        .reply(500, 'Error 😥');

      const service = new SitePathService({ clientFactory });
      await service.fetchSiteRoutes(sites, ['ua']).catch((error: RangeError) => {
        expect(error.message).to.contain('SitemapQuery');
        expect(error.message).to.contain('Error 😥');
      });
      return expect(nock.isDone()).to.be.true;
    });
  });

  it('should provide a default GraphQL client', () => {
    const service = new TestService({
      clientFactory: clientFactory,
    });
    const graphQLClient = service.client as GraphQLClient;
    const graphQLRequestClient = service.client as GraphQLRequestClient;
    // eslint-disable-next-line no-unused-expressions
    expect(graphQLClient).to.exist;
    // eslint-disable-next-line no-unused-expressions
    expect(graphQLRequestClient).to.exist;
  });
});
