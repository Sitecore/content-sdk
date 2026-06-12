[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/express](../README.md) / provideServerLoaderRunner

# Function: provideServerLoaderRunner()

> **provideServerLoaderRunner**(): `EnvironmentProviders`

Defined in: [packages/angular/src/server/provide-server-loader-runner.ts:19](https://github.com/Sitecore/content-sdk/blob/27b90e02c7a030fc380d3d5e51ad2edbb3c50829/packages/angular/src/server/provide-server-loader-runner.ts#L19)

Wires SSR [SERVER\_LOADER\_RUNNER](../../../loaders/variables/SERVER_LOADER_RUNNER.md) to ServerLoaderRunner
using the shared [LOADER\_REGISTRY](../../../loaders/variables/LOADER_REGISTRY.md). Include in server application providers
alongside provideLoaderRegistry.

## Returns

`EnvironmentProviders`

Environment providers for SSR loader data resolution
