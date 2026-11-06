[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / DesignLibraryApp

# Function: DesignLibraryApp()

> **DesignLibraryApp**(`props`): `Promise`\<`Element` \| `null`\>

Defined in: [nextjs/src/components/DesignLibrary/DesignLibraryApp.tsx:12](https://github.com/Sitecore/content-sdk/blob/b124678d1f36578713f38271906f1e3a623ad001/packages/nextjs/src/components/DesignLibrary/DesignLibraryApp.tsx#L12)

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
