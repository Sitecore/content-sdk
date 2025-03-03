// import { SitecoreCliConfig, SitecoreCliConfigInpout } from './models';
// import { generateSites } from '../tools';

// export const getFallbackCliConfig = (): SitecoreCliConfig => ({
//   build: {
//     commands: [
//       generateSites({
//         sourcePath: 'src',
//       }),
//     ],
//   },
// });

// export const defineConfig = (cliConfig: SitecoreCliConfigInpout) => {
//   if (!cliConfig?.build?.commands) {
//     return getFallbackConfig();
//   }

//   return deepMerge(getFallbackCliConfig(), cliConfig) as SitecoreCliConfig;
// };
