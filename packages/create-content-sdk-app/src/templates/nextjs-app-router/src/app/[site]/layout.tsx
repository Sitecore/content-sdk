import { draftMode } from 'next/headers';
import { Suspense } from 'react';
import Bootstrap from 'src/Bootstrap';

// Part of layout component that handles dynamic data, like the `draftMode()` call.
// This component is wrapped in Suspense to enable Next.js 16 Partial Prerendering (PPR),
// which allows streaming dynamic content while keeping static parts prerendered.
// This pattern also works seamlessly when Cache Components is enabled.
async function DynamicLayoutContent({ site, children }: { site: string; children: React.ReactNode }) {
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
  const { site } = await params;

  // Wrap dynamic content in Suspense to enable Next.js 16 Partial Prerendering (PPR).
  // PPR allows streaming dynamic content while keeping static parts prerendered for better performance.
  return (
    <Suspense fallback={<>{children}</>}>
      <DynamicLayoutContent site={site}>{children}</DynamicLayoutContent>
    </Suspense>
  );
}
