import { cache } from 'react';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPageMetadata, getPersonalizeTokens } from '@sitecore-content-sdk/nextjs';
import client from 'src/lib/sitecore-client';
import Layout from 'src/Layout';
import Providers from 'src/Providers';
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

type PageProps = {
  params: Promise<{ site: string; locale: string; path?: string[] }>;
};

// PersonalizeProxy rewrites requests that carry dynamic content tokens (visitor values from
// Personalize) to this route (URL segment `_sctokens`), so they render per request.
// Every other request is served by ../[[...path]].
export const dynamic = 'force-dynamic';

// One Sitecore request per render, shared by the page and its metadata
const getTokenPage = cache(async (site: string, locale: string, path: string) =>
  client.getPage(path, { site, locale, tokens: getPersonalizeTokens(await headers()) })
);

export default async function Page({ params }: PageProps) {
  const { site, locale, path } = await params;

  // Set site and locale to be available in src/i18n/request.ts for fetching the dictionary
  setRequestLocale(`${site}_${locale}`);

  const page = await getTokenPage(site, locale, (path ?? []).join('/'));
  if (!page) {
    notFound();
  }

  return (
    <NextIntlClientProvider>
      <Providers page={page}>
        <Layout page={page} />
      </Providers>
    </NextIntlClientProvider>
  );
}

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { site, locale, path } = await params;
  const page = await getTokenPage(site, locale, (path ?? []).join('/'));
  return getPageMetadata(page?.layout.sitecore.route);
};
