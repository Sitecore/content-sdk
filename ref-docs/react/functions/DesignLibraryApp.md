[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / DesignLibraryApp

# Function: DesignLibraryApp()

> **DesignLibraryApp**(`props`): `Promise`\<`null` \| `Element`\>

Defined in: [packages/react/src/components/DesignLibrary/DesignLibraryApp.tsx:12](https://github.com/Sitecore/content-sdk/blob/f66ee3072229f1bfcc7159dae827dec3f5a04397/packages/react/src/components/DesignLibrary/DesignLibraryApp.tsx#L12)

Design Library component intended to be used by the NextJs app router application.
This component serves as a router between client and server component rendering modes
for the Design Library. The client/server runtime is loaded lazily so static import
of `DesignLibrary` / `DesignLibraryServer` does not pull those modules into every render.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `props` | `DesignLibraryServerProps` | The properties for the Design Library App. |

## Returns

`Promise`\<`null` \| `Element`\>
