import { setCachedPageParams } from '@sitecore-content-sdk/nextjs';

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ site: string; locale: string }>;
}) {
  const { site, locale } = await params;

  // Update the cached page info with the current site and locale values.
  // This ensures the notFound page can access the correct site and locale information when rendered
  // without opting out of SSG by using functions like `headers()`.
  setCachedPageParams({ locale, site });

  return <>{children}</>;
}

