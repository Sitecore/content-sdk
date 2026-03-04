import * as infer from './infer';
import { jest, expect } from '@jest/globals';

describe('Test infer class', () => {
  const { window } = global;
  describe('language', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('should return the language code in the html lang attribute if exists and in the correct format', async () => {
      jest.spyOn(document.documentElement, 'lang', 'get').mockImplementation(() => 'en-US');
      const language = infer.language();

      expect(language).toEqual('EN');
    });

    it('should return undefined language if html lang attribute length is less than 2', async () => {
      jest.spyOn(document.documentElement, 'lang', 'get').mockImplementation(() => 'e');
      const language = infer.language();

      expect(language).toEqual(undefined);
    });

    it('should return undefined language if window is not defined', async () => {
      jest.spyOn(document.documentElement, 'lang', 'get').mockImplementation(() => 'en-US');
      jest.spyOn(global, 'window', 'get').mockReturnValueOnce(undefined as any);

      const language = infer.language();

      expect(language).toEqual(undefined);
    });
  });

  describe('page', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('should return "Home Page" if page not passed in the eventData and pathname is /', async () => {
      Object.defineProperty(window, 'location', {
        value: {
          pathname: '/',
        },
        writable: true,
      });
      const pageName = infer.pageName();

      expect(pageName).toEqual('Home Page');
    });

    it('should return "about" if not passed in the eventData and pathname is /about', async () => {
      Object.defineProperty(window, 'location', {
        value: {
          pathname: '/about',
        },
        writable: true,
      });
      const pageName = infer.pageName();

      expect(pageName).toEqual('about');
    });

    it('should return empty string if window is undefined', async () => {
      jest.spyOn(global, 'window', 'get').mockReturnValueOnce(undefined as any);
      const pageName = infer.pageName();

      expect(pageName).toBe('');
    });
  });
});
