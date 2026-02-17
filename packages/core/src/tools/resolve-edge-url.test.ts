/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import {
  resolveEdgeUrl,
  resolveEdgeUrlForStaticFiles,
  hasCustomEdgeHostname,
  getCustomEdgeUrl,
  SITECORE_EDGE_PLATFORM_HOSTNAME_ENV,
} from './resolve-edge-url';
import { SITECORE_EXPERIENCE_EDGE_URL_DEFAULT } from '../constants';

describe('resolveEdgeUrl', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    delete process.env[SITECORE_EDGE_PLATFORM_HOSTNAME_ENV];
  });

  afterEach(() => {
    // Restore original env
    process.env = { ...originalEnv };
  });

  describe('resolveEdgeUrl()', () => {
    it('should return explicit edgeUrl parameter when provided', () => {
      process.env[SITECORE_EDGE_PLATFORM_HOSTNAME_ENV] = 'custom.example.com';
      const result = resolveEdgeUrl('https://explicit.example.com');
      expect(result).to.equal('https://explicit.example.com');
    });

    it('should normalize trailing slash from explicit edgeUrl', () => {
      const result = resolveEdgeUrl('https://explicit.example.com/');
      expect(result).to.equal('https://explicit.example.com');
    });

    it('should use SITECORE_EDGE_PLATFORM_HOSTNAME when set (hostname only)', () => {
      process.env[SITECORE_EDGE_PLATFORM_HOSTNAME_ENV] = 'my-tenant.edge.example.com';
      const result = resolveEdgeUrl();
      expect(result).to.equal('https://my-tenant.edge.example.com');
    });

    it('should use SITECORE_EDGE_PLATFORM_HOSTNAME when set (full URL)', () => {
      process.env[SITECORE_EDGE_PLATFORM_HOSTNAME_ENV] = 'https://my-tenant.edge.example.com';
      const result = resolveEdgeUrl();
      expect(result).to.equal('https://my-tenant.edge.example.com');
    });

    it('should normalize trailing slash from hostname env var', () => {
      process.env[SITECORE_EDGE_PLATFORM_HOSTNAME_ENV] = 'https://my-tenant.edge.example.com/';
      const result = resolveEdgeUrl();
      expect(result).to.equal('https://my-tenant.edge.example.com');
    });

    it('should trim whitespace from hostname env var', () => {
      process.env[SITECORE_EDGE_PLATFORM_HOSTNAME_ENV] = '  my-tenant.edge.example.com  ';
      const result = resolveEdgeUrl();
      expect(result).to.equal('https://my-tenant.edge.example.com');
    });

    it('should use SITECORE_EDGE_PLATFORM_HOSTNAME when set', () => {
      process.env[SITECORE_EDGE_PLATFORM_HOSTNAME_ENV] = 'public-tenant.edge.example.com';
      const result = resolveEdgeUrl();
      expect(result).to.equal('https://public-tenant.edge.example.com');
    });

    it('should return default when no env vars are set', () => {
      const result = resolveEdgeUrl();
      expect(result).to.equal(SITECORE_EXPERIENCE_EDGE_URL_DEFAULT);
    });

    it('should treat the string "undefined" as an unset hostname env var', () => {
      process.env[SITECORE_EDGE_PLATFORM_HOSTNAME_ENV] = 'undefined';
      const result = resolveEdgeUrl();
      expect(result).to.equal(SITECORE_EXPERIENCE_EDGE_URL_DEFAULT);
    });

    it('should treat the string "null" as an unset hostname env var', () => {
      process.env[SITECORE_EDGE_PLATFORM_HOSTNAME_ENV] = 'null';
      const result = resolveEdgeUrl();
      expect(result).to.equal(SITECORE_EXPERIENCE_EDGE_URL_DEFAULT);
    });

    it('should treat whitespace-only hostname env var as unset', () => {
      process.env[SITECORE_EDGE_PLATFORM_HOSTNAME_ENV] = '   ';
      const result = resolveEdgeUrl();
      expect(result).to.equal(SITECORE_EXPERIENCE_EDGE_URL_DEFAULT);
    });

    it('should handle http protocol in hostname', () => {
      process.env[SITECORE_EDGE_PLATFORM_HOSTNAME_ENV] = 'http://insecure.example.com';
      const result = resolveEdgeUrl();
      expect(result).to.equal('http://insecure.example.com');
    });
  });

  describe('hasCustomEdgeHostname()', () => {
    it('should return false when no hostname env vars are set', () => {
      expect(hasCustomEdgeHostname()).to.be.false;
    });

    it('should return true when SITECORE_EDGE_PLATFORM_HOSTNAME is set', () => {
      process.env[SITECORE_EDGE_PLATFORM_HOSTNAME_ENV] = 'custom.example.com';
      expect(hasCustomEdgeHostname()).to.be.true;
    });
  });

  describe('getCustomEdgeUrl()', () => {
    it('should return undefined when no custom hostname is configured', () => {
      expect(getCustomEdgeUrl()).to.be.undefined;
    });

    it('should return resolved URL when custom hostname is configured', () => {
      process.env[SITECORE_EDGE_PLATFORM_HOSTNAME_ENV] = 'custom.example.com';
      expect(getCustomEdgeUrl()).to.equal('https://custom.example.com');
    });
  });

  describe('resolveEdgeUrlForStaticFiles()', () => {
    it('should return default Edge URL', () => {
      const result = resolveEdgeUrlForStaticFiles();
      expect(result).to.equal(SITECORE_EXPERIENCE_EDGE_URL_DEFAULT);
    });

    it('should return default even when custom hostname is set', () => {
      process.env[SITECORE_EDGE_PLATFORM_HOSTNAME_ENV] = 'custom.example.com';
      const result = resolveEdgeUrlForStaticFiles();
      expect(result).to.equal(SITECORE_EXPERIENCE_EDGE_URL_DEFAULT);
    });
  });
});
