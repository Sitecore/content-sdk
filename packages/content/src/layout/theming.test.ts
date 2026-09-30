/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import { constants } from '@sitecore-content-sdk/core';
import {
  getThemingStylesheetLinks,
  getThemingStylesheetUrl,
  isSiteThemingEnabled,
  THEMING_BODY_CLASS_NAME,
  THEMING_DELIVERY_CHANNEL,
} from './theming';

const { SITECORE_EDGE_PLATFORM_URL_DEFAULT } = constants;

const themeHref = (
  siteName: string,
  clientContextId: string,
  sitecoreEdgeUrl: string = SITECORE_EDGE_PLATFORM_URL_DEFAULT
) =>
  `${sitecoreEdgeUrl}/authoring/api/v1/themes/delivery/${encodeURIComponent(
    siteName
  )}/${THEMING_DELIVERY_CHANNEL}?contextID=${encodeURIComponent(clientContextId)}`;

describe('theming', () => {
  describe('getThemingStylesheetUrl', () => {
    it('builds the site theme delivery URL', () => {
      expect(getThemingStylesheetUrl('My Site', 'client-1')).to.equal(
        themeHref('My Site', 'client-1')
      );
      expect(THEMING_DELIVERY_CHANNEL).to.equal('web-css');
    });

    it('uses the provided Edge URL without a trailing slash', () => {
      expect(getThemingStylesheetUrl('site-1', 'client-1', 'https://edge.example.com/')).to.equal(
        'https://edge.example.com/authoring/api/v1/themes/delivery/site-1/web-css?contextID=client-1'
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
          siteName: 'example',
          clientContextId: 'client-1',
        })
      ).to.deep.equal([]);
    });

    it('returns no links when site name is missing', () => {
      expect(getThemingStylesheetLinks({ mode: 'site', clientContextId: 'client-1' })).to.deep.equal(
        []
      );
      expect(
        getThemingStylesheetLinks({ mode: 'site', siteName: '', clientContextId: 'client-1' })
      ).to.deep.equal([]);
    });

    it('returns no links when client context id is missing', () => {
      expect(getThemingStylesheetLinks({ mode: 'site', siteName: 'example' })).to.deep.equal([]);
      expect(
        getThemingStylesheetLinks({ mode: 'site', siteName: 'example', clientContextId: '' })
      ).to.deep.equal([]);
    });

    it('returns the site theme link when mode is site', () => {
      expect(
        getThemingStylesheetLinks({
          mode: 'site',
          siteName: 'example',
          clientContextId: 'client-1',
        })
      ).to.deep.equal([
        {
          href: themeHref('example', 'client-1'),
          rel: 'stylesheet',
        },
      ]);
    });

    it('uses the provided Edge URL', () => {
      expect(
        getThemingStylesheetLinks({
          mode: 'site',
          siteName: 'example',
          clientContextId: 'client-1',
          sitecoreEdgeUrl: 'https://edge.example.com',
        })
      ).to.deep.equal([
        {
          href: themeHref('example', 'client-1', 'https://edge.example.com'),
          rel: 'stylesheet',
        },
      ]);
    });
  });
});
