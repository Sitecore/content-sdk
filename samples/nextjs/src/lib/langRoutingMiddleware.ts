import { Middleware } from '@sitecore-content-sdk/nextjs/middleware';
import { NextRequest, NextResponse } from 'next/server';
import scConfig from 'sitecore.config';

const locales = ['en', 'nl-NL', 'nl'];

export class LangRoutingMiddleware extends Middleware {
  async handle(request: NextRequest, response: NextResponse): Promise<NextResponse> {
    const { pathname } = request.nextUrl;
    const pathnameHasLocale = locales.some(
      (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (pathnameHasLocale) return response;

    // Redirect if there is no locale
    const locale = scConfig.defaultLanguage;
    const newUrl = request.nextUrl.clone();
    newUrl.pathname = `/${locale}${pathname}`;
    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.rewrite(newUrl, response);
  }
}
