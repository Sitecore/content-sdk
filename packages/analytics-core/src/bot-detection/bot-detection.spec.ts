import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { isbot } from 'isbot';
import {
  BOT_DETECTION_COOKIE,
  isBot,
  getBotCookieServerSide,
  getBotCookieClientSide,
} from './bot-detection';
import { getCookieServerSide } from '../utils/cookies/get-cookie-server-side';
import { getCookieValueClientSide } from '../utils/cookies/get-cookie-value-client-side';

jest.mock('isbot', () => ({
  isbot: jest.fn(),
}));

jest.mock('../utils/cookies/get-cookie-value-client-side.ts', () => ({
  getCookieValueClientSide: jest.fn(),
}));

jest.mock('../utils/cookies/get-cookie-server-side.ts', () => ({
  getCookieServerSide: jest.fn(),
}));

describe('BotDetection', () => {
  beforeEach(() => {
    jest.mocked(isbot).mockReset();
    jest.mocked(getCookieValueClientSide).mockReset();
    jest.mocked(getCookieServerSide).mockReset();
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

  describe('getBotCookieClientSide', () => {
    it('returns undefined when finds no cookie', () => {
      jest.mocked(getCookieValueClientSide).mockReturnValue('');
      Object.defineProperty(document, 'cookie', {
        configurable: true,
        value: '',
        writable: true,
      });

      expect(getBotCookieClientSide()).toBe('');
      expect(getCookieValueClientSide).toHaveBeenCalledWith(BOT_DETECTION_COOKIE);
    });

    it('returns the cookie value when finds the bot cookie', () => {
      jest.mocked(getCookieValueClientSide).mockReturnValue('1');
      Object.defineProperty(document, 'cookie', {
        configurable: true,
        value: `${BOT_DETECTION_COOKIE}=1`,
        writable: true,
      });

      expect(getBotCookieClientSide()).toBe('1');
      expect(getCookieValueClientSide).toHaveBeenCalledWith(BOT_DETECTION_COOKIE);
    });
  });

  describe('getBotCookieServerSide', () => {
    it('returns undefined when finds no cookie', () => {
      jest.mocked(getCookieServerSide).mockReturnValue(undefined);
      expect(getBotCookieServerSide('')).toBeUndefined();
      expect(getCookieServerSide).toHaveBeenCalledWith('', BOT_DETECTION_COOKIE);
    });
    
    it('returns the cookie value when finds the bot cookie', () => {
      jest.mocked(getCookieServerSide).mockReturnValue({ name: BOT_DETECTION_COOKIE, value: '1' });
      expect(getBotCookieServerSide('')).toBe('1');
      expect(getCookieServerSide).toHaveBeenCalledWith('', BOT_DETECTION_COOKIE);
    });
  });
});
