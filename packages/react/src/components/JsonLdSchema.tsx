import React, { JSX } from 'react';
import { getJsonLdSchema, type LayoutServiceContext } from '@sitecore-content-sdk/content/layout';

/**
 * Props for {@link JsonLdSchema}.
 * @public
 */
export interface JsonLdSchemaProps {
  /** Context node from a Sitecore layout response (for example `page.layout.sitecore.context`). */
  context?: LayoutServiceContext | null;
}

/**
 * Renders a single `<script type="application/ld+json">` tag containing all JSON-LD structured
 * data schemas from a Sitecore route (`sitecore.context.schemas`), serialized as a JSON array.
 * Renders nothing if there are no schemas. Framework-agnostic — the tag doesn't need to live
 * inside `<head>` for structured data to be discovered by crawlers, so it can be rendered anywhere
 * in the tree (e.g. nested inside `next/head`'s `<Head>` for Pages Router, or directly in a Next.js
 * App Router Server Component).
 * @param {JsonLdSchemaProps} props - Component props.
 * @public
 */
export const JsonLdSchema = ({ context }: JsonLdSchemaProps): JSX.Element | null => {
  const schema = getJsonLdSchema(context);

  if (!schema) {
    return null;
  }

  return (
    <script type={schema.type} dangerouslySetInnerHTML={{ __html: schema.innerHTML }} />
  );
};
