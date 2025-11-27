[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / DesignLibraryApp

# Function: DesignLibraryApp()

> **DesignLibraryApp**(`props`): `Element`

Defined in: [packages/react/src/components/DesignLibrary/DesignLibraryApp.tsx:17](https://github.com/Sitecore/content-sdk/blob/f50ad68591b7b5a53e2085990d302267e3320840/packages/react/src/components/DesignLibrary/DesignLibraryApp.tsx#L17)

Design Library component intended to be used by the NextJs app router application
This component serves as a router between client and server component rendering modes for the Design Library.
It inspects the component type from the component map and
delegates to the appropriate rendering implementation:
- Client components are rendered using the `DesignLibrary` component
- Server components are rendered using the `DesignLibraryServer` component

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `props` | `DesingLibraryAppProps` | The properties for the Design Library App. |

## Returns

`Element`
