/* eslint-disable jsdoc/require-jsdoc */
import { Component, signal } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { LocalePathPipe } from './locale-path.pipe';
import { SITECORE_CONFIG_TOKEN } from '../lib/tokens';
import { SitecoreContextService } from '../lib/sitecore-context.service';
import type { SitecoreAngularConfig } from '../config/models';
import type { Page } from '@sitecore-content-sdk/content/client';

@Component({
  standalone: true,
  imports: [LocalePathPipe],
  template: `<span id="p">{{ path() | localePath }}</span>`,
})
class Host {
  readonly path = signal('/about');
}

describe('LocalePathPipe', () => {
  let fixture: ComponentFixture<Host>;
  let context: SitecoreContextService;

  function bootstrap(config: Partial<SitecoreAngularConfig>) {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [Host],
      providers: [
        {
          provide: SITECORE_CONFIG_TOKEN,
          useValue: {
            defaultLanguage: 'en',
            locales: ['en', 'fr'],
            ...config,
          } as SitecoreAngularConfig,
        },
      ],
    });
    fixture = TestBed.createComponent(Host);
    context = TestBed.inject(SitecoreContextService);
  }

  beforeEach(() => {
    bootstrap({});
  });

  it('returns canonical path when locale is default', () => {
    context.setPage({ locale: 'en' } as Page);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#p')?.textContent).toBe('/about');
  });

  it('prefixes path when active locale is not default', () => {
    context.setPage({ locale: 'fr' } as Page);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#p')?.textContent).toBe('/fr/about');
  });
});
