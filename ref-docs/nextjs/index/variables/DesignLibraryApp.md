[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / DesignLibraryApp

# Variable: DesignLibraryApp()

> `const` **DesignLibraryApp**: (`{ page, componentMap, loadServerImportMap, loadClientImportMap, }`) => `React.JSX.Element`

Defined in: react/types/components/DesignLibrary/DesignLibraryApp.d.ts:13

Design Library component intended to be used by the NextJs app router application
This component serves as a router between client and server component rendering modes for the Design Library.
It inspects the component type from the component map and
delegates to the appropriate rendering implementation:
- Client components are rendered using the `DesignLibrary` component
- Server components are rendered using the `DesignLibraryServer` component

## Parameters

| Parameter | Type |
| ------ | ------ |
| `{ page, componentMap, loadServerImportMap, loadClientImportMap, }` | `DesingLibraryAppProps` |

## Returns

`React.JSX.Element`
