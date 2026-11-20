import { draftMode } from 'next/headers';
import { Suspense } from 'react';
import Bootstrap from 'src/Bootstrap';

type SiteLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ site: string }>;
};

export default function SiteLayout({ children, params }: SiteLayoutProps) {
  return (
    <>
      {/* Params are read inside Suspense so routes that are not prebuilt (such as the
          dynamic content tokens route) can render at request time */}
      <Suspense fallback={null}>
        <SiteBootstrap params={params} />
      </Suspense>
      {children}
    </>
  );
}

async function SiteBootstrap({ params }: Pick<SiteLayoutProps, 'params'>) {
  const { site } = await params;
  return <Bootstrap siteName={site} isPreviewMode={(await draftMode()).isEnabled} />;
}
