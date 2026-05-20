/* eslint-disable jsdoc/require-jsdoc */
import { Component } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { firstValueFrom } from 'rxjs';
import {
  provideTranslateService,
  provideTranslateLoader,
  TranslatePipe,
  TranslateService,
} from '@ngx-translate/core';
import { SitecoreContextService } from '../lib/sitecore-context.service';
import { SitecoreTranslateLoader } from './sitecore-translate-loader';

@Component({
  selector: 'test-translate-host',
  imports: [TranslatePipe],
  template: `<h1>{{ 'Welcome' | translate }}</h1>`,
})
class TestTranslateHostComponent {}

describe('SitecoreTranslateLoader', () => {
  let context: SitecoreContextService;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [TestTranslateHostComponent],
      providers: [
        provideTranslateService({
          loader: provideTranslateLoader(SitecoreTranslateLoader),
        }),
      ],
    });
    context = TestBed.inject(SitecoreContextService);
  });

  async function renderWelcome(
    dictionary: Record<string, string>
  ): Promise<ComponentFixture<TestTranslateHostComponent>> {
    context.setDictionary(dictionary);
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
});
