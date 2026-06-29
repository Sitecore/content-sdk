/**
 * This is a placeholder `[site]` segment used only for Next.js Cache Components build-time validation
 * when `generateStaticPaths` is false. Not a real Sitecore site — routes using this value
 * skip Edge fetches and render the static not-found fallback so `next build` can succeed
 * without a configured default site or content configured in Sitecore AI.
 *
 * @see https://nextjs.org/docs/messages/empty-generate-static-params
 */
export const BUILD_VALIDATION_SITE = '_DEFAULT_' as const;

export function isBuildValidationSite(site: string | undefined): boolean {
  return site === BUILD_VALIDATION_SITE;
}
