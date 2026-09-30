[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / DesignLibraryApp

# Function: DesignLibraryApp()

> **DesignLibraryApp**(`props`): `Element` \| `null`

Defined in: [nextjs/src/components/DesignLibrary/DesignLibraryApp.tsx:22](https://github.com/Sitecore/content-sdk/blob/d8ef09ee24ff4e01fb1e538a88aebba13f3fe89b/packages/nextjs/src/components/DesignLibrary/DesignLibraryApp.tsx#L22)

Design Library component intended to be used by the NextJs app router application
This component serves as a router between client and server component rendering modes for the Design Library.
It inspects the component type from the component map and
delegates to the appropriate rendering implementation:
- Client components are rendered using the `DesignLibrary` component
- Server components are rendered using the `DesignLibraryServer` component
- Low code components are rendered using the `DesignLibraryLowCodeComponent` component

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `props` | `DesignLibraryServerProps` | The properties for the Design Library App. |

## Returns

`Element` \| `null`
