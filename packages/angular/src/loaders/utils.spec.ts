import { RedirectCommand, Router } from '@angular/router';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { applyRedirect, extractRequestContext } from './utils';

describe('applyRedirect', () => {
  let mockRouter: { parseUrl: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockRouter = {
      parseUrl: vi.fn((url: string) => ({ toString: () => url })),
    };
  });

  it('returns RedirectCommand for internal path', () => {
    const result = applyRedirect(mockRouter as unknown as Router, '/foo');
    expect(result).toBeInstanceOf(RedirectCommand);
    expect(mockRouter.parseUrl).toHaveBeenCalledWith('/foo');
  });

  it('returns void and calls window.location.assign for external URL', () => {
    const assignSpy = vi.fn();
    const originalWindow = globalThis.window;
    (
      globalThis as unknown as { window: { location: { assign: ReturnType<typeof vi.fn> } } }
    ).window = {
      location: { assign: assignSpy },
    };

    const result = applyRedirect(mockRouter as unknown as Router, 'https://example.com/path');
    expect(result).toBeUndefined();
    expect(assignSpy).toHaveBeenCalledWith('https://example.com/path');
    expect(mockRouter.parseUrl).not.toHaveBeenCalled();

    (globalThis as unknown as { window: typeof originalWindow }).window = originalWindow;
  });

  it('treats http URL as external', () => {
    const assignSpy = vi.fn();
    const originalWindow = globalThis.window;
    (
      globalThis as unknown as { window: { location: { assign: ReturnType<typeof vi.fn> } } }
    ).window = {
      location: { assign: assignSpy },
    };

    const result = applyRedirect(mockRouter as unknown as Router, 'http://example.com');
    expect(result).toBeUndefined();
    expect(assignSpy).toHaveBeenCalledWith('http://example.com');

    (globalThis as unknown as { window: typeof originalWindow }).window = originalWindow;
  });

  it('does not throw when window is undefined (SSR) and location is external', () => {
    const originalWindow = globalThis.window;
    try {
      delete (globalThis as unknown as { window?: unknown }).window;
      const result = applyRedirect(mockRouter as unknown as Router, 'https://example.com');
      expect(result).toBeUndefined();
    } finally {
      (globalThis as unknown as { window: typeof originalWindow }).window = originalWindow;
    }
  });
});

describe('extractRequestContext', () => {
  it('extracts hostname, headers, cookies, and query from Fetch API Request', () => {
    const req = new Request('https://example.com:8080/path?foo=bar&baz=qux&foo=dup', {
      headers: {
        'content-type': 'application/json',
        cookie: 'session=abc123; theme=dark',
      },
    });
    const ctx = extractRequestContext(req);
    expect(ctx.hostname).toBe('example.com');
    expect(ctx.headers).toEqual(
      expect.objectContaining({
        'content-type': 'application/json',
        cookie: 'session=abc123; theme=dark',
      })
    );
    expect(ctx.cookies).toEqual({ session: 'abc123', theme: 'dark' });
    expect(ctx.query).toEqual({
      foo: ['bar', 'dup'],
      baz: 'qux',
    });
  });

  it('returns empty cookies when Request has no cookie header', () => {
    const req = new Request('https://example.com/', { headers: {} });
    const ctx = extractRequestContext(req);
    expect(ctx.cookies).toEqual({});
  });

  it('passes through headers, cookies, and query from Express-like request', () => {
    const expressReq = {
      headers: { 'x-custom': 'value', cookie: 'a=1' },
      cookies: { a: '1', b: '2' },
      query: { page: '1', sort: 'asc' },
    };
    const ctx = extractRequestContext(expressReq);
    expect(ctx.headers).toEqual({ 'x-custom': 'value', cookie: 'a=1' });
    expect(ctx.cookies).toEqual({ a: '1', b: '2' });
    expect(ctx.query).toEqual({ page: '1', sort: 'asc' });
  });

  it('handles Express-like request with minimal fields', () => {
    const ctx = extractRequestContext({});
    expect(ctx.headers).toBeUndefined();
    expect(ctx.cookies).toBeUndefined();
    expect(ctx.query).toBeUndefined();
  });
});
