import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { LOADER_REGISTRY } from '@sitecore-content-sdk/angular';
import { SERVER_LOADERS } from '../lib/loaders';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    { provide: LOADER_REGISTRY, useValue: SERVER_LOADERS },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
