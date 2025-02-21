import { NextResponse } from 'next/server';
import { MiddlewarePlugin } from '..';
// TODO: remove this file when getting rid of plugins/moving middleware to package
import scConfig from 'sitecore.config';
import sitesList from 'temp/sites';
import { initSitecore } from '@sitecore-content-sdk/nextjs/config';

// This temporary plugin ensures runtimeConfig is available when middleware plugins constructors are called
class InitPlugin implements MiddlewarePlugin {
  // Multisite middleware has to be executed first
  order = -2;

  constructor() {
    initSitecore({ sitecoreConfig: scConfig, sites: sitesList || [] });
  }

  async exec(): Promise<NextResponse> {
    return NextResponse.next();
  }
}

export const initPlugin = new InitPlugin();
