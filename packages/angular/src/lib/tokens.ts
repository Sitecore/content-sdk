import { InjectionToken } from '@angular/core';
import { ComponentMap } from './types';

/**
 * Injection token for the initial component map.
 * Provide this to pre-register components without using `ComponentMapService` directly.
 * @public
 */
export const COMPONENT_MAP_TOKEN = new InjectionToken<ComponentMap>('COMPONENT_MAP_TOKEN');

/**
 * Injection token for the not found route.
 * @public
 */
export const NOT_FOUND_ROUTE_TOKEN = new InjectionToken<string>('NOT_FOUND_ROUTE_TOKEN');

/**
 * Injection token for the error route.
 * @public
 */
export const ERROR_ROUTE_TOKEN = new InjectionToken<string>('ERROR_ROUTE_TOKEN');
