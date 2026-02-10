/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { rewriteEdgeHostInResponse, containsDefaultEdgeHost } from './rewrite-edge-host';
import {
  SITECORE_EDGE_HOSTNAME_ENV,
  SITECORE_EDGE_HOSTNAME_PUBLIC_ENV,
} from '@sitecore-content-sdk/core/tools';

describe('rewriteEdgeHostInResponse', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    // Clear all relevant env vars before each test
    delete process.env[SITECORE_EDGE_HOSTNAME_ENV];
    delete process.env[SITECORE_EDGE_HOSTNAME_PUBLIC_ENV];
  });

  afterEach(() => {
    // Restore original env
    process.env = { ...originalEnv };
  });

  describe('rewriteEdgeHostInResponse()', () => {
    it('should return response unchanged when no custom hostname is configured', () => {
      const response = {
        url: 'https://edge-platform.sitecorecloud.io/media/image.jpg',
      };
      const result = rewriteEdgeHostInResponse(response);
      expect(result).to.deep.equal(response);
    });

    it('should rewrite edge-platform.sitecorecloud.io in string values', () => {
      process.env[SITECORE_EDGE_HOSTNAME_ENV] = 'custom.example.com';
      const response = {
        url: 'https://edge-platform.sitecorecloud.io/media/image.jpg',
      };
      const result = rewriteEdgeHostInResponse(response);
      expect(result.url).to.equal('https://custom.example.com/media/image.jpg');
    });

    it('should rewrite edge.sitecorecloud.io in string values', () => {
      process.env[SITECORE_EDGE_HOSTNAME_ENV] = 'custom.example.com';
      const response = {
        url: 'https://edge.sitecorecloud.io/media/image.jpg',
      };
      const result = rewriteEdgeHostInResponse(response);
      expect(result.url).to.equal('https://custom.example.com/media/image.jpg');
    });

    it('should rewrite edge-staging.sitecore-staging.cloud in string values', () => {
      process.env[SITECORE_EDGE_HOSTNAME_ENV] = 'custom.example.com';
      const response = {
        url: 'https://edge-staging.sitecore-staging.cloud/tenant-id/media/image.jpg',
      };
      const result = rewriteEdgeHostInResponse(response);
      expect(result.url).to.equal('https://custom.example.com/tenant-id/media/image.jpg');
    });

    it('should rewrite edge-platform-staging.sitecore-staging.cloud in string values', () => {
      process.env[SITECORE_EDGE_HOSTNAME_ENV] = 'custom.example.com';
      const response = {
        url: 'https://edge-platform-staging.sitecore-staging.cloud/tenant-id/media/image.jpg',
      };
      const result = rewriteEdgeHostInResponse(response);
      expect(result.url).to.equal('https://custom.example.com/tenant-id/media/image.jpg');
    });

    it('should rewrite multiple occurrences in a string', () => {
      process.env[SITECORE_EDGE_HOSTNAME_ENV] = 'custom.example.com';
      const response = {
        html: '<img src="https://edge-platform.sitecorecloud.io/a.jpg"><img src="https://edge-platform.sitecorecloud.io/b.jpg">',
      };
      const result = rewriteEdgeHostInResponse(response);
      expect(result.html).to.equal(
        '<img src="https://custom.example.com/a.jpg"><img src="https://custom.example.com/b.jpg">'
      );
    });

    it('should rewrite nested objects', () => {
      process.env[SITECORE_EDGE_HOSTNAME_ENV] = 'custom.example.com';
      const response = {
        sitecore: {
          context: {},
          route: {
            fields: {
              image: {
                value: {
                  src: 'https://edge-platform.sitecorecloud.io/media/image.jpg',
                },
              },
            },
          },
        },
      };
      const result = rewriteEdgeHostInResponse(response);
      expect(result.sitecore.route.fields.image.value.src).to.equal(
        'https://custom.example.com/media/image.jpg'
      );
    });

    it('should rewrite arrays', () => {
      process.env[SITECORE_EDGE_HOSTNAME_ENV] = 'custom.example.com';
      const response = {
        urls: [
          'https://edge-platform.sitecorecloud.io/a.jpg',
          'https://edge-platform.sitecorecloud.io/b.jpg',
        ],
      };
      const result = rewriteEdgeHostInResponse(response);
      expect(result.urls).to.deep.equal([
        'https://custom.example.com/a.jpg',
        'https://custom.example.com/b.jpg',
      ]);
    });

    it('should handle null values', () => {
      process.env[SITECORE_EDGE_HOSTNAME_ENV] = 'custom.example.com';
      const response = {
        value: null,
      };
      const result = rewriteEdgeHostInResponse(response);
      expect(result.value).to.be.null;
    });

    it('should handle undefined values', () => {
      process.env[SITECORE_EDGE_HOSTNAME_ENV] = 'custom.example.com';
      const response = {
        value: undefined,
      };
      const result = rewriteEdgeHostInResponse(response);
      expect(result.value).to.be.undefined;
    });

    it('should preserve non-string primitives', () => {
      process.env[SITECORE_EDGE_HOSTNAME_ENV] = 'custom.example.com';
      const response = {
        number: 42,
        boolean: true,
        string: 'no edge url here',
      };
      const result = rewriteEdgeHostInResponse(response);
      expect(result.number).to.equal(42);
      expect(result.boolean).to.be.true;
      expect(result.string).to.equal('no edge url here');
    });

    it('should handle http protocol in edge URLs', () => {
      process.env[SITECORE_EDGE_HOSTNAME_ENV] = 'custom.example.com';
      const response = {
        url: 'http://edge-platform.sitecorecloud.io/media/image.jpg',
      };
      const result = rewriteEdgeHostInResponse(response);
      expect(result.url).to.equal('https://custom.example.com/media/image.jpg');
    });

    it('should handle mixed case (case insensitive)', () => {
      process.env[SITECORE_EDGE_HOSTNAME_ENV] = 'custom.example.com';
      const response = {
        url: 'https://EDGE-PLATFORM.SITECORECLOUD.IO/media/image.jpg',
      };
      const result = rewriteEdgeHostInResponse(response);
      expect(result.url).to.equal('https://custom.example.com/media/image.jpg');
    });

    it('should handle complex layout service data structure', () => {
      process.env[SITECORE_EDGE_HOSTNAME_ENV] = 'custom.example.com';
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
                        src: 'https://edge-platform.sitecorecloud.io/-/media/image.jpg',
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
                        '<p>Image: <img src="https://edge-platform.sitecorecloud.io/-/media/inline.jpg" /></p>',
                    },
                  },
                },
              ],
            },
          },
        },
      };

      const result = rewriteEdgeHostInResponse(layoutData);

      expect(result.sitecore.route.placeholders.main[0].fields.image.value.src).to.equal(
        'https://custom.example.com/-/media/image.jpg'
      );
      expect(result.sitecore.route.placeholders.main[1].fields.content.value).to.equal(
        '<p>Image: <img src="https://custom.example.com/-/media/inline.jpg" /></p>'
      );
    });
  });

  describe('containsDefaultEdgeHost()', () => {
    it('should return true for edge-platform.sitecorecloud.io', () => {
      expect(
        containsDefaultEdgeHost('https://edge-platform.sitecorecloud.io/media/image.jpg')
      ).to.be.true;
    });

    it('should return true for edge.sitecorecloud.io', () => {
      expect(containsDefaultEdgeHost('https://edge.sitecorecloud.io/media/image.jpg')).to.be.true;
    });

    it('should return true for edge-staging.sitecore-staging.cloud', () => {
      expect(
        containsDefaultEdgeHost('https://edge-staging.sitecore-staging.cloud/tenant/media/a.jpg')
      ).to.be.true;
    });

    it('should return false for custom hostname', () => {
      expect(containsDefaultEdgeHost('https://custom.example.com/media/image.jpg')).to.be.false;
    });

    it('should return false for empty string', () => {
      expect(containsDefaultEdgeHost('')).to.be.false;
    });
  });
});
