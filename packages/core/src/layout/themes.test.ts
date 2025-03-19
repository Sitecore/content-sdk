import { expect } from 'chai';
import { getDesignLibraryStylesheetLinks, getStylesheetUrl } from './themes';
import { SITECORE_EDGE_URL_DEFAULT } from '../constants';
import { ComponentRendering } from '.';

describe('themes', () => {
  const sitecoreEdgeContextId = 'test';

  describe('getDesignLibraryStylesheetLinks', () => {
    const setBasicLayoutData = (component: ComponentRendering) => {
      return {
        sitecore: {
          context: {},
          route: {
            name: 'home',
            placeholders: {
              main: [component],
            },
          },
        },
      };
    };

    it('should return empty array route data is not provided', () => {
      expect(
        getDesignLibraryStylesheetLinks(
          {
            sitecore: {
              context: {},
              route: null,
            },
          },
          sitecoreEdgeContextId
        )
      ).to.deep.equal([]);
    });

    it('should return links using CSSStyles field', () => {
      expect(
        getDesignLibraryStylesheetLinks(
          setBasicLayoutData({
            componentName: 'test',
            fields: {
              CSSStyles: {
                value: '-library--foo',
              },
              LibraryId: {
                value: 'bar',
              },
            },
          }),
          sitecoreEdgeContextId
        )
      ).to.deep.equal([
        { href: getStylesheetUrl('foo', sitecoreEdgeContextId), rel: 'stylesheet' },
      ]);
    });

    it('should return links using Styles field', () => {
      expect(
        getDesignLibraryStylesheetLinks(
          setBasicLayoutData({
            componentName: 'test',
            fields: {
              Styles: {
                value: '-library--foo',
              },
              LibraryId: {
                value: 'bar',
              },
            },
          }),
          sitecoreEdgeContextId
        )
      ).to.deep.equal([
        { href: getStylesheetUrl('foo', sitecoreEdgeContextId), rel: 'stylesheet' },
      ]);
    });

    it('should return links using LibraryId field', () => {
      expect(
        getDesignLibraryStylesheetLinks(
          setBasicLayoutData({
            componentName: 'test',
            fields: {
              LibraryId: {
                value: 'bar',
              },
            },
          }),
          sitecoreEdgeContextId
        )
      ).to.deep.equal([
        { href: getStylesheetUrl('bar', sitecoreEdgeContextId), rel: 'stylesheet' },
      ]);
    });

    it('should return links using CSSStyles param', () => {
      expect(
        getDesignLibraryStylesheetLinks(
          setBasicLayoutData({
            componentName: 'styled',
            params: {
              CSSStyles: '-library--foo',
            },
          }),
          sitecoreEdgeContextId
        )
      ).to.deep.equal([
        { href: getStylesheetUrl('foo', sitecoreEdgeContextId), rel: 'stylesheet' },
      ]);
    });

    it('should return links using Styles param', () => {
      expect(
        getDesignLibraryStylesheetLinks(
          setBasicLayoutData({
            componentName: 'styled',
            params: {
              Styles: '-library--foo',
            },
          }),
          sitecoreEdgeContextId
        )
      ).to.deep.equal([
        { href: getStylesheetUrl('foo', sitecoreEdgeContextId), rel: 'stylesheet' },
      ]);
    });

    it('should return links using LibraryId param', () => {
      expect(
        getDesignLibraryStylesheetLinks(
          setBasicLayoutData({
            componentName: 'styled',
            params: {
              LibraryId: 'bar',
            },
          }),
          sitecoreEdgeContextId
        )
      ).to.deep.equal([
        { href: getStylesheetUrl('bar', sitecoreEdgeContextId), rel: 'stylesheet' },
      ]);
    });

    it('should return prefer params over fields', () => {
      expect(
        getDesignLibraryStylesheetLinks(
          setBasicLayoutData({
            componentName: 'styled',
            params: {
              CSSStyles: '-library--foo',
            },
            fields: {
              CSSStyles: {
                value: '-library--not-foo',
              },
            },
          }),
          sitecoreEdgeContextId
        )
      ).to.deep.equal([
        { href: getStylesheetUrl('foo', sitecoreEdgeContextId), rel: 'stylesheet' },
      ]);

      expect(
        getDesignLibraryStylesheetLinks(
          setBasicLayoutData({
            componentName: 'styled',
            params: {
              LibraryId: 'bar',
            },
            fields: {
              LibraryId: {
                value: 'not-bar',
              },
            },
          }),
          sitecoreEdgeContextId
        )
      ).to.deep.equal([
        { href: getStylesheetUrl('bar', sitecoreEdgeContextId), rel: 'stylesheet' },
      ]);
    });

    it('should return links using non-prod edge url', () => {
      expect(
        getDesignLibraryStylesheetLinks(
          setBasicLayoutData({
            componentName: 'test',
            fields: {
              LibraryId: {
                value: 'bar',
              },
            },
          }),
          sitecoreEdgeContextId,
          'https://edge-platform-dev.sitecorecloud.io'
        )
      ).to.deep.equal([
        {
          href: getStylesheetUrl(
            'bar',
            sitecoreEdgeContextId,
            'https://edge-platform-dev.sitecorecloud.io'
          ),
          rel: 'stylesheet',
        },
      ]);
    });

    it('should return empty links array when required fields are not provided', () => {
      expect(
        getDesignLibraryStylesheetLinks(
          {
            sitecore: {
              context: {},
              route: {
                name: 'home',
                fields: {},
                placeholders: {},
              },
            },
          },
          sitecoreEdgeContextId
        )
      ).to.deep.equal([]);
    });

    it('should return empty links array when required params are not provided', () => {
      expect(
        getDesignLibraryStylesheetLinks(
          setBasicLayoutData({
            componentName: 'styled',
            params: {},
          }),
          sitecoreEdgeContextId
        )
      ).to.deep.equal([]);
    });

    it('should traverse nested nodes and return only unique links', () => {
      expect(
        getDesignLibraryStylesheetLinks(
          {
            sitecore: {
              context: {},
              route: {
                name: 'home',
                fields: {
                  CSSStyles: {
                    value: '-library--foo',
                  },
                  LibraryId: {
                    value: 'bar',
                  },
                },
                placeholders: {
                  x: [
                    {
                      componentName: 'x1-component',
                      fields: {
                        LibraryId: {
                          value: 'foo',
                        },
                      },
                      placeholders: {
                        x1: [
                          {
                            componentName: 'x11-component',
                            fields: {
                              CSSStyles: {
                                value: '-library--x11',
                              },
                            },
                          },
                          {
                            componentName: 'x12-component',
                            fields: {
                              CSSStyles: {
                                value: '-library--x12',
                              },
                              LibraryId: {
                                value: 'x12-id',
                              },
                            },
                          },
                        ],
                        x2: [
                          {
                            componentName: 'x21-component',
                            fields: {
                              LibraryId: {
                                value: 'x21',
                              },
                            },
                          },
                        ],
                      },
                    },
                  ],
                  y: [
                    {
                      componentName: 'y1-component',
                      fields: {
                        LibraryId: {
                          value: 'y1',
                        },
                      },
                    },
                    {
                      componentName: 'y2-component',
                      fields: {
                        CSSStyles: {
                          value: 'custom-style',
                        },
                        LibraryId: {
                          value: 'y2',
                        },
                      },
                    },
                  ],
                  z: [
                    {
                      componentName: 'z1-component',
                      fields: {
                        CSSStyles: {
                          value: '-library--z1',
                        },
                      },
                      placeholders: {
                        z1: [
                          {
                            componentName: 'z11-component',
                            fields: {
                              CSSStyles: {
                                value: '-library--z11',
                              },
                            },
                          },
                        ],
                        z2: [
                          {
                            componentName: 'z21-component',
                            fields: {
                              LibraryId: {
                                value: 'z21',
                              },
                            },
                          },
                        ],
                      },
                    },
                  ],
                  zx: [
                    {
                      componentName: 'zx1-component',
                      fields: {
                        Styles: {
                          value: 'foo',
                        },
                      },
                      placeholders: {
                        zx1: [
                          {
                            componentName: 'zx11-component',
                            fields: {
                              LibraryId: {
                                value: 'zx11',
                              },
                            },
                          },
                        ],
                        zx2: [
                          {
                            componentName: 'zx21-component',
                            params: {
                              Styles: '-library--zx21',
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            },
          },
          sitecoreEdgeContextId
        )
      ).to.deep.equal(
        ['foo', 'x11', 'x12', 'x21', 'y1', 'y2', 'z1', 'z11', 'z21', 'zx11', 'zx21'].map((id) => ({
          href: getStylesheetUrl(id, sitecoreEdgeContextId),
          rel: 'stylesheet',
        }))
      );
    });
  });

  describe('getStylesheetUrl', () => {
    it('should use prod edge url by default', () => {
      expect(getStylesheetUrl('foo', sitecoreEdgeContextId)).to.equal(
        `${SITECORE_EDGE_URL_DEFAULT}/v1/files/components/styles/foo.css?sitecoreContextId=${sitecoreEdgeContextId}`
      );
    });

    it('should use non-prod edge url', () => {
      const nonProdUrl = 'https://edge-platform-pre-production.sitecorecloud.io';
      expect(getStylesheetUrl('foo', sitecoreEdgeContextId, nonProdUrl)).to.equal(
        `${nonProdUrl}/v1/files/components/styles/foo.css?sitecoreContextId=${sitecoreEdgeContextId}`
      );
    });
  });
});
