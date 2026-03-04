import { InjectionToken } from '@angular/core';
import type { LoaderFn } from './types';

/**
 * Registry of named loaders used for route resolution.
 * Provide a record of loaderId -> LoaderFn so that {@link loaderResolver} can resolve route data.
 * @public
 */
export const LOADER_REGISTRY = new InjectionToken<Record<string, LoaderFn>>('LOADER_REGISTRY');
