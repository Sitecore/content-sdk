import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { VERSION as CORE_VERSION } from '@angular/core';
import { Router } from '@angular/router';
import { _coreVersionMarker, _routerTokenMarker } from '@sitecore-content-sdk/angular';

console.log('same @angular/core object?', _coreVersionMarker === CORE_VERSION);
console.log('same Router token?', _routerTokenMarker === Router);

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
