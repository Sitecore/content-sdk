/* eslint-disable jsdoc/require-jsdoc */
import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import type { Page } from '@sitecore-content-sdk/content/client';
import { LayoutServicePageState } from '@sitecore-content-sdk/content/layout';
import { SitecoreContextService } from './sitecore-context.service';

describe('SitecoreContextService', () => {
  let service: SitecoreContextService;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    service = TestBed.inject(SitecoreContextService);
  });

  it('should start with null page', () => {
    expect(service.page()).toBeNull();
  });

  it('should start with null dictionary', () => {
    expect(service.dictionary()).toBeNull();
  });

  it('should start with isEditing false', () => {
    expect(service.isEditing()).toBe(false);
  });

  it('should update page when setPage is called', () => {
    const page = {
      locale: 'en',
      layout: { sitecore: { context: {}, route: null } },
      mode: {
        name: LayoutServicePageState.Normal,
        isNormal: true,
        isPreview: false,
        isEditing: false,
        isDesignLibrary: false,
        designLibrary: { isVariantGeneration: false },
      },
    } as Page;

    service.setPage(page);
    expect(service.page()).toBe(page);
    expect(service.isEditing()).toBe(false);
  });

  it('should update dictionary when setDictionary is called', () => {
    const dictionary = { Welcome: 'Willkommen', 'Goodbye': 'Auf Wiedersehen' };

    service.setDictionary(dictionary);
    expect(service.dictionary()).toBe(dictionary);
  });

  it('should reflect editing mode from page', () => {
    const page = {
      locale: 'en',
      layout: { sitecore: { context: {}, route: null } },
      mode: {
        name: LayoutServicePageState.Edit,
        isNormal: false,
        isPreview: false,
        isEditing: true,
        isDesignLibrary: false,
        designLibrary: { isVariantGeneration: false },
      },
    } as Page;

    service.setPage(page);
    expect(service.isEditing()).toBe(true);
  });

  it('should allow clearing context with null', () => {
    const page = {
      locale: 'en',
      layout: { sitecore: { context: {}, route: null } },
      mode: {
        name: LayoutServicePageState.Normal,
        isNormal: true,
        isPreview: false,
        isEditing: false,
        isDesignLibrary: false,
        designLibrary: { isVariantGeneration: false },
      },
    } as Page;

    service.setPage(page);
    expect(service.page()).toBe(page);

    service.setPage(null);
    expect(service.page()).toBeNull();
    expect(service.isEditing()).toBe(false);
  });

  it('should allow clearing dictionary with null', () => {
    const dictionary = { Welcome: 'Willkommen' };

    service.setDictionary(dictionary);
    expect(service.dictionary()).toBe(dictionary);

    service.setDictionary(null);
    expect(service.dictionary()).toBeNull();
  });
});
