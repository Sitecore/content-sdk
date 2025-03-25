﻿import type { NextApiRequest, NextApiResponse } from 'next';
import scClient from 'lib/sitecore-client';

const sitemapApi = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const { id } = req.query;

  try {
    await scClient.getSiteMap(req, res, id as string);
  } catch (error) {
    if (error instanceof Error && error.message === 'REDIRECT_404') {
      res.redirect('/404');
      return;
    }
    res.status(500).end('Internal Server Error');
  }
};

export default sitemapApi;
