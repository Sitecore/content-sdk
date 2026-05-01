import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { LOADER_RESULT_CACHE_TOKEN } from '@sitecore-content-sdk/angular';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { getLoaderResultCache } from '../content-sdk/loader-cache';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    { provide: LOADER_RESULT_CACHE_TOKEN, useFactory: () => getLoaderResultCache(), deps: [] },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
