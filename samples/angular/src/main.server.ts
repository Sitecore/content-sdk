import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { config } from './app/app.config.server';
import { _coreVersionMarker, _routerTokenMarker } from '@sitecore-content-sdk/angular';
import { VERSION as CORE_VERSION } from '@angular/core';
import { Router } from '@angular/router';

console.log('server angular version', CORE_VERSION);
console.log('library angular version', _coreVersionMarker);
console.log('same @angular/core object?', _coreVersionMarker === CORE_VERSION);
console.log('same Router token?', _routerTokenMarker === Router);

const bootstrap = (context: BootstrapContext) => bootstrapApplication(App, config, context);

export default bootstrap;
