import { InjectionToken } from '@angular/core';
import { ComponentMap } from './types';

/**
 * Injection token for the initial component map.
 * Provide this to pre-register components without using `ComponentMapService` directly.
 * @public
 */
export const COMPONENT_MAP_TOKEN = new InjectionToken<ComponentMap>('COMPONENT_MAP_TOKEN');
