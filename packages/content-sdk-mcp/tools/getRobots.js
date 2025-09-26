export default async function getRobotsTool({ client, args }) {
  if (!client) throw new Error('Sitecore client not configured');
  return (await client.getRobots(args.site)) || '';
}
