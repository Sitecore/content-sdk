chai-spies - doesn't expose ESM version, so had to be removed and sinon is reused
es modules can't be stubbed using sinon anymore
removed proxyquire and replaced with testdouble, since proxyquire doesn't support ESM
nyc - doesn't support ESM, so had to be removed and c8 is used instead
migrated to yargs 18 to support ESM
Updated graphql-request to latest version, punycode warning is fixed

Application:

* Set package.json type to module
* convert next.config.js to ESM
* Update component-props-loader reference in next.config.js:
      config.module.rules.unshift({
        test: /src\\components\\.*\.tsx$/,
        use: ['@sitecore-content-sdk\\nextjs\\dist\\tools\\component-props.loader'],
      });
* Next.js doesn't properly support type: module and moduleResolution: NodeNext:
https://github.com/vercel/next.js/issues/46078