/* eslint-disable jsdoc/require-jsdoc */
import { TestBed } from '@angular/core/testing';
import { describe, it, expect } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { SitecoreTranslateLoader } from './sitecore-translate-loader';

describe('SitecoreTranslateLoader', () => {
  it('getTranslation returns an empty object observable', async () => {
    TestBed.configureTestingModule({ providers: [SitecoreTranslateLoader] });
    const loader = TestBed.inject(SitecoreTranslateLoader);
    const result = await firstValueFrom(loader.getTranslation('fr'));
    expect(result).toEqual({});
  });
});
