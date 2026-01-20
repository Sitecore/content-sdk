import { draftMode } from 'next/headers';
import { Suspense } from 'react';
import Bootstrap from 'src/Bootstrap';

// Component that handles draft mode check (uncached data access)
async function SiteLayoutContent({ site, children }: { site: string; children: React.ReactNode }) {
  const { isEnabled } = await draftMode();

  return (
    <>
      <Bootstrap siteName={site} isPreviewMode={isEnabled} />
      {children}
    </>
  );
}

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ site: string }>;
}) {
  // Access uncached data first to satisfy Next.js 16 Cache Components requirements
  await draftMode();
  
  const { site } = await params;

  // Wrap the dynamic content in Suspense for Next.js 16 PPR compatibility
  return (
    <Suspense fallback={<>{children}</>}>
      <SiteLayoutContent site={site}>{children}</SiteLayoutContent>
    </Suspense>
  );
}
