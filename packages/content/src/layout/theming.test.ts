/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import { constants } from '@sitecore-content-sdk/core';
import {
  CSDK_FEATURE_THEMING_ENV,
  getThemingBodyClassName,
  getThemingStylesheetLinks,
  getThemingStylesheetUrl,
  parseThemingMode,
  resolveThemingModeFromEnv,
  THEMING_BODY_CLASS_NAME,
} from './theming';

const { SITECORE_EDGE_PLATFORM_URL_DEFAULT } = constants;

describe('theming', () => {
  describe('parseThemingMode', () => {
    it('returns none for empty or disabled values', () => {
      expect(parseThemingMode()).to.equal('none');
      expect(parseThemingMode('')).to.equal('none');
      expect(parseThemingMode('none')).to.equal('none');
      expect(parseThemingMode('0')).to.equal('none');
      expect(parseThemingMode(' NONE ')).to.equal('none');
      expect(parseThemingMode('unexpected')).to.equal('none');
    });

    it('returns site for site or 1', () => {
      expect(parseThemingMode('site')).to.equal('site');
      expect(parseThemingMode('SITE')).to.equal('site');
      expect(parseThemingMode('1')).to.equal('site');
    });

    it('returns page for page or 2', () => {
      expect(parseThemingMode('page')).to.equal('page');
      expect(parseThemingMode('2')).to.equal('page');
    });
  });

  describe('resolveThemingModeFromEnv', () => {
    it('prefers CSDK_FEATURE_THEMING over aliases', () => {
      expect(
        resolveThemingModeFromEnv({
          [CSDK_FEATURE_THEMING_ENV]: 'site',
          NEXT_PUBLIC_CSDK_FEATURE_THEMING: 'page',
          FEATURE_THEMING: 'none',
        })
      ).to.equal('site');
    });

    it('falls back to NEXT_PUBLIC then FEATURE_THEMING', () => {
      expect(
        resolveThemingModeFromEnv({
          NEXT_PUBLIC_CSDK_FEATURE_THEMING: '1',
        })
      ).to.equal('site');
      expect(resolveThemingModeFromEnv({ FEATURE_THEMING: '2' })).to.equal('page');
    });

    it('defaults to none when no env is set', () => {
      expect(resolveThemingModeFromEnv({})).to.equal('none');
    });
  });

  describe('getThemingStylesheetUrl', () => {
    it('builds the site theme URL and encodes the site id', () => {
      expect(getThemingStylesheetUrl('{SITE-ID}')).to.equal(
        `${SITECORE_EDGE_PLATFORM_URL_DEFAULT}/theming/${encodeURIComponent('{SITE-ID}')}`
      );
    });

    it('uses the provided Edge URL without a trailing slash', () => {
      expect(getThemingStylesheetUrl('site-1', 'https://edge.example.com/')).to.equal(
        'https://edge.example.com/theming/site-1'
      );
    });
  });

  describe('getThemingBodyClassName', () => {
    it('returns undefined when theming is disabled', () => {
      expect(getThemingBodyClassName('none')).to.be.undefined;
    });

    it('returns the body class when site theming is enabled', () => {
      expect(getThemingBodyClassName('site')).to.equal(THEMING_BODY_CLASS_NAME);
      expect(THEMING_BODY_CLASS_NAME).to.equal('sc-ds-theme');
    });

    it('treats page mode as site-level for the body class', () => {
      expect(getThemingBodyClassName('page')).to.equal(THEMING_BODY_CLASS_NAME);
    });
  });

  describe('getThemingStylesheetLinks', () => {
    it('returns no links when theming is disabled', () => {
      expect(
        getThemingStylesheetLinks({
          mode: 'none',
          siteId: 'site-1',
        })
      ).to.deep.equal([]);
    });

    it('returns no links when site id is missing', () => {
      expect(getThemingStylesheetLinks({ mode: 'site' })).to.deep.equal([]);
      expect(getThemingStylesheetLinks({ mode: 'site', siteId: '' })).to.deep.equal([]);
    });

    it('returns the site theme link when mode is site', () => {
      expect(
        getThemingStylesheetLinks({
          mode: 'site',
          siteId: 'site-1',
        })
      ).to.deep.equal([
        {
          href: `${SITECORE_EDGE_PLATFORM_URL_DEFAULT}/theming/site-1`,
          rel: 'stylesheet',
        },
      ]);
    });

    it('treats page mode as site-level only', () => {
      expect(
        getThemingStylesheetLinks({
          mode: 'page',
          siteId: 'site-1',
          sitecoreEdgeUrl: 'https://edge.example.com',
        })
      ).to.deep.equal([
        {
          href: 'https://edge.example.com/theming/site-1',
          rel: 'stylesheet',
        },
      ]);
    });
  });
});
