import { InjectionToken } from '@angular/core';
import type { ComponentMap } from '../components/types';

/**
 * Injection token for the Sitecore component map.
 * Provide this at the application level via `provideSitecoreAngular` or
 * directly as `{ provide: SITECORE_COMPONENT_MAP, useValue: yourMap }`.
 * @public
 */
export const SITECORE_COMPONENT_MAP = new InjectionToken<ComponentMap>('SITECORE_COMPONENT_MAP');
