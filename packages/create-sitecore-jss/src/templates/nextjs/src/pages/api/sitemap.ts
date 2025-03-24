import type { NextApiRequest, NextApiResponse } from 'next';
import scClient from 'lib/sitecore-client';

const sitemapApi = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<NextApiResponse | void> => {
  const {
    query: { id },
  } = req;

  return scClient.getSitemap(req, res, id as string);
};

export default sitemapApi;
