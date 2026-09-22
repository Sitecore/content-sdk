/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import { constants } from '@sitecore-content-sdk/core';
import {
  getThemingStylesheetLinks,
  getThemingStylesheetUrl,
  isSiteThemingEnabled,
  THEMING_BODY_CLASS_NAME,
} from './theming';

const { SITECORE_EDGE_PLATFORM_URL_DEFAULT } = constants;

describe('theming', () => {
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

  describe('isSiteThemingEnabled', () => {
    it('returns false when theming is disabled', () => {
      expect(isSiteThemingEnabled('none')).to.be.false;
    });

    it('returns true when site theming is enabled', () => {
      expect(isSiteThemingEnabled('site')).to.be.true;
      expect(THEMING_BODY_CLASS_NAME).to.equal('sc-ds-theme');
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

    it('uses the provided Edge URL', () => {
      expect(
        getThemingStylesheetLinks({
          mode: 'site',
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
