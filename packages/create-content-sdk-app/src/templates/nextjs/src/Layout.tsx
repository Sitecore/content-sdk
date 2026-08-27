/**
 * This Layout is needed for Starter Kit.
 */
import { JSX } from 'react';
import Head from 'next/head';
import { Placeholder, Field, PageMetadataFields, DesignLibrary, Page } from '@sitecore-content-sdk/nextjs';
import Scripts from 'src/Scripts';
import SitecoreStyles from 'src/components/content-sdk/SitecoreStyles';

interface LayoutProps {
  page: Page;
}

interface RouteFields extends PageMetadataFields {
  [key: string]: unknown;
  Title?: Field;
}

// Open Graph types that define a creation-time meta tag, and its exact property name per the Open Graph protocol
const OG_CREATION_TIME_PROPERTY: Record<string, string> = {
  article: 'article:published_time',
  book: 'book:release_date',
  'music.album': 'music:release_date',
  'video.movie': 'video:release_date',
  'video.episode': 'video:release_date',
};

const Layout = ({ page }: LayoutProps): JSX.Element => {
  const { layout, mode } = page;
  const { route } = layout.sitecore;
  const fields = route?.fields as RouteFields;
  const mainClassPageEditing = mode.isEditing ? 'editing-mode' : 'prod-mode';

  const title = fields?.Title?.value?.toString() || 'Page';
  const metaTitle = fields?.baseMetadataTitle?.value;
  const description = fields?.baseMetadataDescription?.value;
  const keywords = fields?.baseMetadataKeywords?.value;
  const author = fields?.baseMetadataAuthor?.value;
  const ogTitle = fields?.baseOgTitle?.value;
  const ogDescription = fields?.baseOgDescription?.value;
  const ogImage = fields?.baseOgImage?.value;
  const ogImageSrc = ogImage?.src;
  const ogType = fields?.baseOgType?.value;
  const creationTimeProperty = ogType ? OG_CREATION_TIME_PROPERTY[ogType] : undefined;
  const creationTime = creationTimeProperty ? route?.published : undefined;
  // article is the only Open Graph type with a distinct update-time tag
  const modifiedTime = ogType === 'article' ? route?.updated : undefined;

  return (
    <>
      <Scripts />
      <SitecoreStyles layoutData={layout} />
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
        {metaTitle && <meta name="title" content={metaTitle} />}
        {description && <meta name="description" content={description} />}
        {keywords && <meta name="keywords" content={keywords} />}
        {author && <meta name="author" content={author} />}
        {ogTitle && <meta property="og:title" content={ogTitle} />}
        {ogDescription && <meta property="og:description" content={ogDescription} />}
        {ogImageSrc && <meta property="og:image" content={ogImageSrc} />}
        {ogImageSrc && ogImage?.width && <meta property="og:image:width" content={ogImage.width} />}
        {ogImageSrc && ogImage?.height && <meta property="og:image:height" content={ogImage.height} />}
        {ogImageSrc && ogImage?.alt && <meta property="og:image:alt" content={ogImage.alt} />}
        {ogType && <meta property="og:type" content={ogType} />}
        {creationTimeProperty && creationTime && <meta property={creationTimeProperty} content={creationTime} />}
        {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      </Head>

      {/* root placeholder for the app, which we add components to using route data */}
      <div className={mainClassPageEditing}>
        {mode.isDesignLibrary ? (
          <DesignLibrary />
        ) : (
          <>
            <header>
              <div id="header">
                {route && <Placeholder name="headless-header" rendering={route} />}
              </div>
            </header>
            <main>
              <div id="content">
                {route && <Placeholder name="headless-main" rendering={route} />}
              </div>
            </main>
            <footer>
              <div id="footer">
                {route && <Placeholder name="headless-footer" rendering={route} />}
              </div>
            </footer>
          </>
        )}
      </div>
    </>
  );
};

export default Layout;
