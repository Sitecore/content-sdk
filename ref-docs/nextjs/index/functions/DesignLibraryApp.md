[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / DesignLibraryApp

# Function: DesignLibraryApp()

> **DesignLibraryApp**(`props`): `Promise`\<`Element` \| `null`\>

Defined in: [nextjs/src/components/DesignLibrary/DesignLibraryApp.tsx:12](https://github.com/Sitecore/content-sdk/blob/95d74dcd93e25d19170d9d00899f07b66d4bacb6/packages/nextjs/src/components/DesignLibrary/DesignLibraryApp.tsx#L12)

Design Library component intended to be used by the NextJs app router application.
This component serves as a router between client and server component rendering modes
for the Design Library. The client/server runtime is loaded lazily so static import
of `DesignLibrary` / `DesignLibraryServer` does not pull those modules into every render.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `props` | `DesignLibraryServerProps` | The properties for the Design Library App. |

## Returns

`Promise`\<`Element` \| `null`\>
