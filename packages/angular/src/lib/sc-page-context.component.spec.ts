/* eslint-disable jsdoc/require-jsdoc */
import { Component, signal } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { provideTranslateLoader, provideTranslateService } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { ScPageContextComponent } from './sc-page-context.component';
import { SitecoreContextService } from './sitecore-context.service';
import { SitecoreTranslateLoader } from '../i18n/sitecore-translate-loader';
import type { Page } from '@sitecore-content-sdk/content/client';

@Component({
  standalone: true,
  imports: [ScPageContextComponent],
  template: `
    <sc-page-context [data]="ctx()">
      <span id="x">ok</span>
    </sc-page-context>
  `,
})
class Host {
  readonly ctx = signal<{ page: Page; dictionary?: Record<string, string> }>({
    page: { locale: 'en' } as Page,
  });
}

describe('ScPageContextComponent', () => {
  let fixture: ComponentFixture<Host>;
  let context: SitecoreContextService;
  let translate: TranslateService;

  beforeEach(async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [Host, ScPageContextComponent],
      providers: [
        ...provideTranslateService({
          fallbackLang: 'en',
          loader: provideTranslateLoader(SitecoreTranslateLoader),
        }),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(Host);
    context = TestBed.inject(SitecoreContextService);
    translate = TestBed.inject(TranslateService);
    vi.spyOn(translate, 'use').mockReturnValue({ subscribe: () => ({ unsubscribe: () => {} }) } as never);
  });

  it('sets page on SitecoreContextService', () => {
    const page = { locale: 'da' } as Page;
    fixture.componentInstance.ctx.set({ page });
    fixture.detectChanges();
    expect(context.page()).toBe(page);
  });

  it('pushes dictionary into TranslateService for the page locale', () => {
    const setTranslation = vi.spyOn(translate, 'setTranslation');
    const page = { locale: 'fr' } as Page;
    fixture.componentInstance.ctx.set({
      page,
      dictionary: { hello: 'bonjour' },
    });
    fixture.detectChanges();
    expect(setTranslation).toHaveBeenCalledWith('fr', { hello: 'bonjour' }, false);
  });
});
