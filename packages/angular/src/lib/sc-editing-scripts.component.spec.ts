/* eslint-disable jsdoc/require-jsdoc */
import { PLATFORM_ID } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { LayoutServicePageState } from '@sitecore-content-sdk/content/layout';
import type { Page } from '@sitecore-content-sdk/content/client';
import { ScEditingScriptsComponent } from './sc-editing-scripts.component';
import { provideMockSitecoreContext, setMockContextPage } from '../testing/mock-sitecore-context';

const editingMocks = vi.hoisted(() => ({
  getContentSdkPagesClientData: vi.fn(
    (): Record<string, Record<string, unknown>> => ({
      'jss-hrz-editing': {},
    })
  ),
}));

vi.mock('@sitecore-content-sdk/content/editing', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@sitecore-content-sdk/content/editing')>();
  return {
    ...actual,
    getContentSdkPagesClientData: () => editingMocks.getContentSdkPagesClientData(),
  };
});

type Mode = 'normal' | 'preview' | 'editing' | 'designLibrary';

const makePage = (
  mode: Mode,
  ctx?: { clientScripts?: string[]; clientData?: Record<string, Record<string, unknown>> }
): Page =>
  ({
    locale: 'en',
    layout: {
      sitecore: {
        context: {
          clientScripts: ctx?.clientScripts,
          clientData: ctx?.clientData,
        },
        route: null,
      },
    },
    mode: {
      name:
        mode === 'editing'
          ? LayoutServicePageState.Edit
          : mode === 'preview'
          ? LayoutServicePageState.Preview
          : LayoutServicePageState.Normal,
      isNormal: mode === 'normal',
      isPreview: mode === 'preview',
      isEditing: mode === 'editing',
      isDesignLibrary: mode === 'designLibrary',
      designLibrary: { isVariantGeneration: false },
    },
  } as Page);

describe('ScEditingScriptsComponent', () => {
  let fixture: ComponentFixture<ScEditingScriptsComponent>;

  function setup() {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [ScEditingScriptsComponent],
      providers: provideMockSitecoreContext({
        extraProviders: [{ provide: PLATFORM_ID, useValue: 'server' }],
      }),
    });
  }

  function create(): ComponentFixture<ScEditingScriptsComponent> {
    fixture = TestBed.createComponent(ScEditingScriptsComponent);
    fixture.detectChanges();
    return fixture;
  }

  function scripts() {
    return Array.from(document.body.querySelectorAll('script')) as HTMLScriptElement[];
  }

  beforeEach(() => {
    editingMocks.getContentSdkPagesClientData.mockReturnValue({
      'jss-hrz-editing': {},
    });
    setup();
  });

  afterEach(() => {
    scripts().forEach((script) => script.remove());
  });

  it('should emit no <script> tags in normal mode', () => {
    setMockContextPage(makePage('normal'));
    create();
    expect(scripts().length).toBe(0);
  });

  it('should emit no <script> tags in preview mode', () => {
    setMockContextPage(makePage('preview'));
    create();
    expect(scripts().length).toBe(0);
  });

  it('should emit no <script> tags when there is no page', () => {
    create();
    expect(scripts().length).toBe(0);
  });

  it('should render layout clientScripts as <script src> entries in editing mode', () => {
    setMockContextPage(
      makePage('editing', {
        clientScripts: [
          'https://edge.sitecorecloud.io/horizon/v1/ckeditor.js',
          'https://edge.sitecorecloud.io/horizon/v1/chrome-bridge.js',
        ],
      })
    );
    create();
    const srcs = scripts()
      .map((s) => s.getAttribute('src'))
      .filter((v): v is string => !!v);
    expect(srcs).toContain('https://edge.sitecorecloud.io/horizon/v1/ckeditor.js');
    expect(srcs).toContain('https://edge.sitecorecloud.io/horizon/v1/chrome-bridge.js');
  });

  it('should always include the jss-hrz-editing marker as a clientData script in editing mode', () => {
    setMockContextPage(makePage('editing'));
    create();
    const marker = scripts().find((s) => s.id === 'jss-hrz-editing');
    expect(marker).toBeDefined();
    expect(marker?.getAttribute('type')).toBe('application/json');
  });

  it('should merge layout clientData with the Content SDK marker', () => {
    editingMocks.getContentSdkPagesClientData.mockReturnValue({
      'jss-hrz-editing': {},
      'my-editor-data': { foo: 'bar' },
    });
    setMockContextPage(
      makePage('editing', {
        clientData: { 'layout-editor-data': { from: 'layout' } },
      })
    );
    create();
    const ids = scripts().map((s) => s.id);
    expect(ids).toContain('layout-editor-data');
    expect(ids).toContain('my-editor-data');
    expect(ids).toContain('jss-hrz-editing');

    const csdkScript = scripts().find((s) => s.id === 'my-editor-data');
    expect(csdkScript?.getAttribute('type')).toBe('application/json');
    expect(csdkScript?.textContent).toContain('"foo":"bar"');
  });
});
