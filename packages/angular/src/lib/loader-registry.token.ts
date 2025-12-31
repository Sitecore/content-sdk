import { InjectionToken } from '@angular/core';
import type { LoaderFn } from './types';

export const LOADER_REGISTRY = new InjectionToken<Record<string, LoaderFn>>('LOADER_REGISTRY');
