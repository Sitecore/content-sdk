/* eslint-disable no-unused-expressions */
import { performance } from 'perf_hooks';
import { expect } from 'chai';
import { rewriteEdgeHostInResponse, containsDefaultEdgeHost } from './rewrite-edge-host';
import { SITECORE_EDGE_HOSTNAME_PUBLIC_ENV } from '@sitecore-content-sdk/core/tools';

describe('rewriteEdgeHostInResponse', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
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
      process.env[SITECORE_EDGE_HOSTNAME_PUBLIC_ENV] = 'custom.example.com';
      const response = {
        url: 'https://edge-platform.sitecorecloud.io/media/image.jpg',
      };
      const result = rewriteEdgeHostInResponse(response);
      expect(result.url).to.equal('https://custom.example.com/media/image.jpg');
    });

    it('should rewrite edge.sitecorecloud.io in string values', () => {
      process.env[SITECORE_EDGE_HOSTNAME_PUBLIC_ENV] = 'custom.example.com';
      const response = {
        url: 'https://edge.sitecorecloud.io/media/image.jpg',
      };
      const result = rewriteEdgeHostInResponse(response);
      expect(result.url).to.equal('https://custom.example.com/media/image.jpg');
    });

    it('should rewrite edge-staging.sitecore-staging.cloud in string values', () => {
      process.env[SITECORE_EDGE_HOSTNAME_PUBLIC_ENV] = 'custom.example.com';
      const response = {
        url: 'https://edge-staging.sitecore-staging.cloud/tenant-id/media/image.jpg',
      };
      const result = rewriteEdgeHostInResponse(response);
      expect(result.url).to.equal('https://custom.example.com/tenant-id/media/image.jpg');
    });

    it('should rewrite edge-platform-staging.sitecore-staging.cloud in string values', () => {
      process.env[SITECORE_EDGE_HOSTNAME_PUBLIC_ENV] = 'custom.example.com';
      const response = {
        url: 'https://edge-platform-staging.sitecore-staging.cloud/tenant-id/media/image.jpg',
      };
      const result = rewriteEdgeHostInResponse(response);
      expect(result.url).to.equal('https://custom.example.com/tenant-id/media/image.jpg');
    });

    it('should rewrite multiple occurrences in a string', () => {
      process.env[SITECORE_EDGE_HOSTNAME_PUBLIC_ENV] = 'custom.example.com';
      const response = {
        html: '<img src="https://edge-platform.sitecorecloud.io/a.jpg"><img src="https://edge-platform.sitecorecloud.io/b.jpg">',
      };
      const result = rewriteEdgeHostInResponse(response);
      expect(result.html).to.equal(
        '<img src="https://custom.example.com/a.jpg"><img src="https://custom.example.com/b.jpg">'
      );
    });

    it('should rewrite nested objects', () => {
      process.env[SITECORE_EDGE_HOSTNAME_PUBLIC_ENV] = 'custom.example.com';
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
      process.env[SITECORE_EDGE_HOSTNAME_PUBLIC_ENV] = 'custom.example.com';
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
      process.env[SITECORE_EDGE_HOSTNAME_PUBLIC_ENV] = 'custom.example.com';
      const response = {
        value: null,
      };
      const result = rewriteEdgeHostInResponse(response);
      expect(result.value).to.be.null;
    });

    it('should handle undefined values', () => {
      process.env[SITECORE_EDGE_HOSTNAME_PUBLIC_ENV] = 'custom.example.com';
      const response = {
        value: undefined,
      };
      const result = rewriteEdgeHostInResponse(response);
      expect(result.value).to.be.undefined;
    });

    it('should preserve non-string primitives', () => {
      process.env[SITECORE_EDGE_HOSTNAME_PUBLIC_ENV] = 'custom.example.com';
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
      process.env[SITECORE_EDGE_HOSTNAME_PUBLIC_ENV] = 'custom.example.com';
      const response = {
        url: 'http://edge-platform.sitecorecloud.io/media/image.jpg',
      };
      const result = rewriteEdgeHostInResponse(response);
      expect(result.url).to.equal('https://custom.example.com/media/image.jpg');
    });

    it('should handle mixed case (case insensitive)', () => {
      process.env[SITECORE_EDGE_HOSTNAME_PUBLIC_ENV] = 'custom.example.com';
      const response = {
        url: 'https://EDGE-PLATFORM.SITECORECLOUD.IO/media/image.jpg',
      };
      const result = rewriteEdgeHostInResponse(response);
      expect(result.url).to.equal('https://custom.example.com/media/image.jpg');
    });

    it('should handle complex layout service data structure', () => {
      process.env[SITECORE_EDGE_HOSTNAME_PUBLIC_ENV] = 'custom.example.com';
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

  describe('performance benchmarks', () => {
    const ITERATIONS = 500;

    /** Build a layout with N placeholder components (mix of Image + RichText). */
    function buildLayout(componentCount: number): Record<string, unknown> {
      const edgeUrl = 'https://edge-platform.sitecorecloud.io';
      const components = [];
      for (let i = 0; i < componentCount; i++) {
        components.push({
          componentName: i % 2 === 0 ? 'Image' : 'RichText',
          fields:
            i % 2 === 0
              ? {
                  Image: {
                    value: {
                      src: `${edgeUrl}/tenant/media/image-${i}.jpg`,
                      alt: `Image ${i}`,
                    },
                  },
                }
              : {
                  content: {
                    value: `<p>Block ${i}: <img src="${edgeUrl}/tenant/media/rich-${i}.jpg" /> and <a href="${edgeUrl}/media/doc.pdf">link</a></p>`,
                  },
                },
        });
      }
      return {
        sitecore: {
          context: { site: { name: 'test' }, language: 'en' },
          route: {
            name: 'page',
            placeholders: { main: components },
            fields: {
              title: { value: `Page with ${componentCount} components` },
              image: {
                value: { src: `${edgeUrl}/tenant/media/hero.jpg` },
              },
            },
          },
        },
      };
    }

    it('benchmark: rewrite timing vs layout size (with custom hostname)', function () {
      this.timeout(30000);
      process.env[SITECORE_EDGE_HOSTNAME_PUBLIC_ENV] = 'custom.example.com';

      const sizes = [
        { name: 'small (10 components)', count: 10 },
        { name: 'medium (50 components)', count: 50 },
        { name: 'large (150 components)', count: 150 },
      ];

      const results: { size: string; msPerCall: number; totalMs: number; iterations: number }[] = [];

      for (const { name, count } of sizes) {
        const layout = buildLayout(count);
        const start = performance.now();
        for (let i = 0; i < ITERATIONS; i++) {
          rewriteEdgeHostInResponse(layout);
        }
        const totalMs = performance.now() - start;
        const msPerCall = totalMs / ITERATIONS;
        results.push({ size: name, msPerCall, totalMs, iterations: ITERATIONS });
      }

      // Assert all under 5ms per call (reasonable for CI)
      for (const r of results) {
        expect(r.msPerCall, `${r.size} should be < 5ms per call`).to.be.lessThan(5);
      }

      // Log metrics for presentation
      console.log('\n--- rewriteEdgeHostInResponse performance (custom hostname enabled) ---');
      for (const r of results) {
        console.log(`  ${r.size}: ${r.msPerCall.toFixed(3)}ms per call (${r.iterations} iterations, ${r.totalMs.toFixed(0)}ms total)`);
      }
      console.log('---\n');
    });

    it('benchmark: no-op when custom hostname disabled (baseline)', function () {
      this.timeout(15000);
      delete process.env[SITECORE_EDGE_HOSTNAME_PUBLIC_ENV];

      const layout = buildLayout(100);
      const start = performance.now();
      for (let i = 0; i < ITERATIONS; i++) {
        rewriteEdgeHostInResponse(layout);
      }
      const totalMs = performance.now() - start;
      const msPerCall = totalMs / ITERATIONS;

      expect(msPerCall).to.be.lessThan(1);
      console.log(
        `\n--- rewriteEdgeHostInResponse when disabled (early return): ${msPerCall.toFixed(4)}ms per call (${ITERATIONS} iterations) ---\n`
      );
    });

    it('benchmark: comparison - rewrite enabled vs disabled', function () {
      this.timeout(20000);
      const layout = buildLayout(75);
      const iterations = 1000;

      // Disabled
      delete process.env[SITECORE_EDGE_HOSTNAME_PUBLIC_ENV];
      const startDisabled = performance.now();
      for (let i = 0; i < iterations; i++) {
        rewriteEdgeHostInResponse(layout);
      }
      const disabledMs = performance.now() - startDisabled;

      // Enabled
      process.env[SITECORE_EDGE_HOSTNAME_PUBLIC_ENV] = 'custom.example.com';
      const startEnabled = performance.now();
      for (let i = 0; i < iterations; i++) {
        rewriteEdgeHostInResponse(layout);
      }
      const enabledMs = performance.now() - startEnabled;

      const disabledPerCall = disabledMs / iterations;
      const enabledPerCall = enabledMs / iterations;
      const overheadMs = enabledPerCall - disabledPerCall;

      console.log('\n--- Comparison (75 components, 1000 iterations) ---');
      console.log(`  Disabled (early return): ${disabledPerCall.toFixed(4)}ms per call`);
      console.log(`  Enabled (full rewrite): ${enabledPerCall.toFixed(4)}ms per call`);
      console.log(`  Overhead per request:   ${overheadMs.toFixed(4)}ms`);
      console.log('---\n');

      expect(enabledPerCall).to.be.lessThan(2);
    });

    it('resilience: regex completes quickly on long strings (no catastrophic backtracking)', function () {
      this.timeout(5000);
      process.env[SITECORE_EDGE_HOSTNAME_PUBLIC_ENV] = 'custom.example.com';

      // Long string with many Edge URLs (could trigger backtracking with bad regex)
      const urls = Array(100).fill('https://edge-platform.sitecorecloud.io/tenant/media/image.jpg').join(' ');
      const layout = { sitecore: { route: { fields: { content: { value: urls } } } } };

      const start = performance.now();
      for (let i = 0; i < 100; i++) {
        rewriteEdgeHostInResponse(layout);
      }
      const elapsed = performance.now() - start;
      const msPerCall = elapsed / 100;

      expect(msPerCall, '100 URLs in one string should complete in < 50ms per call').to.be.lessThan(50);
      const result = rewriteEdgeHostInResponse(layout) as typeof layout;
      expect((result.sitecore.route.fields.content.value as string).includes('custom.example.com')).to.be
        .true;
      expect((result.sitecore.route.fields.content.value as string).includes('edge-platform.sitecorecloud.io'))
        .to.be.false;
      console.log(`\n--- Regex resilience: 100 URLs in one string = ${msPerCall.toFixed(2)}ms per call ---\n`);
    });

    it('resilience: memory stable under repeated rewrites', function () {
      this.timeout(30000);
      process.env[SITECORE_EDGE_HOSTNAME_PUBLIC_ENV] = 'custom.example.com';

      const layout = buildLayout(80);
      const iterations = 2000;

      if (global.gc) {
        global.gc();
      }
      const memBefore = process.memoryUsage().heapUsed;

      for (let i = 0; i < iterations; i++) {
        rewriteEdgeHostInResponse(layout);
      }

      if (global.gc) {
        global.gc();
      }
      const memAfter = process.memoryUsage().heapUsed;
      const growthMb = (memAfter - memBefore) / 1024 / 1024;

      expect(growthMb, 'memory growth should be < 50MB after 2000 rewrites').to.be.lessThan(50);
      console.log(
        `\n--- Memory: ${growthMb.toFixed(2)}MB growth after ${iterations} rewrites (heap before: ${(memBefore / 1024 / 1024).toFixed(1)}MB, after: ${(memAfter / 1024 / 1024).toFixed(1)}MB) ---\n`
      );
    });

    it('resilience: worst-case layout (400 components) completes in reasonable time', function () {
      this.timeout(60000);
      process.env[SITECORE_EDGE_HOSTNAME_PUBLIC_ENV] = 'custom.example.com';

      const layout = buildLayout(400);
      const start = performance.now();
      for (let i = 0; i < 100; i++) {
        rewriteEdgeHostInResponse(layout);
      }
      const elapsed = performance.now() - start;
      const msPerCall = elapsed / 100;

      expect(msPerCall, '400 components should complete in < 15ms per call').to.be.lessThan(15);
      console.log(
        `\n--- Worst-case (400 components): ${msPerCall.toFixed(3)}ms per call ---\n`
      );
    });

    it('correctness: no false positives - similar but non-Edge URLs unchanged', function () {
      process.env[SITECORE_EDGE_HOSTNAME_PUBLIC_ENV] = 'custom.example.com';

      const layout = {
        a: 'https://other-cdn.com/path/edge-platform/image.jpg',
        b: 'https://my-edge-store.example.com/media/file.jpg',
        c: 'https://edge-platform.sitecorecloud.io/real-edge/media.jpg',
      };

      const result = rewriteEdgeHostInResponse(layout) as typeof layout;

      expect(result.a).to.equal('https://other-cdn.com/path/edge-platform/image.jpg');
      expect(result.b).to.equal('https://my-edge-store.example.com/media/file.jpg');
      expect(result.c).to.equal('https://custom.example.com/real-edge/media.jpg');
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
