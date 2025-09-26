export default async function getErrorPagesTool({ client, args }) {
  if (!client) throw new Error('Sitecore client not configured');
  return client.getErrorPages({ site: args.site || undefined, locale: args.locale || undefined });
}
