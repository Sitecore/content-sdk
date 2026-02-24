import { TestBed } from '@angular/core/testing';
import { SitecoreContextService } from './sitecore-context.service';
import { Page } from '@sitecore-content-sdk/content/client';

const mockPage = (overrides: Partial<Page['mode']> = {}): Page =>
  ({
    mode: { isEditing: false, isPreview: false, ...overrides },
    sitecore: { context: {}, route: null },
  } as unknown as Page);

describe('SitecoreContextService', () => {
  let service: SitecoreContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SitecoreContextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('page signal', () => {
    it('should default to null', () => {
      expect(service.page()).toBeNull();
    });

    it('should update when setPage is called', () => {
      const page = mockPage();
      service.setPage(page);
      expect(service.page()).toBe(page);
    });

    it('should overwrite previous page', () => {
      const page1 = mockPage();
      const page2 = mockPage({ isEditing: true });
      service.setPage(page1);
      service.setPage(page2);
      expect(service.page()).toBe(page2);
    });
  });

  describe('isEditing computed signal', () => {
    it('should return false when page is null', () => {
      expect(service.isEditing()).toBe(false);
    });

    it('should return false when page.mode.isEditing is false', () => {
      service.setPage(mockPage({ isEditing: false }));
      expect(service.isEditing()).toBe(false);
    });

    it('should return true when page.mode.isEditing is true', () => {
      service.setPage(mockPage({ isEditing: true }));
      expect(service.isEditing()).toBe(true);
    });
  });

  describe('isPreview computed signal', () => {
    it('should return false when page is null', () => {
      expect(service.isPreview()).toBe(false);
    });

    it('should return true when page.mode.isPreview is true', () => {
      service.setPage(mockPage({ isPreview: true }));
      expect(service.isPreview()).toBe(true);
    });
  });

});

