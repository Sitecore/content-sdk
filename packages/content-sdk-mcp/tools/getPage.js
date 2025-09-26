export default async function getPageTool({ client, args }) {
  if (!client) throw new Error('Sitecore client not configured');
  return client.getPage(args.path, {
    site: args.site || undefined,
    locale: args.locale || undefined,
  });
}
