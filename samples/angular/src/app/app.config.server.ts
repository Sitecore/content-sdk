import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { provideSitecoreContentSdkServer } from '@sitecore-content-sdk/angular';
import { SERVER_LOADERS } from '../lib/loaders';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    provideSitecoreContentSdkServer({
      loaders: SERVER_LOADERS,
    }),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
