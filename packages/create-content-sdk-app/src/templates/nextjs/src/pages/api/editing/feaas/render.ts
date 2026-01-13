import { FEAASRenderProxy } from '@sitecore-content-sdk/nextjs/editing';

/**
 * This Next.js API route is used to handle GET requests from Sitecore Component Builder.
 *
 * The `FEAASRenderProxy` will:
 *  1. Enable Next.js Preview Mode.
 *  2. Redirect the request to the /feaas/render page.
 *  - If "feaasSrc" query parameter is provided, the page will render a FEAAS component.
 *  - The page provides all the registered FEAAS components.
 */

// Wire up the FEAASRenderProxy handler
const handler = new FEAASRenderProxy().getHandler();

export default handler;
