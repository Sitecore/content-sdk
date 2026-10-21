/* eslint-disable jsdoc/require-jsdoc */
import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import type { SitecoreClient } from '@sitecore-content-sdk/content/client';
import { provideSitecoreAngular } from './providers';
import {
  SITECORE_CLIENT_TOKEN,
  SITECORE_CONFIG_TOKEN,
  NOT_FOUND_ROUTE_TOKEN,
  ERROR_ROUTE_TOKEN,
} from './tokens';
import type { AngularSitecoreConfig } from '../config/define-config';

describe('provideSitecoreAngular', () => {
  const mockConfig = { defaultSite: 's', defaultLanguage: 'en' } as AngularSitecoreConfig;
  const mockClient = { getPage: () => Promise.resolve(null) } as unknown as SitecoreClient;

  beforeEach(() => {
    TestBed.resetTestingModule();
  });

  it('should provide the passed sitecoreClient as SITECORE_CLIENT_TOKEN', () => {
    TestBed.configureTestingModule({
      providers: [
        provideSitecoreAngular({ sitecoreConfig: mockConfig, sitecoreClient: mockClient }),
      ],
    });

    expect(TestBed.inject(SITECORE_CLIENT_TOKEN)).toBe(mockClient);
  });

  it('should provide the passed sitecoreConfig as SITECORE_CONFIG_TOKEN', () => {
    TestBed.configureTestingModule({
      providers: [
        provideSitecoreAngular({ sitecoreConfig: mockConfig, sitecoreClient: mockClient }),
      ],
    });

    expect(TestBed.inject(SITECORE_CONFIG_TOKEN)).toBe(mockConfig);
  });

  it('should throw when only sitecoreConfig is provided', () => {
    expect(() => provideSitecoreAngular({ sitecoreConfig: mockConfig })).toThrow(
      /sitecoreConfig.*sitecoreClient.*both be provided/
    );
  });

  it('should throw when only sitecoreClient is provided', () => {
    expect(() => provideSitecoreAngular({ sitecoreClient: mockClient })).toThrow(
      /sitecoreConfig.*sitecoreClient.*both be provided/
    );
  });

  it('should provide route tokens without sitecore pair', () => {
    TestBed.configureTestingModule({
      providers: [provideSitecoreAngular({ notFoundRoute: '/404', errorRoute: '/500' })],
    });

    expect(TestBed.inject(NOT_FOUND_ROUTE_TOKEN)).toBe('/404');
    expect(TestBed.inject(ERROR_ROUTE_TOKEN)).toBe('/500');
  });
});
