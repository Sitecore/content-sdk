export default async function listRoutesTool({ client, args }) {
  if (!client) throw new Error('Sitecore client not configured');
  const site = args.site || undefined;
  const languages = Array.isArray(args.languages) ? args.languages : undefined;
  const paths = await client.getPagePaths(site ? [site] : [], languages);
  return { routes: paths };
}
