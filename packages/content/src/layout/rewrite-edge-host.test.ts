/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { constants } from '@sitecore-content-sdk/core';
import { rewriteEdgeHostInResponse, containsDefaultEdgeHost } from './rewrite-edge-host';

const DEFAULT_EDGE_URL = constants.SITECORE_EXPERIENCE_EDGE_URL_DEFAULT;
const CUSTOM_EDGE_URL = 'https://custom.example.com';

describe('rewriteEdgeHostInResponse', () => {
  describe('rewriteEdgeHostInResponse()', () => {
    it('should return response unchanged when default edge URL is passed', () => {
      const response = {
        url: 'https://edge-platform.sitecorecloud.io/media/image.jpg',
      };
      const result = rewriteEdgeHostInResponse(response, DEFAULT_EDGE_URL);
      expect(result).to.deep.equal(response);
    });

    it('should rewrite when edgeUrl is provided from config (custom hostname)', () => {
      const response = {
        url: 'https://edge.sitecorecloud.io/media/image.jpg',
      };
      const result = rewriteEdgeHostInResponse(response, 'https://custom.edge.example.com');
      expect(result.url).to.equal('https://custom.edge.example.com/media/image.jpg');
    });

    it('should not rewrite edge-platform.sitecorecloud.io (only default hostname is rewritten)', () => {
      const response = {
        url: 'https://edge-platform.sitecorecloud.io/media/image.jpg',
      };
      const result = rewriteEdgeHostInResponse(response, CUSTOM_EDGE_URL);
      expect(result.url).to.equal('https://edge-platform.sitecorecloud.io/media/image.jpg');
    });

    it('should rewrite edge.sitecorecloud.io in string values', () => {
      const response = {
        url: 'https://edge.sitecorecloud.io/media/image.jpg',
      };
      const result = rewriteEdgeHostInResponse(response, CUSTOM_EDGE_URL);
      expect(result.url).to.equal('https://custom.example.com/media/image.jpg');
    });

    it('should not rewrite edge-staging.sitecore-staging.cloud (only default hostname is rewritten)', () => {
      const response = {
        url: 'https://edge-staging.sitecore-staging.cloud/tenant-id/media/image.jpg',
      };
      const result = rewriteEdgeHostInResponse(response, CUSTOM_EDGE_URL);
      expect(result.url).to.equal(
        'https://edge-staging.sitecore-staging.cloud/tenant-id/media/image.jpg'
      );
    });

    it('should not rewrite edge-platform-staging.sitecore-staging.cloud (only default hostname is rewritten)', () => {
      const response = {
        url: 'https://edge-platform-staging.sitecore-staging.cloud/tenant-id/media/image.jpg',
      };
      const result = rewriteEdgeHostInResponse(response, CUSTOM_EDGE_URL);
      expect(result.url).to.equal(
        'https://edge-platform-staging.sitecore-staging.cloud/tenant-id/media/image.jpg'
      );
    });

    it('should rewrite multiple occurrences in a string', () => {
      const response = {
        html: '<img src="https://edge.sitecorecloud.io/a.jpg"><img src="https://edge.sitecorecloud.io/b.jpg">',
      };
      const result = rewriteEdgeHostInResponse(response, CUSTOM_EDGE_URL);
      expect(result.html).to.equal(
        '<img src="https://custom.example.com/a.jpg"><img src="https://custom.example.com/b.jpg">'
      );
    });

    it('should rewrite nested objects', () => {
      const response = {
        sitecore: {
          context: {},
          route: {
            fields: {
              image: {
                value: {
                  src: 'https://edge.sitecorecloud.io/media/image.jpg',
                },
              },
            },
          },
        },
      };
      const result = rewriteEdgeHostInResponse(response, CUSTOM_EDGE_URL);
      expect(result.sitecore.route.fields.image.value.src).to.equal(
        'https://custom.example.com/media/image.jpg'
      );
    });

    it('should rewrite arrays', () => {
      const response = {
        urls: [
          'https://edge.sitecorecloud.io/a.jpg',
          'https://edge.sitecorecloud.io/b.jpg',
        ],
      };
      const result = rewriteEdgeHostInResponse(response, CUSTOM_EDGE_URL);
      expect(result.urls).to.deep.equal([
        'https://custom.example.com/a.jpg',
        'https://custom.example.com/b.jpg',
      ]);
    });

    it('should handle null values', () => {
      const response = {
        value: null,
      };
      const result = rewriteEdgeHostInResponse(response, CUSTOM_EDGE_URL);
      expect(result.value).to.be.null;
    });

    it('should handle undefined values', () => {
      const response = {
        value: undefined,
      };
      const result = rewriteEdgeHostInResponse(response, CUSTOM_EDGE_URL);
      expect(result.value).to.be.undefined;
    });

    it('should preserve non-string primitives', () => {
      const response = {
        number: 42,
        boolean: true,
        string: 'no edge url here',
      };
      const result = rewriteEdgeHostInResponse(response, CUSTOM_EDGE_URL);
      expect(result.number).to.equal(42);
      expect(result.boolean).to.be.true;
      expect(result.string).to.equal('no edge url here');
    });

    it('should handle http protocol in edge URLs', () => {
      const response = {
        url: 'http://edge.sitecorecloud.io/media/image.jpg',
      };
      const result = rewriteEdgeHostInResponse(response, CUSTOM_EDGE_URL);
      expect(result.url).to.equal('https://custom.example.com/media/image.jpg');
    });

    it('should handle mixed case (case insensitive)', () => {
      const response = {
        url: 'https://EDGE.SITECORECLOUD.IO/media/image.jpg',
      };
      const result = rewriteEdgeHostInResponse(response, CUSTOM_EDGE_URL);
      expect(result.url).to.equal('https://custom.example.com/media/image.jpg');
    });

    it('should handle complex layout service data structure', () => {
      const layoutData = {
        sitecore: {
          context: {
            pageEditing: false,
            language: 'en',
          },
          route: {
            name: 'Home',
            placeholders: {
              main: [
                {
                  componentName: 'Image',
                  fields: {
                    image: {
                      value: {
                        src: 'https://edge.sitecorecloud.io/-/media/image.jpg',
                        alt: 'Test image',
                      },
                    },
                  },
                },
                {
                  componentName: 'RichText',
                  fields: {
                    content: {
                      value:
                        '<p>Image: <img src="https://edge.sitecorecloud.io/-/media/inline.jpg" /></p>',
                    },
                  },
                },
              ],
            },
          },
        },
      };

      const result = rewriteEdgeHostInResponse(layoutData, CUSTOM_EDGE_URL);

      expect(result.sitecore.route.placeholders.main[0].fields.image.value.src).to.equal(
        'https://custom.example.com/-/media/image.jpg'
      );
      expect(result.sitecore.route.placeholders.main[1].fields.content.value).to.equal(
        '<p>Image: <img src="https://custom.example.com/-/media/inline.jpg" /></p>'
      );
    });

    it('should not rewrite similar but non-Edge URLs (no false positives)', () => {
      const layout = {
        a: 'https://other-cdn.com/path/edge-platform/image.jpg',
        b: 'https://my-edge-store.example.com/media/file.jpg',
        c: 'https://edge-platform.sitecorecloud.io/real-edge/media.jpg',
      };

      const result = rewriteEdgeHostInResponse(layout, CUSTOM_EDGE_URL) as typeof layout;

      expect(result.a).to.equal('https://other-cdn.com/path/edge-platform/image.jpg');
      expect(result.b).to.equal('https://my-edge-store.example.com/media/file.jpg');
      expect(result.c).to.equal(
        'https://edge-platform.sitecorecloud.io/real-edge/media.jpg'
      );
    });
  });

  describe('containsDefaultEdgeHost()', () => {
    it('should return false for edge-platform.sitecorecloud.io (only default hostname matches)', () => {
      expect(
        containsDefaultEdgeHost('https://edge-platform.sitecorecloud.io/media/image.jpg')
      ).to.be.false;
    });

    it('should return true for edge.sitecorecloud.io (default hostname)', () => {
      expect(containsDefaultEdgeHost('https://edge.sitecorecloud.io/media/image.jpg')).to.be.true;
    });

    it('should return false for edge-staging.sitecore-staging.cloud (only default hostname matches)', () => {
      expect(
        containsDefaultEdgeHost('https://edge-staging.sitecore-staging.cloud/tenant/media/a.jpg')
      ).to.be.false;
    });

    it('should return false for custom hostname', () => {
      expect(containsDefaultEdgeHost('https://custom.example.com/media/image.jpg')).to.be.false;
    });

    it('should return false for empty string', () => {
      expect(containsDefaultEdgeHost('')).to.be.false;
    });
  });
});
