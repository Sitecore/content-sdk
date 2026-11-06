[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / DesignLibraryApp

# Function: DesignLibraryApp()

> **DesignLibraryApp**(`props`): `Promise`\<`null` \| `Element`\>

Defined in: [packages/react/src/components/DesignLibrary/DesignLibraryApp.tsx:12](https://github.com/Sitecore/content-sdk/blob/a8134eb1d6b0ccc6bea8513dc8a31f6c8f5bb353/packages/react/src/components/DesignLibrary/DesignLibraryApp.tsx#L12)

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
