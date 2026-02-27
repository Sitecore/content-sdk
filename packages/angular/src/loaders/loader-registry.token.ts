import { InjectionToken } from '@angular/core';
import type { LoaderFn } from './model';

export const LOADER_REGISTRY = new InjectionToken<Record<string, LoaderFn>>('LOADER_REGISTRY');
