[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / DesignLibraryApp

# Function: DesignLibraryApp()

> **DesignLibraryApp**(`props`): `Element` \| `null`

Defined in: [packages/react/src/components/DesignLibrary/DesignLibraryApp.tsx:17](https://github.com/Sitecore/content-sdk/blob/da3af374c12a806fb6f8807e6b8d4e5bb6a4d421/packages/react/src/components/DesignLibrary/DesignLibraryApp.tsx#L17)

Design Library component intended to be used by the NextJs app router application
This component serves as a router between client and server component rendering modes for the Design Library.
It inspects the component type from the component map and
delegates to the appropriate rendering implementation:
- Client components are rendered using the `DesignLibrary` component
- Server components are rendered using the `DesignLibraryServer` component

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `props` | `DesignLibraryServerProps` | The properties for the Design Library App. |

## Returns

`Element` \| `null`
