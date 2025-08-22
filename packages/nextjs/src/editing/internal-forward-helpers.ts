import type { IncomingMessage, ServerResponse } from 'http';
import { performance } from 'perf_hooks';
import { EDITING_INTERNAL_HOST_URL, EDITING_INTERNAL_HOST_ALLOWED_PROTOCOLS } from './constants';

export function sanitizeRoute(route: string): string {
  if (!route) return '/';
  try { new URL(route); throw new Error('Absolute URLs are not allowed.'); } catch { /* relative is ok */ }
  return ('/' + route).replace(/\/{2,}/g, '/');
}

export function buildInternalBaseURL(req: IncomingMessage): URL {
  const cfg = EDITING_INTERNAL_HOST_URL?.trim();
  if (cfg) {
    const u = new URL(cfg);
    if (!EDITING_INTERNAL_HOST_ALLOWED_PROTOCOLS.has(u.protocol)) {
      throw new Error(`Unsupported protocol: ${u.protocol}`);
    }
    return u;
  }
  const proto = (req.headers['x-forwarded-proto'] as string) || 'http';
  const host  = (req.headers['x-forwarded-host'] as string) || req.headers.host || 'localhost:3000';
  return new URL(`${proto}://${host}`);
}

export function extractPreviewCookiePairs(setCookieHeader: string | string[] | number | undefined): string {
  if (!setCookieHeader) return '';
  const arr = Array.isArray(setCookieHeader) ? setCookieHeader : [String(setCookieHeader)];
  return arr.map((sc) => sc.split(';', 1)[0]).filter(Boolean).join('; ');
}

export function mergeCookieHeaders(a: string, b: string): string {
  if (!a && !b) return '';
  const map = new Map<string, string>();
  for (const src of [a, b]) {
    if (!src) continue;
    for (const token of src.split(';')) {
      const t = token.trim(); if (!t) continue;
      const i = t.indexOf('='); if (i === -1) continue;
      map.set(t.slice(0, i).trim(), t);
    }
  }
  return Array.from(map.values()).join('; ');
}

export function setCspFrameAncestors(res: ServerResponse, allowedOrigins: string[]) {
  const origins = Array.from(new Set([`'self'`, ...allowedOrigins])).join(' ');
  res.setHeader('Content-Security-Policy', `frame-ancestors ${origins};`);
}

export function setServerTiming(res: ServerResponse, name: string, durMs: number) {
  const existing = res.getHeader('Server-Timing');
  const value = `${name};dur=${Math.round(durMs)}`;
  res.setHeader('Server-Timing', existing ? (Array.isArray(existing) ? [...existing, value] : [String(existing), value]) : value);
}

export async function forwardInternally(opts: {
  req: IncomingMessage;
  res: ServerResponse;
  routePath: string;
  previewSetCookies: string | string[] | number | undefined;
  passThroughHeaders?: string[];
  extraQuery?: Record<string, string | undefined>;
}): Promise<Response> {
  const { req, res, routePath, previewSetCookies, passThroughHeaders = [], extraQuery = {} } = opts;

  const base = buildInternalBaseURL(req);
  const path = sanitizeRoute(routePath);
  const url  = new URL(path, base);
  for (const [k, v] of Object.entries(extraQuery)) if (v) url.searchParams.set(k, v);

  const previewPairs   = extractPreviewCookiePairs(previewSetCookies);
  const incomingCookie = (req.headers.cookie as string) || '';
  const cookieHeader   = mergeCookieHeaders(incomingCookie, previewPairs);

  const headers = new Headers();
  if (cookieHeader) headers.set('cookie', cookieHeader);
  if (req.headers['accept'])           headers.set('accept', String(req.headers['accept']));
  if (req.headers['accept-language'])  headers.set('accept-language', String(req.headers['accept-language']));
  if (req.headers['user-agent'])       headers.set('user-agent', String(req.headers['user-agent']));
  for (const h of passThroughHeaders) {
    const v = req.headers[h.toLowerCase()];
    if (typeof v === 'string') headers.set(h, v);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  const t0 = performance.now();
  try {
    const resp = await fetch(url.toString(), { method: 'GET', headers, redirect: 'follow', signal: controller.signal });
    setServerTiming(res, 'internal-forward', performance.now() - t0);
    return resp;
  } finally { clearTimeout(timeout); }
}

export function scrubOutgoingSetCookie(res: ServerResponse) {
  if (res.getHeader('Set-Cookie')) res.removeHeader('Set-Cookie');
}
