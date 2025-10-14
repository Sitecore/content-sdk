import { Suspense } from 'react';
import Bootstrap from 'src/Bootstrap';

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ site: string }>;
}) {
  const { site } = await params;

  return (
    <>
      <Suspense fallback={null}>
        <Bootstrap siteName={site} />
      </Suspense>
      {children}
    </>
  );
}
