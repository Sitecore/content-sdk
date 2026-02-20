import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SitecoreProviderComponent } from './sitecore-provider.component';
import { SitecoreContextService } from '../../services/sitecore-context.service';
import { ComponentMapService } from '../../services/component-map.service';
import { Page } from '@sitecore-content-sdk/content/client';

const makePage = (isEditing = false): Page =>
  ({ mode: { isEditing, isPreview: false }, sitecore: { context: {}, route: null } } as unknown as Page);

describe('SitecoreProviderComponent', () => {
  let fixture: ComponentFixture<SitecoreProviderComponent>;
  let contextService: SitecoreContextService;
  let componentMapService: ComponentMapService;

  function createComponent(page: Page) {
    fixture = TestBed.createComponent(SitecoreProviderComponent);
    fixture.componentRef.setInput('page', page);
    fixture.detectChanges();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SitecoreProviderComponent],
    });
    contextService = TestBed.inject(SitecoreContextService);
    componentMapService = TestBed.inject(ComponentMapService);
  });

  it('should render without errors', () => {
    createComponent(makePage());
    expect(fixture.nativeElement).toBeTruthy();
  });

  it('should propagate page to SitecoreContextService', () => {
    const page = makePage(true);
    createComponent(page);
    expect(contextService.page()).toBe(page);
    expect(contextService.isEditing()).toBe(true);
  });

  it('should propagate componentMap to ComponentMapService', () => {
    @Component({ selector: 'sc-hero', standalone: true, template: '' })
    class HeroComponent {}
    const page = makePage();
    fixture = TestBed.createComponent(SitecoreProviderComponent);
    fixture.componentRef.setInput('page', page);
    fixture.componentRef.setInput('componentMap', new Map([['Hero', HeroComponent]]));
    fixture.detectChanges();
    expect(componentMapService.getComponent('Hero')).toBe(HeroComponent);
  });

  it('should update context when page input changes', () => {
    const page1 = makePage(false);
    createComponent(page1);
    expect(contextService.page()).toBe(page1);

    const page2 = makePage(true);
    fixture.componentRef.setInput('page', page2);
    fixture.detectChanges();
    expect(contextService.page()).toBe(page2);
  });
});
