# Content SDK Angular sample - beta

This is a sample for pre-release of Content SDK Angular for Sitecore AI. It contains all the required components and pre-sets for the skate-park sample site in Sitecore and can serve as a good starting point for any custom implementation.
The functionality available in Content SDK Angular right now includes:
 - Basic rendering and field components
 - Initernalization support
 - Editing and Preview support
 - Multisite
 - Sitemap, robots.txt endpoints

What can you expect coming in the future ahead of the 1.0 release:
 - SXA Redirects support
 - More varied hosting options
 - Ongoing optimizations and bug fixes

## Deployment

### Deploying to Sitecore AI

The regular deployment to SAI follows the usual flow:
- Follow the prompts in the SAI Deploy portal
- Connect your GitHub repository with the Content SDK Angular sample

But, temporarily, we ask you to perform some additional actions post-deploy in your Editing Host instance:
- Go to the `Variables` section and specify the following environment variables:
  - CSDK_PUBLIC_SITECORE_EDGE_CONTEXT_ID=id-from-authoring-here
  - CSDK_PUBLIC_SITECORE_DEFAULT_SITE=your-site-name
  - CSDK_PUBLIC_SITECORE_DEFAULT_LANGUAGE=your-language
  - NG_TRUST_PROXY_HEADERS=X-FORWARDED-PORT,X-FORWARDED-PATH,X-FORWARDED-FOR,X-FORWARDED-HOST,X-FORWARDED-PROTO
  - NG_ALLOWED_HOSTS=*.sitecorecloud.io
- Redeploy the editing host

These variables are needed to ensure SAI backend infrastructure correctly sets up and uses your Angular sample for Pages editing and preview. They will be switched to be set automatically between now and the 1.0 release.

### Deploying to Netlify

Coming soon

### Deploying to Vercel

Coming soon
