[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / DesignLibraryApp

# Function: DesignLibraryApp()

> **DesignLibraryApp**(`props`): `Promise`\<`null` \| `Element`\>

Defined in: [nextjs/src/components/DesignLibrary/DesignLibraryApp.tsx:18](https://github.com/Sitecore/content-sdk/blob/a8134eb1d6b0ccc6bea8513dc8a31f6c8f5bb353/packages/nextjs/src/components/DesignLibrary/DesignLibraryApp.tsx#L18)

Next.js Design Library entry. Passes server actions that authorize the editing
secret header into the React Design Library. The React package keeps empty
default actions and uses these props instead.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `props` | `DesignLibraryServerProps` | Design Library app props from the sample layout. |

## Returns

`Promise`\<`null` \| `Element`\>

The Design Library tree, or null when the page has no route.
