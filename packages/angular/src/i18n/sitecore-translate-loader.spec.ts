/* eslint-disable jsdoc/require-jsdoc */
import { Component } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { firstValueFrom } from 'rxjs';
import {
  provideTranslateService,
  provideTranslateLoader,
  TranslateLoader,
  TranslatePipe,
  TranslateService,
} from '@ngx-translate/core';
import { SitecoreTranslateLoader } from './sitecore-translate-loader';
import {
  provideMockSitecoreContext,
  setMockContextDictionary,
} from '../testing/mock-sitecore-context';

@Component({
  selector: 'test-translate-host',
  imports: [TranslatePipe],
  template: `<h1>{{ 'Welcome' | translate }}</h1>`,
})
class TestTranslateHostComponent {}

describe('SitecoreTranslateLoader', () => {
  beforeEach(() => {
    TestBed.resetTestingModule();
  });

  async function renderWelcome(
    dictionary: Record<string, string>
  ): Promise<ComponentFixture<TestTranslateHostComponent>> {
    TestBed.configureTestingModule({
      imports: [TestTranslateHostComponent],
      providers: [
        ...provideMockSitecoreContext(),
        provideTranslateService({
          loader: provideTranslateLoader(SitecoreTranslateLoader),
        }),
      ],
    });

    setMockContextDictionary(dictionary);

    const translate = TestBed.inject(TranslateService);
    translate.addLangs(['en']);
    translate.setDefaultLang('en');
    await firstValueFrom(translate.use('en'));

    const fixture = TestBed.createComponent(TestTranslateHostComponent);
    fixture.detectChanges();
    return fixture;
  }

  it('should allow rendering localized string from dictionary', async () => {
    const fixture = await renderWelcome({ Welcome: 'Willkommen' });

    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1?.textContent?.trim()).toBe('Willkommen');
  });

  it('should allow rendering original string when dictionary in context is empty', async () => {
    const fixture = await renderWelcome({});

    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1?.textContent?.trim()).toBe('Welcome');
  });

  it('should return an empty object from getTranslation when dictionary is not set', async () => {
    TestBed.configureTestingModule({
      providers: [
        ...provideMockSitecoreContext(),
        provideTranslateService({
          loader: provideTranslateLoader(SitecoreTranslateLoader),
        }),
      ],
    });

    const loader = TestBed.inject(TranslateLoader) as SitecoreTranslateLoader;
    const translations = await firstValueFrom(loader.getTranslation());
    expect(translations).toEqual({});
  });
});
