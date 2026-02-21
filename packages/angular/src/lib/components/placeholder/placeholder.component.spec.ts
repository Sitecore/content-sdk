import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlaceholderComponent } from './placeholder.component';
import { ComponentMapService } from '../../services/component-map.service';
import { SitecoreContextService } from '../../services/sitecore-context.service';
import { ComponentRendering } from '@sitecore-content-sdk/content/layout';
import { Page } from '@sitecore-content-sdk/content/client';

@Component({
  selector: 'sc-hero',
  standalone: true,
  template: '<div class="hero">Hero</div>',
})
class HeroComponent {
  readonly rendering = input<ComponentRendering>({} as ComponentRendering);
}

const makePage = (isEditing = false): Page =>
  ({ mode: { isEditing, isPreview: false }, sitecore: { context: {}, route: null } } as unknown as Page);

const makeRendering = (
  placeholderName: string,
  components: Array<{ componentName: string; uid?: string }>
): ComponentRendering => ({
  componentName: 'Root',
  placeholders: {
    [placeholderName]: components.map((c, i) => ({
      componentName: c.componentName,
      uid: c.uid ?? `uid-${i}`,
    })),
  },
});

describe('PlaceholderComponent', () => {
  let fixture: ComponentFixture<PlaceholderComponent>;
  let componentMapService: ComponentMapService;
  let contextService: SitecoreContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [PlaceholderComponent] });
    componentMapService = TestBed.inject(ComponentMapService);
    contextService = TestBed.inject(SitecoreContextService);
  });

  /**
   *
   * @param name
   * @param rendering
   */
  function createComponent(name: string, rendering: ComponentRendering) {
    fixture = TestBed.createComponent(PlaceholderComponent);
    fixture.componentRef.setInput('name', name);
    fixture.componentRef.setInput('rendering', rendering);
    fixture.detectChanges();
  }

  it('should render nothing when placeholder is empty', () => {
    createComponent('jss-main', makeRendering('jss-main', []));
    const outlet = fixture.nativeElement.querySelector('.hero');
    expect(outlet).toBeNull();
  });

  it('should render a registered component', () => {
    componentMapService.register('Hero', HeroComponent);
    createComponent('jss-main', makeRendering('jss-main', [{ componentName: 'Hero' }]));
    const hero = fixture.nativeElement.querySelector('.hero');
    expect(hero).not.toBeNull();
  });

  it('should render MissingComponent for unknown component name', () => {
    createComponent('jss-main', makeRendering('jss-main', [{ componentName: 'UnknownWidget' }]));
    const missing = fixture.nativeElement.querySelector('sc-missing-component');
    expect(missing).not.toBeNull();
  });

  it('should render multiple components in order', () => {
    componentMapService.register('Hero', HeroComponent);
    const rendering = makeRendering('jss-main', [
      { componentName: 'Hero', uid: 'h1' },
      { componentName: 'Hero', uid: 'h2' },
    ]);
    createComponent('jss-main', rendering);
    const heroes = fixture.nativeElement.querySelectorAll('.hero');
    expect(heroes.length).toBe(2);
  });

  it('should show empty placeholder div in edit mode when no renderings', () => {
    contextService.setPage(makePage(true));
    createComponent('jss-main', makeRendering('jss-main', []));
    const empty = fixture.nativeElement.querySelector('.sc-jss-empty-placeholder');
    expect(empty).not.toBeNull();
  });

  it('should not show empty placeholder div outside edit mode', () => {
    contextService.setPage(makePage(false));
    createComponent('jss-main', makeRendering('jss-main', []));
    const empty = fixture.nativeElement.querySelector('.sc-jss-empty-placeholder');
    expect(empty).toBeNull();
  });
});
