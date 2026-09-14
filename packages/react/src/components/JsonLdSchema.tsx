import React, { JSX } from 'react';
import { getJsonLdSchemas } from '@sitecore-content-sdk/content/layout';
import { type Page } from '@sitecore-content-sdk/content/client';

/**
 * Props for {@link JsonLdSchema}.
 * @public
 */
export interface JsonLdSchemaProps {
  /** Page object (for example `props.page` on a Sitecore page component). */
  page?: Page | null;
}

/**
 * Renders a single `<script type="application/ld+json">` tag containing all JSON-LD structured
 * data schemas from a Sitecore route (`sitecore.context.schemas`), serialized as a JSON array.
 * Renders nothing if there are no schemas, or if the page isn't in normal (rendering) mode — for
 * example while in Pages/Experience Editor or Preview, so structured data isn't injected around
 * unpublished/editing chrome. Framework-agnostic — the tag doesn't need to live inside `<head>`
 * for structured data to be discovered by crawlers, so it can be rendered anywhere in the tree
 * (e.g. nested inside `next/head`'s `<Head>` for Pages Router, or directly in a Next.js App
 * Router Server Component).
 * @param {JsonLdSchemaProps} props - Component props.
 * @public
 */
export const JsonLdSchema = ({ page }: JsonLdSchemaProps): JSX.Element | null => {
  if (!page?.mode.isNormal) {
    return null;
  }

  const schema = getJsonLdSchemas(page.layout?.sitecore?.context?.schemas);

  if (!schema) {
    return null;
  }

  return <script type={schema.type} dangerouslySetInnerHTML={{ __html: schema.innerHTML }} />;
};
