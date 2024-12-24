import { EditingRenderMiddleware } from '@sitecore-jss/sitecore-jss-nextjs/editing';

/**
 * This Next.js API route is used to handle GET and POST requests from Sitecore editors.
 * GET requests are used with Metadata editing mode.
 * This route should match the `serverSideRenderingEngineEndpointUrl` in your Sitecore configuration,
 * which is set to "http://<rendering_host>/api/editing/render" by default (see the settings item under /sitecore/content/<your/site/path>/Settings/Site Grouping).
 *
 * For Metadata mode, the `EditingRenderMiddleware` will
 *  1. Extract data about the route we need to rendr from the Sitecore editor GET request
 *  2. Enable Next.js Preview Mode, passing the route data as preview data
 *  3. Redirect the request to the route, passing along the Preview Mode cookies.
 *     This allows retrieval of the editing data in preview context (via an `EditingDataService`) - see `SitecorePagePropsFactory`
 *  4. The redirected request will render the page with editing markup in place
 */

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '2mb',
    },
    responseLimit: false,
  },
};

// Wire up the EditingRenderMiddleware handler
const handler = new EditingRenderMiddleware().getHandler();

export default handler;
