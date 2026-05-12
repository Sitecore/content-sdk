/* eslint-disable jsdoc/require-jsdoc */
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { Component, input } from '@angular/core';
import { ComponentRendering, RouteData } from '@sitecore-content-sdk/content/layout';
import { LayoutServicePageState } from '@sitecore-content-sdk/content/layout';
import type { Page } from '@sitecore-content-sdk/content/client';
import { ScPlaceholderComponent } from './sc-placeholder.component';
import { SITECORE_COMPONENT_MAP } from './tokens';
import type { ComponentMap } from '../components/types';
import { SitecoreContextService } from '../lib/sitecore-context.service';

@Component({
  selector: 'test-title',
  standalone: true,
  template: `<h1>{{ titleText() }}</h1>`,
})
class TitleComponent {
  readonly fields = input<{ [key: string]: unknown }>({});
  readonly params = input<{ [key: string]: string }>({});
  readonly rendering = input<ComponentRendering>();

  titleText = () => {
    const f = this.fields();
    const title = f?.['Title'] as { value: string } | undefined;
    return title?.value ?? '';
  };
}

@Component({
  selector: 'test-content',
  standalone: true,
  template: `<p>Content</p>`,
})
class ContentComponent {
  readonly fields = input<{ [key: string]: unknown }>({});
  readonly params = input<{ [key: string]: string }>({});
  readonly rendering = input<ComponentRendering>();
}

@Component({
  selector: 'test-passthrough',
  standalone: true,
  template: `<span>{{ tag() }}</span>`,
})
class PassThroughChildComponent {
  readonly fields = input<{ [key: string]: unknown }>({});
  readonly params = input<{ [key: string]: string }>({});
  readonly rendering = input<ComponentRendering>();
  readonly tag = input<string>('');
}

const makePage = (isEditing = false): Page =>
  ({
    locale: 'en',
    layout: { sitecore: { context: {}, route: null } },
    mode: {
      name: isEditing ? LayoutServicePageState.Edit : LayoutServicePageState.Normal,
      isNormal: !isEditing,
      isPreview: false,
      isEditing,
      isDesignLibrary: false,
      designLibrary: { isVariantGeneration: false },
    },
  }) as unknown as Page;

describe('ScPlaceholderComponent', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;
  let errorSpy: ReturnType<typeof vi.spyOn>;

  const componentMap: ComponentMap = new Map([
    ['Title', TitleComponent],
    ['ContentBlock', ContentComponent],
  ]);

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [ScPlaceholderComponent],
      providers: [{ provide: SITECORE_COMPONENT_MAP, useValue: componentMap }],
    });

    const ctx = TestBed.inject(SitecoreContextService);
    ctx.setPage(makePage());
  });

  afterEach(() => {
    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });

  function createFixture(rendering: ComponentRendering | RouteData, name: string): ComponentFixture<ScPlaceholderComponent> {
    const fixture = TestBed.createComponent(ScPlaceholderComponent);
    fixture.componentRef.setInput('rendering', rendering);
    fixture.componentRef.setInput('name', name);
    fixture.detectChanges();
    return fixture;
  }

  it('should render components from placeholder', () => {
    const rendering: RouteData = {
      name: 'route',
      placeholders: {
        main: [
          { componentName: 'Title', fields: { Title: { value: 'Hello' } } },
          { componentName: 'ContentBlock' },
        ],
      },
    };
    const fixture = createFixture(rendering, 'main');
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')?.textContent).toBe('Hello');
    expect(el.querySelector('p')?.textContent).toBe('Content');
  });

  it('should render missing component for unknown rendering', () => {
    const rendering: RouteData = {
      name: 'route',
      placeholders: {
        main: [{ componentName: 'DoesNotExist' }],
      },
    };
    const fixture = createFixture(rendering, 'main');
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('DoesNotExist');
    expect(el.textContent).toContain('missing');
  });

  it('should render nothing for empty placeholder', () => {
    const rendering: RouteData = {
      name: 'route',
      placeholders: { main: [] },
    };
    const fixture = createFixture(rendering, 'main');
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent?.trim()).toBe('');
  });

  it('should warn when placeholder not found', () => {
    const rendering: RouteData = {
      name: 'route',
      placeholders: { other: [] },
    };
    createFixture(rendering, 'main');
    expect(warnSpy).toHaveBeenCalled();
  });

  it('should render hidden rendering component', () => {
    const rendering: RouteData = {
      name: 'route',
      placeholders: {
        main: [{ componentName: 'Hidden Rendering' }],
      },
    };
    const fixture = createFixture(rendering, 'main');
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('hidden');
  });

  it('should set passThroughProps as extra inputs on child components', () => {
    const map: ComponentMap = new Map([['TagItem', PassThroughChildComponent]]);
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [ScPlaceholderComponent],
      providers: [{ provide: SITECORE_COMPONENT_MAP, useValue: map }],
    });
    const ctx = TestBed.inject(SitecoreContextService);
    ctx.setPage(makePage());

    const fixture = TestBed.createComponent(ScPlaceholderComponent);
    fixture.componentRef.setInput('rendering', {
      name: 'route',
      placeholders: { main: [{ componentName: 'TagItem' }] },
    });
    fixture.componentRef.setInput('name', 'main');
    fixture.componentRef.setInput('passThroughProps', { tag: 'from-parent' });
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('from-parent');
  });

  it('should pass merged fields and params to child components', () => {
    const rendering: RouteData = {
      name: 'route',
      placeholders: {
        main: [
          {
            componentName: 'Title',
            fields: { Title: { value: 'FromRendering' } },
            params: { style: 'bold' },
          },
        ],
      },
    };
    const fixture = createFixture(rendering, 'main');
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')?.textContent).toBe('FromRendering');
  });
});
