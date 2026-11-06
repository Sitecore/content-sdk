[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / DesignLibraryApp

# Function: DesignLibraryApp()

> **DesignLibraryApp**(`props`): `Promise`\<`null` \| `Element`\>

Defined in: [packages/react/src/components/DesignLibrary/DesignLibraryApp.tsx:15](https://github.com/Sitecore/content-sdk/blob/bf1778855be199e9ff2d9c4f99717b45b5cfbcf4/packages/react/src/components/DesignLibrary/DesignLibraryApp.tsx#L15)

Design Library component intended to be used by the NextJs app router application.
This component serves as a router between client and server component rendering modes
for the Design Library. The runtime loader comes from `#rsc-env`, which resolves to
a different module in the RSC and client bundles, so the `global-error` client chunk
does not reference `DesignLibraryServer`.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `props` | `DesignLibraryServerProps` | The properties for the Design Library App. |

## Returns

`Promise`\<`null` \| `Element`\>

The Design Library tree, or null when the page has no route.
