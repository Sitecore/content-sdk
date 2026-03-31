import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { getCookie } from '@sitecore-content-sdk/analytics-core/utils';
import { isbot } from 'isbot';
import { BOT_DETECTION_COOKIE, getBotCookie, isBot, isBrowserEnvironment } from './bot-detection';

jest.mock('isbot', () => ({
  isbot: jest.fn(),
}));

jest.mock('@sitecore-content-sdk/analytics-core/utils', () => ({
  getCookie: jest.fn(),
}));

jest.mock('./bot-detection', () => {
  const original = jest.requireActual('./bot-detection') as typeof import('./bot-detection');
  return {
    ...original,
    isBrowserEnvironment: jest.fn().mockImplementation(original.isBrowserEnvironment),
  };
});

describe('BotDetection', () => {
  beforeEach(() => {
    jest.mocked(isbot).mockReset();
    jest.mocked(getCookie).mockReset();
  });

  describe('isBot', () => {
    it('delegates to isbot and returns its boolean result', () => {
      jest.mocked(isbot).mockReturnValue(true);
      expect(isBot('Mozilla/5.0')).toBe(true);
      expect(isbot).toHaveBeenCalledTimes(1);
      expect(isbot).toHaveBeenCalledWith('Mozilla/5.0');
    });

    it('returns false when isbot returns false', () => {
      jest.mocked(isbot).mockReturnValue(false);
      expect(isBot('Mozilla/5.0')).toBe(false);
      expect(isbot).toHaveBeenCalledWith('Mozilla/5.0');
    });

    it('passes undefined through to isbot', () => {
      jest.mocked(isbot).mockReturnValue(false);
      expect(isBot(undefined)).toBe(false);
      expect(isbot).toHaveBeenCalledWith(undefined);
    });

    it('passes null through to isbot', () => {
      jest.mocked(isbot).mockReturnValue(false);
      expect(isBot(null)).toBe(false);
      expect(isbot).toHaveBeenCalledWith(null);
    });
  });

  describe('isBrowserEnvironment', () => {
    it('is true in jsdom where document is defined', () => {
      expect(isBrowserEnvironment()).toBe(true);
    });
  });

  describe('getBotCookie', () => {
    it('returns undefined when not in browser environment', () => {
      jest.mocked(isBrowserEnvironment).mockReturnValue(false);
      expect(getBotCookie()).toBeUndefined();
    });

    it('returns undefined when getCookie finds no cookie', () => {
      jest.mocked(getCookie).mockReturnValue(undefined);
      Object.defineProperty(document, 'cookie', {
        configurable: true,
        value: '',
        writable: true,
      });

      expect(getBotCookie()).toBeUndefined();
      expect(getCookie).toHaveBeenCalledWith('', BOT_DETECTION_COOKIE);
    });

    it('returns the cookie value when getCookie finds the bot cookie', () => {
      jest.mocked(getCookie).mockReturnValue({ name: BOT_DETECTION_COOKIE, value: '1' });
      Object.defineProperty(document, 'cookie', {
        configurable: true,
        value: `${BOT_DETECTION_COOKIE}=1`,
        writable: true,
      });

      expect(getBotCookie()).toBe('1');
      expect(getCookie).toHaveBeenCalledWith(`${BOT_DETECTION_COOKIE}=1`, BOT_DETECTION_COOKIE);
    });
  });
});
