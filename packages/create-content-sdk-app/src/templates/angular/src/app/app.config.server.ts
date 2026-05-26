import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { provideServerLoaderDataProvider } from '@sitecore-content-sdk/angular';

const serverConfig: ApplicationConfig = {
  providers: [provideServerRendering(withRoutes(serverRoutes)), provideServerLoaderDataProvider()],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
